import { AppError } from "../../../Utils/AppError/AppError";
import { AppNext, AppRequest, AppResponse } from "../../../Utils/type";
import cloudinary from "../../../Utils/Cloud-Upload/cloud";
import { Post } from "../../../../Database/Model/post.model";
import { messages } from "../../../Utils/constant/messages";
import { Types } from "mongoose";
import dayjs from "dayjs";
//---------------------------------------------------Create Post--------------------------------------------------------------
export const createPost = async (
  req: AppRequest,
  res: AppResponse,
  next: AppNext
) => {
  //get data from req
  const { content } = req.body;
  const userId = req.authUser?._id;
  // upload image
  let failImages = [];
  let attachment = [];
  if (Array.isArray(req.files)) {
    for (const file of req.files) {
      const { secure_url, public_id, resource_type } =
        await cloudinary.uploader.upload(file.path, {
          folder: `Social-Media/Users/${userId}/Posts`,
          resource_type: "auto",
        });
      attachment.push({ secure_url, public_id, resource_type });
      failImages.push(public_id);
    }
  }
  console.log(attachment);
  //create post
  const post = new Post({
    content,
    attachment,
    publisher: userId,
  });
  const postCreated = await post.save();
  if (!postCreated) {
    req.failImages = failImages;
    return next(new AppError(messages.post.failToCreate, 500));
  }
  //send response
  return res.status(201).json({
    message: messages.post.createdSuccessfully,
    success: true,
    postData: postCreated,
  });
};
//---------------------------------------------------Like Or Unlike--------------------------------------------------------------

export const likeOrUnlike = async (
  req: AppRequest,
  res: AppResponse,
  next: AppNext
) => {
  //get data from params
  const { userId } = req.params;
  //check post existence
  const postExist = await Post.findById(userId); //{} | null
  if (!postExist) {
    return next(new AppError(messages.post.notFound, 404));
  }
  //check by index if user exist in likes array or not
  if (!req.authUser?._id) {
    return next(new AppError("Unauthorized", 401));
  }

  const userIdStr = req.authUser._id.toString();
  const userIndex = postExist.likes
    .map((id) => id.toString())
    .indexOf(userIdStr);
  if (userIndex == -1) {
    postExist.likes.push(new Types.ObjectId(req.authUser._id.toString()));
  } else {
    postExist.likes.splice(userIndex, 1);
  }
  //save in db
  const postUpdated = await postExist.save();

  //send response
  return res.status(200).json({
    messages: messages.post.updateSuccessfully,
    success: true,
    TotalLikes: postUpdated.likes.length,
    postUpdated,
  });
};
//---------------------------------------------------Get Posts--------------------------------------------------------------
export const getPosts = async (
  req: AppRequest,
  res: AppResponse,
  next: AppNext
) => {
  //get post
  //1-populate
  // const posts = await Post.find().populate([
  //   {path :"publisher" , select:"firstName lastName attachment.secure_url"},
  //   {path:"likes" , select:"firstName lastName attachment.secure_url "}
  // ])
  //2-aggregate
  const posts = await Post.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "publisher",
        foreignField: "_id",
        as: "publisher",
      },
    },

    { $unwind: "$publisher" },
    {
      $lookup: {
        from: "users",
        localField: "likes",
        foreignField: "_id",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "post",
        as: "comments",
      },
    },
    {
      $project: {
        "publisher.firstName": 1,
        "publisher.lastName": 1,
        "publisher.attachment.secure_url": 1,
        "attachment.secure_url": 1,
        content: 1,
        createdAt: 1,
        "likes.firstName": 1,
        "likes.lastName": 1,
        "likes.attachment.secure_url": 1,
        comments: 1,
      },
    },
  ]);
  //total post
  const TotalPost = await Post.countDocuments({ isDeleted: false });
  const postsWithShare = posts.map((p) => ({
    ...p,
    timeAgo: dayjs(p.createdAt).fromNow(),
    createdAtFormatted: dayjs(p.createdAt).format("dddd DD MMMM YYYY • h:mm A"),
    shareLink: `${
      process.env.BASE_URL || "https://social-media-iota-teal.vercel.app/"
    }api/v1/post/${p._id}`,
  }));
  //send response
  return res
    .status(200)
    .json({ success: true, postData: postsWithShare, TotalPost });
};
//---------------------------------------------------Get Specific Posts--------------------------------------------------------------
export const getSpecificPost = async (
  req: AppRequest,
  res: AppResponse,
  next: AppNext
) => {
  //get data from  params
  const { id } = req.params;
  //check post Existence
  const postExistence = await Post.findById(id);
  if (!postExistence) {
    return next(new AppError(messages.post.notFound, 404));
  }
  //get post
  const post = await Post.findOne({ _id: id, isDeleted: false }).populate([
    { path: "publisher", select: "firstName lastName attachment.secure_url" },
    { path: "likes", select: "firstName lastName attachment.secure_url " },
    { path: "comments", match: { parentComment: { $exists: false } } },
  ]);
  //share link
  const shareLink = `${
    process.env.BASE_URL || "https://social-media-iota-teal.vercel.app/"
  }api/v1/post/${postExistence.id}`;
  //send response
  return res.status(200).json({ success: true, post, shareLink });
};
//---------------------------------------------------Delete Posts--------------------------------------------------------------
export const deletePost = async (
  req: AppRequest,
  res: AppResponse,
  next: AppNext
) => {
  //get data from req
  const { id } = req.params;
  const userId = req.authUser?._id;
  // find post and delete
  const post = await Post.findOneAndDelete({
    _id: id,
    publisher: userId,
  }).populate([
    {
      path: "comments",
      match: { parentComment: { $exists: false } },
      select: "_id attachment ",
    },
  ]);
  //post wrong id or not owner post
  if (!post) {
    return next(new AppError(messages.post.notFound, 404));
  }
  //delete attachment post from cloud
  for (const posts of post.attachment) {
    await cloudinary.uploader.destroy(posts.public_id);
  }
  //delete comment related to post
  const populatedPost = post as any;
  for (const comment of populatedPost.comments) {
    if (comment.attachment.public_id) {
      await cloudinary.uploader.destroy(comment.attachment.public_id);
    }
    await comment.deleteOne();
  }
  //send response
  return res
    .status(200)
    .json({ message: messages.post.deleteSuccessfully, success: true, post });
};
//---------------------------------------------------Archive Posts--------------------------------------------------------------
export const archivePost = async (
  req: AppRequest,
  res: AppResponse,
  next: AppNext
) => {
  //get data from req
  const { id } = req.params;
  const userId = req.authUser?._id;
  // find post and update
  const post = await Post.findOneAndUpdate(
    { _id: id, publisher: userId, isDeleted: false },
    { isDeleted: true },
    { new: true }
  );
  if (!post) {
    return next(new AppError(messages.post.notFound, 404));
  }
  //send response
  return res
    .status(200)
    .json({ message: messages.post.archivedSuccessfully, success: true, post });
};
//---------------------------------------------------Restore Posts--------------------------------------------------------------
export const restorePost = async (
  req: AppRequest,
  res: AppResponse,
  next: AppNext
) => {
  //get data from req
  const { id } = req.params;
  const userId = req.authUser?._id;
  // find post and update
  const post = await Post.findOneAndUpdate(
    { _id: id, publisher: userId, isDeleted: true },
    { isDeleted: false },
    { new: true }
  );
  if (!post) {
    return next(new AppError(messages.post.notFound, 404));
  }
  //send response
  return res
    .status(200)
    .json({ message: messages.post.restoredSuccessfully, success: true, post });
};
//---------------------------------------------------Get Posts Pagination--------------------------------------------------------------
export const getPostsPaginate = async (
  req: AppRequest,
  res: AppResponse,
  next: AppNext
) => {
  //get data from req

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  //find post
  const posts = await Post.paginate(
    { isDeleted: false },
    {
      page,
      limit,
      customLabels: {
        totalDocs: "TotalPosts",
        docs: "PostsData",
      },
      populate: [
        {
          path: "publisher",
          select: "firstName lastName attachment.secure_url",
        },
        { path: "likes", select: "firstName lastName attachment.secure_url " },
      ],
      lean:true
    }
  );
  //send response
  return res.status(200).json({ success: true, posts });
};

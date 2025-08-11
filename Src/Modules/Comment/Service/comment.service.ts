import { Comment, Post } from "../../../../Database";
import { AppError } from "../../../Utils/AppError/AppError";
import cloudinary from "../../../Utils/Cloud-Upload/cloud";
import { messages } from "../../../Utils/constant/messages";
import { AppNext, AppRequest, AppResponse } from "../../../Utils/type";

//---------------------------------------------------Create Comment--------------------------------------------------------------
export const createComment = async (
  req: AppRequest,
  res: AppResponse,
  next: AppNext
) => {
  //get data from req
  const { postId } = req.params;
  const { text } = req.body;
  console.log("BODY:", req.body);
  console.log("FILES:", req.files);
  // console.log({post , text});
  //check post existence
  const postExistence = await Post.findById(postId);
  if (!postExistence) {
    return next(new AppError(messages.comment.notFound, 404));
  }
  //upload attachment
  const files = req.files as Record<string, Express.Multer.File[]>;
  console.log(files);

  let attachment;
  let failImages = [];
  if (files?.attachment && files.attachment.length > 0) {
    let { secure_url, public_id, resource_type } =
      await cloudinary.uploader.upload(files.attachment[0].path, {
        folder: `Social-Media/Users/${postExistence.publisher}/Posts/Comment`,
        resource_type: "auto",
      });
    attachment = { secure_url, public_id, resource_type };
    failImages.push(public_id);
  }
  //upload voice
  const allowedAudioTypes = [
    "audio/midi",
    "audio/mpeg",
    "audio/webm",
    "audio/ogg",
    "audio/wav",
    "audio/x-wav",
    "audio/x-m4a",
    "audio/aac",
    "audio/mp3",
  ];
  let voice;
  if (files?.voice && files.voice.length > 0) {
    const voiceFile = files?.voice[0];

    if (!allowedAudioTypes.includes(voiceFile?.mimetype)) {
      return next(
        new AppError("Only audio files are allowed in 'voice' field", 400)
      );
    }
    let { secure_url, public_id, resource_type, duration } =
      await cloudinary.uploader.upload(voiceFile.path, {
        folder: `Social-Media/Users/${postExistence.publisher}/Posts/Comment`,
        resource_type: "auto",
      });
    voice = { secure_url, public_id, resource_type, duration };
    failImages.push(public_id);
    //prepare data
    console.log(req.files);
  }

  const comment = new Comment({
    post: postId,
    userComment: req.authUser?._id,
    text,
    attachment,
    voice,
  });
  //save to db
  const commentCreated = await comment.save();
  if (!commentCreated) {
    return next(new AppError(messages.comment.failToCreate, 500));
  }
  //save response
  return res
    .status(200)
    .json({
      message: messages.comment.createdSuccessfully,
      success: true,
      CommentData: commentCreated,
    });
};
//---------------------------------------------------Get Comment--------------------------------------------------------------
export const getComment = async (
  req: AppRequest,
  res: AppResponse,
  next: AppNext
) => {
  //get data from req
  const { postId } = req.params;
  //get comment
  const commentData = await Comment.find({ post: postId }).populate([
    { path: "userComment", select: "firstName lastName attachment.secure_url" },
    { path: "likes", select: "firstName lastName attachment.secure_url" },
    {
      path: "post",
      populate: [
        {
          path: "publisher",
          select: "firstName lastName attachment.secure_url",
        },
        { path: "likes", select: "firstName lastName attachment.secure_url" },
      ],
    },
  ]);
  //total comment
  const TotalComment = await Comment.countDocuments();
  //send response
  return res.status(200).json({ success: true, TotalComment, commentData });
};

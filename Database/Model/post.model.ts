import dayjs from "dayjs";
import "dayjs/locale/ar";
import relativeTime from "dayjs/plugin/relativeTime";
import mongoose, { model, Schema } from "mongoose";

//time
dayjs.extend(relativeTime)
dayjs.locale("ar")
interface Attachment{
 secure_url:string,
 public_id:string,
 resource_type:string
   
}

//interface
interface IPost{
    content:string,
    attachment:Attachment[],
    publisher:mongoose.Types.ObjectId;
    likes:mongoose.Types.ObjectId[]
    isDeleted:boolean
    createdAt?: Date;
  updatedAt?: Date;
}
//schema
const postSchema = new Schema<IPost>({
    content:{
        type:String
    },
    attachment:[{
        secure_url:{
            type:String, required:true
        },
        public_id:{
            type:String, required:true
        },
        resource_type:{
            type:String
        },

    }],
    publisher:{
        type:Schema.Types.ObjectId,
        ref:"User",
        // required:true,
    },
    likes:[{
        type:Schema.Types.ObjectId,
        ref:"User"
    }],
    //archive
    isDeleted:{
        type:Boolean,
        default:false
    }
},{timestamps:true , toJSON:{virtuals:true},toObject:{virtuals:true}})
//comment virtual
postSchema.virtual("comments",{
    ref:"Comment",
    localField:"_id",
    foreignField:"post"
})
//time 
postSchema.virtual("timeAgo").get(function () {
  return dayjs(this.createdAt!).fromNow();
});
postSchema.virtual("createdAtFormatted").get(function () {
  return dayjs(this.createdAt!).format("dddd DD MMMM YYYY • h:mm A");
});
//model
export const Post = model<IPost>('Post',postSchema)
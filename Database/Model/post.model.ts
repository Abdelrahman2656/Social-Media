import mongoose, { model, Schema, Types } from "mongoose"


//
interface Attachment{
 secure_url:string,
 public_id:string
}

//interface
interface IPost{
    content:string,
    attachment:Attachment[],
    publisher:mongoose.Types.ObjectId;
    likes:mongoose.Types.ObjectId[]
    isDeleted:boolean
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
        
    }],
    publisher:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
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
})
//model
export const Post = model<IPost>('Post',postSchema)
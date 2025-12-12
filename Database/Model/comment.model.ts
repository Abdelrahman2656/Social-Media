import mongoose, { model, Mongoose, Schema, Types } from "mongoose";
import cloudinary from "../../Src/Utils/Cloud-Upload/cloud";
interface Attachment{
 secure_url:string,
 public_id:string,
 resource_type:string

}
interface IAttachment{
 secure_url:string,
 public_id:string,
 resource_type:string
 duration:number
}
//interface
interface IComment {
    post:mongoose.Types.ObjectId
    userComment:mongoose.Types.ObjectId
    text:string
    attachment?:Attachment
    likes:mongoose.Types.ObjectId[]
    voice?:IAttachment,
    parentComment:mongoose.Types.ObjectId
}
//schema 
const commentSchema = new Schema<IComment>({
    post:{
        type:Schema.Types.ObjectId,
        ref:"Post",
        required:true
    },
    userComment:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    text:{
        type:String,
        required:function(){
            return !this.attachment 
        }
    },
    attachment:{
        secure_url:{
            type:String,
          
        },
        public_id:{
            type:String,
         
        },
        resource_type:{
             type:String,
          
        }
    },
    voice:{
          secure_url:{
            type:String,
         
        },
        public_id:{
            type:String,
          
        },
        resource_type:{
             type:String,
          
        },
        duration:Number
    },
    likes:[{
        type:Schema.Types.ObjectId,
        ref:"User",

    }],
    parentComment:{
type:Schema.Types.ObjectId,
ref:"Comment"
    }
},{
    timestamps:true
})
//mongoose hook to delete replies 
commentSchema.post("deleteOne",{document:true , query :false},async function(doc , next){
//check replies related comment
const CommentModel = this.constructor as mongoose.Model<IComment>;

const replies = await CommentModel.find({parentComment:doc._id})
if(replies.length > 0){
    for (const reply of replies) {
        //delete attachment from cloud 
        if(reply.attachment?.public_id){
            await cloudinary.uploader.destroy(reply.attachment.public_id)
        }
        //delete reply from db 
        await reply.deleteOne()
    }
}
next()
})
//model 
export const Comment = model<IComment>("Comment",commentSchema)
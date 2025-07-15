import mongoose, { model, Schema, Types } from "mongoose";
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
    voice?:IAttachment
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

    }]
},{
    timestamps:true
})
//model 
export const Comment = model<IComment>("Comment",commentSchema)
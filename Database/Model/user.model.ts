import mongoose, { model, Schema, Types } from "mongoose";
import { providers, roles } from "../../Src/Utils/constant/enum";
import { Hash } from "../../Src/Utils/encryption";

//schema
interface Image{
 secure_url:string,
 public_id:string
}
interface IUser {
  
  firstName: string;
  lastName: string;
  email: string;
  password?: String;
  isConfirmed: boolean;
  isDeleted: boolean;
  role: string;
  otpEmail: String;
  expiredDateOtp: Date;
  DOB: string;
  provider: string;
  phone: String;
  attachment:Image[],
  userCode:string,
 viewers: {
  userId: mongoose.Types.ObjectId;
  lastViews: [Date];
  count:number
}[];
}
// Mongoose Document Type
export interface UserDocument extends IUser, Document { _id: Schema.Types.ObjectId;}
const userSchema = new Schema<UserDocument>({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 15,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 15,
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
  },
  provider: {
    type: String,
    enum: Object.values(providers),
    default: providers.SYSTEM,
  },
  password: {
    type: String,
    validate: {
      validator: function (this: IUser, value: string) {
        if (this.provider === providers.SYSTEM) {
          return !!value; // Password is required for SYSTEM (must be truthy)
        }
        return true; // If provider is Google, password is optional
      },
      message: "Password is required for SYSTEM provider",
    },
    trim: true,
  },
  attachment:{
    secure_url:{
      type:String,
        validate: {
      validator: function (this: IUser, value: string) {
        if (this.provider === providers.SYSTEM) {
          return !!value; 
        }
        return true; 
      },
      message: "Image is required for SYSTEM provider",
    },
    },
    public_id:{
      type:String,
        validate: {
      validator: function (this: IUser, value: string) {
        if (this.provider === providers.SYSTEM) {
          return !!value; 
        }
        return true; 
      },
      message: "Image is required for SYSTEM provider",
    },
    },
  },
  phone: {
    type: String,
    unique: true,
    trim: true,
    sparse: true,
  },
  role: {
    type: String,
    enum: Object.values(roles),
    default: roles.USER,
  },
  isConfirmed: {
    type: Boolean,
    default: false,
  },
userCode: {
  type: String,
  unique: true,
  required: true
},
  isDeleted: {
    type: Boolean,
    default: false,
  },
  DOB: {
    type: String,
    default: () => new Date().toISOString(),
  },
  viewers:[
{
   userId:{type:Schema.Types.ObjectId , ref:"User"},
 lastViews:[{type:Date}  ],
  count:{type:Number , default:1},
 
_id:false
}
  ],
  otpEmail: String,
  expiredDateOtp: Date,
});
//pre 
//hash Password
userSchema.pre("save",function(next){
// this >> doc
if(this.isModified("password") && typeof this.password === "string"){
this.password = Hash({key:this.password  , SALT_ROUNDS:process.env.SALT_ROUNDS})
}
next()
})


//model
export const User = model<UserDocument>("User", userSchema);

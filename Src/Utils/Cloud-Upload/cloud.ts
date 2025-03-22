import { v2 as cloudinary } from 'cloudinary';
import path from "path"
import dotenv from 'dotenv'

//dotenv
dotenv.config({ path: path.resolve("./.env") });

//cloudinary
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API,
    api_secret:process.env.CLOUD_SECRET
})
export default cloudinary


//fail image upload
export const deleteCloudImage = async(public_id:string)=>{
     await cloudinary.uploader.destroy(public_id)
}
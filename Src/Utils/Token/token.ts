import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'
import { AppError } from '../AppError/AppError'
interface Token {
    _id?: string;
    [key:string]:any
}
interface GenerateToken {
    payload:Token,
    secretKey?:string,
    options?: SignOptions;
}
export const generateToken =({payload , secretKey = process.env.SECRET_TOKEN as string,options}:GenerateToken):string=>{

return jwt.sign(payload,secretKey,options)
}




//verify
// interface VerifyToken {
//     token:string,
//     secretKey?:string
// }
// export const verifyToken = ({ token, secretKey = process.env.SECRET_TOKEN as string }: VerifyToken): JwtPayload | { message: string } => {


//     try {
//       const decoded = jwt.verify(token, secretKey) as JwtPayload;
//       console.log("✅ Decoded Token:", decoded); // 🔍 تحقق من البيانات بعد فك التشفير
//       return decoded;
//     } catch (error) {
//       console.error("❌ Token Verification Error:", error);
//       return { message: (error as Error).message };
//     }
//   };



// Define a custom type for JWT payload
interface CustomJwtPayload extends JwtPayload {
    _id?: string;
  }
  
  interface VerifyTokenParams {
    token: string;
    secretKey?: string;
  }
  
  export const verifyToken = ({
    token,
    secretKey = process.env.SECRET_TOKEN as string,
  }: VerifyTokenParams): CustomJwtPayload | null => {
    try {
      if (!token) {
        console.error("❌ Token is missing");
        return null;
      }
  
      // Verify the token
      let decoded = jwt.verify(token, secretKey) as CustomJwtPayload;
      console.log("✅ Decoded Token:", decoded);
  
      // Ensure `_id` exists in the payload
      if (!decoded || !decoded._id) {
        console.error("❌ Token missing '_id' field");
        return null;
      }
  
      return decoded;
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        console.error("❌ Token has expired");
      } else if (error.name === "JsonWebTokenError") {
        console.error("❌ Invalid token signature");
      } else {
        console.error("❌ Token Verification Error:", error.message);
      }
      return null;
    }
  };
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'
import { AppError } from '../AppError/AppError'
interface Token {
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
interface VerifyToken {
    token:string,
    secretKey?:string
}
export const verifyToken = ({ token, secretKey = process.env.SECRET_TOKEN as string }: VerifyToken): JwtPayload | { message: string } => {
    try {
      const decoded = jwt.verify(token, secretKey) as JwtPayload;
      console.log("✅ Decoded Token:", decoded); // 🔍 تحقق من البيانات بعد فك التشفير
      return decoded;
    } catch (error) {
      console.error("❌ Token Verification Error:", error);
      return { message: (error as Error).message };
    }
  };
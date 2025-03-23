import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken'

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


//verify token  
  interface VerifyTokenParams {
    token: string;
    secretKey?: string;
}

export const verifyToken = ({ token, secretKey = process.env.SECRET_TOKEN as string }: VerifyTokenParams): JwtPayload | null => {
    try {
        if (!token) {
            console.error("❌ Token is missing");
            return null;
        }

        const decoded = jwt.verify(token, secretKey) as JwtPayload;
        console.log("✅ Decoded Token:", decoded);

        if (!decoded || (!("_id" in decoded) && !("id" in decoded))) {
            console.error("❌ Token missing 'id' or '_id' field");
            return null;
        }

        // Ensure consistency: Always use "_id"
        decoded._id = decoded._id || decoded.id;
        delete decoded.id;

        return decoded;  // ✅ Add this return statement
    } catch (error) {
        console.error("❌ Token Verification Error:", error);
        return null;  // Return null instead of throwing an error
    }
};







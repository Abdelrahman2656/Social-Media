import CryptoJS from "crypto-js"
interface EncryptParams {
    key: string;
    secretKey?: string;
  }
export const Encrypt = ({key ,secretKey= process.env.SECRET_CRYPTO as string}:EncryptParams) =>{
return CryptoJS.AES.encrypt(key, secretKey).toString();
}
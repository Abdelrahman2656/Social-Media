import CryptoJS from "crypto-js"
interface DecryptParams {
    key: string;
    secretKey?: string;
  }
export const Decrypt=({key ,secretKey=process.env.SECRET_CRYPTO as string }:DecryptParams)=>{
  return CryptoJS.AES.decrypt(key, secretKey).toString(CryptoJS.enc.Utf8);

}  
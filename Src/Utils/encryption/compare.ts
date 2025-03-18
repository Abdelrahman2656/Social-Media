import bcrypt from 'bcrypt'
interface CompareParams {
    password : string,
    hashPassword: string ;
}
export const comparePassword = ({password,hashPassword}:CompareParams)=>{
    return bcrypt.compareSync(password, hashPassword)

}
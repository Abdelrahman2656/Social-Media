import bcrypt from 'bcrypt'
interface HashParams {
    key : string,
    SALT_ROUNDS?: string | number;
}
export const Hash = ({key ,SALT_ROUNDS=process.env.SALT_ROUNDS as string}:HashParams)=>{
    return bcrypt.hashSync(key,Number(SALT_ROUNDS))

}
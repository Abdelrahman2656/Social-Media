

//user roles
interface Roles {
    USER:string,
    ADMIN:string
}
export const roles:Roles={
    USER:'user',
    ADMIN:"admin"

}
Object.freeze(roles)
//user provider
interface Provider{
    SYSTEM:string,
    GOOGLE:string
}
export const providers:Provider={
    SYSTEM:"system",
    GOOGLE:"google"
}
Object.freeze(providers)
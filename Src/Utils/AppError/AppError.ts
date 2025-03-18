export class AppError extends Error{
    public statusCode:number
    constructor(message:string | string[] ,statusCode:number){
        const formattedMessage = Array.isArray(message) ? message.join(", ") : message;
       super(formattedMessage);
        this.statusCode = statusCode
    }
 

}
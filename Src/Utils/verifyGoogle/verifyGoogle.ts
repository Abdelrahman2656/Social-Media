import { OAuth2Client, TokenPayload } from "google-auth-library"

export const verifyGoogleToken=async(idToken:string): Promise<TokenPayload> =>{
    const client = new OAuth2Client()
    
    //verify 
    const ticket = await client.verifyIdToken({
    idToken,
    audience:process.env.CLIENT_ID
    })
    //send payload
    const payload = ticket.getPayload()
    console.log(payload);
    return payload as TokenPayload;
    
}
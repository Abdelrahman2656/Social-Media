"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyGoogleToken = void 0;
const google_auth_library_1 = require("google-auth-library");
const verifyGoogleToken = async (idToken) => {
    const client = new google_auth_library_1.OAuth2Client();
    //verify 
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.CLIENT_ID
    });
    //send payload
    const payload = ticket.getPayload();
    console.log(payload);
    return payload;
};
exports.verifyGoogleToken = verifyGoogleToken;

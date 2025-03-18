import nodemailer from 'nodemailer'
interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    attachments?: nodemailer.SendMailOptions["attachments"];
}

export const sendEmail=async({to ,subject, html ,attachments=[] }:EmailOptions)=>{
const transporter = nodemailer.createTransport({
    
    service: "gmail",
    port:456,
    secure:true,
    auth:{
        user:process.env.USER_SENDER,
        pass:process.env.PASS_EMAIL
    }
    
})
await transporter.sendMail({
    to,
    from:`"Smart Choice Account" <${process.env.USER_SENDER}>`,
    subject,
    html,
    attachments


})
console.log(`✅ Email sent to ${to}`);
}
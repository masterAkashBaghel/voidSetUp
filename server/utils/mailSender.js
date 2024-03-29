import nodeMailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
//function to send the mail
const mailSender = async (email,title,body)=>{

    try{
        let transporter = nodeMailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            }
        })
        let info = await transporter.sendMail({
            from:'SkylineNotion || voidSetUp -by Akash Singh',
            to: `${email}`,
            subject:`${title}`,
            html:`${body}`,
        })
        console.log(info);
        return info;

    }catch(e){
        console.log(e.message);
    }
}
module.exports = mailSender;
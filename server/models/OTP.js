import mongoose from "mongoose";
import mailSender from '../utils/mailSender.js';

const OTPSchema = new mongoose.Schema({

    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,

    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,
    }
});


// function to send email vrification

async function sendVerificationEmail(email,otp) { 
    try{
        const mailResponse = await mailSender(email,"Verification email from VoidSetUp",otp);
        console.log("mail sent successfully" ,mailResponse);

    }catch(e){
        console.log("error sending verification email",e);
        throw e;
    }
}

OTPSchema.pre("save",async function(next){
    await sendVerificationEmail (this.email,this.otp);
    next();
})
module.exports = mongoose.model("OTP",OTPSchema)
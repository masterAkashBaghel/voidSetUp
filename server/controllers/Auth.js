

import User from '../models/User.js';
import OTP from '../models/OTP.js';
import Profile from '../models/Profile.js';
import otpGenerator from 'otp-generator';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

//function to send the otp here unique otp will be genrated and and will be saved in to the database(otp model)
export const sendOTP = async (req,res)=>{

    try{
        
        const {email} = req.body;
        const checkUserPresent = await User.findOne({email});
        if(checkUserPresent)
        {
            return res.status(401).json({
                success: false,
                message:"User already exists"
            })
        }

        // generate otp
        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        console.log("otp is : " , otp);

        //check for unique otp (bruteforce approach need optimizations)
        let result = await OTP.findOne({otp: otp});
        
        while(result)
        {
            otp = otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });
            result = await OTP.findOne({otp: otp});
        }
         //saving the otp in database
        const otpPayload = {email,otp};
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody)

        res.status(200).json({
            success: true,
            message:"Otp generated successfully",
        })

    }catch(error){

        console.log(error.message);
        res.status(500).json({
            success: false,
            message:error.message,
        })
    }
}



// signup function
export const signUp = async (req,res)=>{

    try{
        //perform the necessary validation
       const {firstName,lastName,email,password,confirmPassword,accountType,otp,contactNumber} = req.body;
       if(!firstName || !lastName || !email || !password || !confirmPassword || !otp || !contactNumber  )
       {
        return res.status(403).json({
            success: false,
            message: " All fields are required",
        });
       }

       // check the passwords matches or not
       if(password !== confirmPassword)
       { 
         return res.status(400).json({
            success: false,
            message:" both passwords should match",
         });
       }

       //check for exixting user
       const exixtingUser = await User.findOne({email})
       if(exixtingUser)
       {
        return res.status(400).json({
            success: false,
            message:" user already exists",
        });
       }
     
       //find most recent otp
       const recentOtp = await OTP.find({email}).sort({createdAt: -1}).limit(1);
       console.log(recentOtp);
       if(recentOtp.length == 0)
       {
        return res.status(400).json({
            success: false,
            message:" otp not found",
        });
       }
       else if (otp !== recentOtp)
       {
        return res.status(400).json({
            success: false,
            message:"otp didnt match ",
        });
       }

       // hashing the password

       const hashedPassword = await bcrypt.hash(password,10);

       // we have to save the profile details thats why creating an instance of profile details here

       const profileDetails = await Profile.create({
        gender:null,
        about:null,
        contactNumber:null,
        dateOfBirth:null,
       })

       // now creating an entry to save the user 
       const user = await User.create({
        firstName,
        lastName,
        password:hashedPassword,
        email,
        contactNumber,
        accountType,
        additionalDetails:profileDetails._id,
        image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,

       });

       // returning the user

       return res.status(200).json({
          success: true,
          message:" user created successfully",
          user,
       })

    }catch(err){
        console.log("error creating user", err);
        return res.status(500).json({
            success: false,
            message:" user creation failed try again",
        })
    }
} 

// log in controller

export const login = async (req, res) => {

    try{

        //validate the user
        const {email, password} = req.body;
        if(!email || !password)
        {
            return res.status(403).json({
                success: false,
                message:" all the fields are required",
            })
        }
        const user = await User.find({email});
        if(!user)
        {
            return res.status(401).json({
                success: false,
                message:'user not found',
            })
        }

        // comparing the password
        if( await bcrypt.compare(password,user.password) )
        {
            // creating token
            const payload = {
                email : user.email,
                id : user._id,
                role: user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY,{expiresIn:"2h"})
            user.token = token;
            user.password = undefined;

            // create cookie and send response 
            const options = {
                expiresIn: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true,
            }
            res.cookie("token", token , options).status(200).json({
                success: true,
                token,
                user,
                message:" user login successful",
            })
        }
       else{
        return res.status(401).json({
            success: false,
            message:" password didint match try again",
        })
       }
    }catch(err){

        console.log(" error while loggong in", err);
        res.status(500).json({
            success: false,
            message:" user login failed",
        })

    }
}

// function to change password 

export const changePassword = async (req, res) => {
    try{
         
    }catch(err){

    }
}
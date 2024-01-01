import User from "../models/User.js";
import  Jwt  from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


export const auth = async (req, res, next) => {

    try{
        // extract token
         const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");
         if(!token)
         {
            return res.status(401).json({
                success: false,
                message:" token is missing",
            })
         }

         // verify the token
         try{
            const decode =  Jwt.verify(token,process.env.JWTT_SECRET_KEY)
            console.log(decode)
            req.user = decode;

         }catch(e){
              console.log("error while verifying token: " + e.message)
              return res.status(401).json({
                success: false,
                message:" invalid token",
              });
         }
         next();


    }catch(err){
        console.log("errror while verifying token: " + err.message)
        return res.status(401).json({
            success: false,
            message:"error while verifying token: " ,
        });

    }
}


// is student middleware

export const isStudent = async (req,res,next) => {
    try{
       if(req.user.accountType !== "Student")
       {
        return res.status(401).json({
            success: false,
            message:" this is protected route an u are not student",
        })
       }
       next();

    }catch(err){
        console.log(err)
        return res.status(501).json({
            success: false,
            message:" error while getting roles",
        })

    }
}

// is instructur middleware

export const isInstructor = async (req,res,next) => {
    try{
        if(req.user.accountType !== "Instructor")
        {
            return res.status(401).json({
                success: false,
                message:" this is protetcted route for instructor only",
            });
        }
        next();
    }catch(err)
    {
        console.log(err.message);
        return res.status(501).json({
            success: false,
            message:" error while getting roles",
        })
    }
}

// is admin middleware
export const isAdmin = async (req,res,next) => {
    try{
        if(req.user.accountType !== "Admin")
        {
            return res.status(401).json({
                success: false,
                message:" this is protetcted route for admin only",
            })
        }
        next();
    }catch(err)
    {
        console.log(err.message);
        return res.status(501).json({
            success: false,
            message:" error while getting roles",
        })
    }
}
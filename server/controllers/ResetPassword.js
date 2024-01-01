import User from "../models/User.js"
import mailSender from "../utils/mailSender.js"
import bcrypt from "bcrypt";


// reset password token 

export const resetPasswordToken = async (req,res)=>{
    try{

        // get email from req body
         const { email } = req.body;

         // finding the user 
          const  user = await User.findOne({ email: email});
          if(!user)
          {
            return res.status(401).json({
                success: false,
                message:" you are not registred as a user",
            });
          }
          // genrate the token that will help in creating links which will be sent to mail for password reset
          const token = crypto.randomUUID();
          // update the user by adding the token and expiry time
          const updatedDetails = await User.findOneAndUpdate({email:email},{token:token, resetPasswordExpires: Date.now()+ 5*60*1000},{new:true});

          // create url 
          const url = `https://localhost:3000/update-password/${token}`;
          // send the mail containing the url

          await mailSender(email,"password reset link ", `reset linl : ${url}`);

          return res.json({
            success: true,
            message:" mail sent successfully",
          });


    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message:" somthing went wrong",
        })

    }
}

// reset the password

export const resetPassword = async (req,res)=>{
    try{
        // data fetch
        const {password, confirmPassword,token} = req.body;
        // validation 
        if(!password || !confirmPassword)
        {
            return res.status(500).json({
                success: false,
                message:" all fileds are required ",
            })
        }
        if(confirmPassword!== password)
        {
            return res.status(500).json({
                success: false,
                message:" password didnt match",
            })
        }
        // get user details from the db by using the token as token is saved in the database when user clicks in forget password
        const userDetails = await User.findOne({token:token});
         if(!userDetails)
         {
            return res.json({
                success: false,
                message:" invalid token",
            })
         }
         // check the time of token
         if(userDetails.resetPasswordExpires < Date.now())
         {
            return res.json({
                success: false,
                message:" token expired",
            });
         }
         // hash the password
         const hashedPassword = await  bcrypt.hash(password,10);

         //update the password

         await User.findOneAndUpdate({token:token},{password:hashedPassword},{new:true});

         return res.status(200).json({
            success: true,
            message:" Pssword updated successfully",
         })


    }catch(err){
      console.log(" error while reseting password ",err);
      return res.status(500).json({
        success: false,
        message:" password reset failed",
      })
    }
}
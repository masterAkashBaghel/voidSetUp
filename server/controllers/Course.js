import Course from "../models/Course.js";
import User from "../models/User.js";
import Tags from "../models/Tags.js";
import { uploadImageToCloudinary } from "../utils/imageUploader.js";
import dotenv from "dotenv";
dotenv.config();


// create course handler
export const createCourse = async (req,res)=>{
    try{
     
        const {courseName,courseDescription,price,tag,whatYOUWillLearn} = req.body;
        const thumbnail = req.files.thumbnailImage;
        if(!courseDescription || !courseName || !price || !tag || !whatYOUWillLearn)
        {
            return res.status(401).json({
                success:false,
                message:" all fields are required"
            });
        }
        // check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("instructorDetails", instructorDetails);
        if(!instructorDetails) {
            return res.status(404).json({
                success: false,
                message:" no instructor found",
            });
        }

        // validating tags
        const tagdetails = await Tags.findById(tag);
        if(!tagdetails) {
            return res.status(404).json({
                success: false,
                message:" no tags found",
            });
        }

        // upload image to cloudinary

        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        // create an entry for new course

        const newCourse = await Course.create({
            courseDescription,
            courseName,
            instructor : instructorDetails._id,
            whatYOUWillLearn,
            price,
            tag : tagdetails._id,
            thumbnail : thumbnailImage.secure_url,
        })

        // ad new course to instructor
        await User.findByIdAndUpdate({_id: instructorDetails._id}, 
                   {
                      $push:{
                        courses : newCourse._id,
                      }
                   }, {new:true});


       // update the tag schema

       await Tags.findByIdAndUpdate(
           {_id:tagdetails._id},
           { 
             $push :{
                description: newCourse.description, name : newCourse.courseName ,course : newCourse._id,
             }
           },
           {new:true}
       );



       return res.status(200).json({
        success: true,
        message:" course created successfully" ,
        data:newCourse,
       });


    }catch(e){
        console.log("error while creating course ", e);
        return res.status(500).json({
            success: false,
            message:" error while creating course",
        });
    }
}


// get all courses 

export const showAllCourses = async (req, res) => {
    try{

        const allCourses = await Course.find({});
        // {courseName:true, price:true,thumbnail:true,instructor:true,ratingAndReviews:true,studentsEnrolled:true}).populate("instructor").exec();

        return res.status(200).json({
            success: true,
            message:" courses retrived successfullsy",
            data :allCourses,
        });



    }catch(e){
        console.log(e)
        return res.status(500).json({
            success: false,
            message:" cant get all courses",
            error:e.message,
        });
    }
}

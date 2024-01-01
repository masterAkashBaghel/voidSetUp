import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    gender:{
        type:String,
    },
    dateOfBirth:{
        type:String,
    },
    about:{
        type:String,
        trim:true,
    },
    contactNumber:{
        type:Number,
        true:true,
    }

})

module.exports =mongoose.model('Profile',profileSchema);
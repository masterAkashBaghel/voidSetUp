import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const Connection = async ()=>{
    try{
      await mongoose.connect(process.env.MONGODB_URL);
      console.log("database connection established");
    }catch(e){
      console.log("error connecting to MongoDB");
    }
}

export default Connection;
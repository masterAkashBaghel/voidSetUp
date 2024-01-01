import Tags from "../models/Tags.js"


// handler for creating tags by the admin
export const createTag = async (req,res)=>{
    try{
        const {name , description} = req.body;
        if(!name || !description)
        {
            return res.status(401).json({
                success: false,
                message:" please enter all required fields"
            });
        }
        // create a new tag
        const tagDetails = await Tags.create({
            name: name,
            description: description,
        })
        console.log(tagDetails);

        return res.status(200).json({
            success :true,
            message:" tags created successfully"
        });

    }catch(err){
        console.log(`error creating tags : ${err.message}`)
        res.status(500).json({
            success : false,
            message:" error creating tags"
        });

    }
}

// handler to retrive all tags

export const getAllTags =  async (req, res) => {
    try{

        const allTags = await Tags.find({},{name:true, description:true});
        res.status(200).json({
            success:true,
            message:" tags were found",
            allTags,
        })

    }catch(err){
        console.log(err.message);
        res.status(500).json({
            success: false,
            message:" error getting tags"
        });
    }
}
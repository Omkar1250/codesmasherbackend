const {Mongoose} = require('mongoose')
const Category = require("../Models/Category")


exports.createCategory = async(req, res) => {
    try{
        const {
            name,
            description
        } =   req.body;

        if(!name){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        const CategoryDetails = await Category.create({
            name:name,
            description: description
        })
        console.log(CategoryDetails)

        return res.status(200).json({
            success:true,
            message:"Category created successfully"
        });
    }catch(error){
        return redirect.status(500).json({
            success:true,
            message: error.message
        })
    }
}

//Controller to showall categories

exports.showAllCategories = async(req, res)=> {
    try {
        console.log("Inside ShowAllCategories-----------------");
        const allCategory = await Category.find({});
        res.status(200).json({
            success:true,
            message:"All categories fetch Successfully",
            data: allCategory
        })
    } catch (error) {
        console.log(error.message); 
        return res.status(400).json({
            success:false,
            message:error.message, 
            
        })
    }
}
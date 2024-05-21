const {Mongoose} = require('mongoose')
const Category = require("../Models/Category")

function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }

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


exports.categoryPageDetails = async (req, res) => {
    try {
        const {categoryId} = req.body
        console.log("PRINTING id", categoryId)

        const selectedCategory = await Category.findById(categoryId)
        .populate({
            path: "posts",
            populate: "comments",
            populate: "author",
        })
        

        if(!selectedCategory){
            console.log("Category Not Found")
            return res.status(404).json({
                success:false,
                message: "Category Not Found"
            })
        }

        if(selectedCategory.posts.length === 0) {
            return res.status(404).json({
              success: false,
              message: "No posts found for the selected category.",
            })
          }

             // Get courses for other categories
      const categoriesExceptSelected = await Category.find({
        _id: { $ne: categoryId },
      })
      let differentCategory = await Category.findOne(
        categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
          ._id
      )
        .populate({
          path: "posts",
        })
        .exec()

        res.status(200).json({
            success: true,
            data: {
              selectedCategory,
              differentCategory,
           
            },
          })
        } catch (error) {
          return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
          })
        }
      }
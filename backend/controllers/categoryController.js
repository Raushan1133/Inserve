import categoryModel from "../models/CategoryModel.js";


const allCategoryList = async(req,res)=>{
  try {
    const result = await categoryModel.find();
    return res.status(200).json(result);
  } catch (error) {
    return  res.status(400).json({"message":"Something went wrong !","success":false,error:error});
  }
}

const addCategory = async (req,res) => { 
  try {
    const {name,icon} = req.body;
    if(!name || !icon){
      return  res.status(400).json({"message":"Both fields are required !","success":false});
    }
   const data = await categoryModel.findOne({name});
   console.log("category  found",data)
   
   if(data){
    return res.status(400).json({"message":"Catrgory already exists, please select from options !","success":false});
   }

   const doc = new categoryModel({
    name,
    icon
   })

   const result = await doc.save();
   console.log(result);
    return res.status(201).json({"message":"category added success","success":true,"data":result});
  } catch (error) {
    console.error("Error adding sample categories:", error);
   return res.json("something went wrong !")
  }
};

export {addCategory,allCategoryList}

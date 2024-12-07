import categoryModel from "../models/CategoryModel.js";

const addSampleCategories = async (req,res) => { 
  try {
    const categories = [
      { name: "Grocery", icon: "https://example.com/icons/grocery.png" },
      { name: "Pharmacy", icon: "https://example.com/icons/pharmacy.png" },
    ];

    await categoryModel.insertMany(categories);
    console.log("Sample categories added successfully!");
    return res.status(201).json({"message":"categories added success"});
  } catch (error) {
    console.error("Error adding sample categories:", error);
  }
};

export {addSampleCategories}

import businessModel from "../models/businessModel.js";
import categoryModel from "../models/CategoryModel.js";

const addBusinessWithCategory = async (req,res) => {
  try {
    // Find a category by name
    const category = await categoryModel.findOne({ name: "Grocery" });

    if (!category) {
      console.log("Category not found!");
      return;
    }

    // Create a new business and associate it with the category
    const business = new businessModel({
      businessName: "John's Grocery",
      category: category._id, // Reference the category's ObjectId
      personName: "John Doe",
      email: "john@example.com",
      password: "password123",
      about: "Best grocery store in town",
      location: {
        type: "Point",
        coordinates: [77.5946, 12.9716], // Longitude, Latitude
      },
    });

    await business.save();
    console.log("Business added successfully!");
    return res.status(201).json({"message":"business created success"});
  } catch (error) {
    console.error("Error adding business:", error);
  }
};


export {addBusinessWithCategory}


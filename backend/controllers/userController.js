import businessModel from "../models/businessModel.js";
import categoryModel from "../models/CategoryModel.js";
import userModel from "../models/UserModel.js";
import jwt from 'jsonwebtoken'

const register = async(req,res)=>{
try {
  const {name,email,password,profile_pic} = req.body;

  if(!name || !email || !password  ){
      return res.status(400).json({"message":"All Fields Are Required !","success":"false"});
  }
  
  const isMatch = await userModel.findOne({email});
  console.log(isMatch);
  if(isMatch){
    return res.status(400).json({message:"Account Already Exists !",success:false});
  }
  const doc = await userModel.create({
    name,
    email,
    password,
    profile_pic
  })
  const data = await userModel.findOne({email}).select("-password");
  const payload = {
    userId : data._id,
    email : data.email
  }
  const cookieOption = {
    httpOnly:true,
    secure:true,
    sameSite : 'None',
    maxAge: 30 * 24 * 60 * 60 * 1000
  }
  const token = jwt.sign(payload,process.env.JWT_SECRET_KEY,{expiresIn :'30d'});
  return res.cookie("token",token, cookieOption).status(200).json({"message":"registerd success","success":true, data:data});
} catch (error) {
  console.log(error);
  return res.status(400).json({message:"Something Went Wrong !",success:false});
}
    
}


// const findNearbyBusinesses = async (req, res) => {
//   try {
//     const { range, userLocation, businessName } = req.body;
//     console.log("Request Data:", req.body);

//     // ✅ Validate userLocation
//     if (!userLocation || !userLocation.lng || !userLocation.lat) {
//       return res.status(400).json({ message: "Invalid user location" });
//     }

//     // ✅ Convert range to number
//     const maxDistance = Number(range);

//     // ✅ Build base query with location filter
//     let query = {
//       location: {
//         $near: {
//           $geometry: {
//             type: "Point",
//             coordinates: [userLocation.lng, userLocation.lat],
//           },
//           $maxDistance: maxDistance,
//         },
//       },
//     };

//     // ✅ Find category by business name first (assuming category name is similar to businessName)
//     const category = await categoryModel.findOne({ name: new RegExp(businessName, "i") });
//     console.log(category)
//     if (category) {
//       // ✅ If category is found, filter businesses by category
//       query.category = category._id;
//     } else {
//       // ✅ If category is NOT found, filter by business name
//       query.businessName = new RegExp(businessName, "i");
//     }

//     // ✅ Find businesses using the final query
//     console.log(query)
//     const nearbyBusinesses = await businessModel.find({businessName:new RegExp(businessName, "i")}).populate("category");

//     console.log("Filtered Nearby Businesses:", nearbyBusinesses);

//     return res.status(200).json({
//       message: "Filtered nearby businesses",
//       data: nearbyBusinesses,
//     });
//   } catch (error) {
//     console.error("Error finding nearby businesses:", error);
//     return res.status(500).json({ message: "Server error", error });
//   }
// };

const findNearbyBusinesses = async (req, res) => {
  try {
    const { range, userLocation, businessName } = req.body;
    console.log("✅ Received Data:", req.body);

    // Validate user location
    if (!userLocation || !userLocation.lng || !userLocation.lat) {
      return res.status(400).json({ message: "Invalid user location" });
    }

    const maxDistance = Number(range) || 5000; // Default to 5km if range is missing
    console.log("🔍 Max Distance:", maxDistance);

    // ✅ Step 1: Try to Find a Category First
    const category = await categoryModel.findOne({ name: new RegExp(businessName, "i") });
    console.log("🔍 Category Found:", category);

    let matchStage = {}; // Filtering stage

    if (category) {
      matchStage.category = category._id; // Filter by category ID
    } else {
      matchStage.businessName = new RegExp(businessName, "i"); // Otherwise, search by business name
    }

    // ✅ Step 2: Run `$geoNear` Aggregation to Filter by Distance
    const nearbyBusinesses = await businessModel.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [userLocation.lat, userLocation.lng] },
          distanceField: "distance",
          maxDistance: maxDistance, // Filter by range
          spherical: true,
        },
      },
      { $match: matchStage }, // ✅ Apply category OR business name filter
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      { $sort: { distance: 1 } }, // Sort by closest businesses
    ]);

    console.log("✅ Nearby Businesses Found:", nearbyBusinesses);

    return res.status(200).json({
      message: "Filtered nearby businesses",
      data: nearbyBusinesses,
      success:true
    });

  } catch (error) {
    console.error("❌ Error finding businesses:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

  const getUserById = async(req,res)=>{
    try {
      const {id} = req.body;
      const data = await userModel.findById(id)
      return res.status(200).json({"message":"success","success":true,data:data});

    } catch (error) {
      console.log(error)
      return res.status(400).json({message:"Server is down !",success:false});
    }
  }
  
  

export  {register, findNearbyBusinesses,getUserById}
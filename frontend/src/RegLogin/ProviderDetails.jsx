import { summaryApi } from '@/common/summaryApi';
import { Button } from '@/components/ui/button'
import { setUser } from '@/features/userSlice';
import { uploadFile } from '@/helpers/uploadPhoto';
import {  CloudUploadIcon, Loader2Icon, LocateFixedIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { MdClose, MdDelete } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const ProviderDetails = () => {
  // Set state
  const dispatch = useDispatch();
  // Navigate Instance
  const navigate = useNavigate();

  // Retrive data from asktype Page
  const prevData = useLocation();
  const data = prevData.state;
  console.log(data)
  if(!data){
    navigate("/register");
  }
  // Get all categories
  const[categories,setAllCategories] = useState([]);
  const fetchCategories = async()=>{
    try {
      const response = await fetch(summaryApi.fetchCategories.url);
      const responseResult = await response?.json();
      setAllCategories(responseResult);
    } catch (error) {
      console.log(error)
      toast.error(error.message);
    }
  }

  // const[gallery,setGallery] = useState(["hello","hii","bye"]);
  const[customCategory,setCustomCategory] = useState("");
  const [customCategoryImage,setCustomCategoryImage] = useState("");
  const[isCustomCategory,setIsCustomCategory] = useState(false);
  
  // Location
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [manualAddress, setManualAddress] = useState("");

  // Initial provider data
  const[providerData,setProviderData] = useState({
    businessName :"",
    description : "",
    category : "",
    businessStartTime: "",
    businessEndTime:"",
    serviceGap:"",
    gallery :[]
  })

  const handleOnChange = (e)=>{
    const {name,value} = e.target;

    setProviderData({
      ...providerData,
      [name]:value
    })
  }

  const getCurrentLocation = (e) => {
    e.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          if(!location.latitude || !location.longitude){
            toast.error("Press again to capture your location !")
          }else{
            toast.success("Location captured success !")
          }
          console.log(location.latitude, " ", location.longitude)
        },
        (err) => {
          console.log(err)
          if (err.code === 1 ) {
            toast.error("Location permission denied. Please enable it in your browser settings.");

          } else if (err.code === 2) {
            
            toast.error("Location unavailable. Try again later.");
          } else {
            toast.error("An unknown error occurred while retrieving location,Try again later.");
          }
        }
      );
    } else {
      setError("Geolocation is not supported by your browser, Please manually type your address !");
    }
  };
  
  const getLocationFromAddress = async (e) => {
    e.preventDefault()
    const apiKey = "";  // Replace with your API key
    const encodedAddress = encodeURIComponent(manualAddress);

    try {
      console.log("Encoded address : ", encodedAddress)
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${manualAddress}`);
        const data = await response.json();
   
        console.log(data);
      if (data.status === "OK") {
        const { lat, lng } = data.results[0].geometry.location;
        setLocation({ latitude: lat, longitude: lng });
        console.log(location.latitude,"  ",location.longitude)
      } else {
        console.log("Could not find location for the entered address.");
      }
    } catch (err) {
      console.log(err)
      console.log("Error fetching location from address.");
    }
  };
  
  // Upload new category image
  const [imgLoading,setImgLoading] = useState(false);
  const handleCategoryUploadPhoto = async(e)=>{
    const file = e.target.files[0]
    setImgLoading(true)
    const uploadPhoto = await uploadFile(file)
    console.log(uploadPhoto);
    setCustomCategoryImage(uploadPhoto?.url);
    setImgLoading(false);
  }

  // API for adding category
  const [isCategoryLoading,setIsCategoryLoading] = useState(false);
  const handleAddCategory = async(e)=>{
    e.preventDefault();
    try {
      setIsCategoryLoading(true);
      const response = await fetch(summaryApi.addCategory.url,{
        method:summaryApi.addCategory.method,
        headers:{
          "content-type":"application/json"
        },
        body:JSON.stringify({
          name:customCategory,
          icon:customCategoryImage
        }),
        credentials:'include'
      });
      const responseResult = await response?.json();
      console.log(responseResult);
      if(responseResult?.success){
        toast.success(responseResult?.message);
        setProviderData((prev)=>{
          return{
            ...prev,
            category : responseResult?.data?._id
          }
        })
        setIsCustomCategory(false);
        setIsCategoryLoading(false);
        handleSubmit(e);
      }else{
        setIsCategoryLoading(false);
        toast.error(responseResult?.message);
      }
    } catch (error) {
      setIsCategoryLoading(false);
      console.log(error);
      toast.error("Something went wrong !");
    }
  }

  // Upload gallery photos
  const[galleryLoading,setGalleryLoading] = useState(false);
  const handlyGalleryUpload = async(e)=>{
    const file = e.target.files[0];
    console.log(file);
    if(e.target.files[0]){
      setGalleryLoading(true);
    const uploadPhoto = await uploadFile(file);
    console.log(uploadPhoto)
    setProviderData((prev)=>{
      return{
        ...prev,
        gallery:[...prev.gallery,uploadPhoto?.url]
      }
    })
    setGalleryLoading(false)
    }
  }

  const deleteGallery = (index)=>{
    // gallery.
    const newGallery = [...providerData.gallery];
    newGallery.splice(index,1);
    setProviderData((prev)=>{
      return{
        ...prev,
        gallery:[...newGallery]
      }
    })
  }

  const[isLoading,setIsLoading] = useState(false);
  const handleSubmit = async(e)=>{
    console.log("manual address : ",manualAddress)
    console.log("Location : ",location)
    e.preventDefault();
    console.log(providerData)

    if(!providerData.businessName || !providerData.category || !providerData.description || !providerData.businessStartTime || !providerData.businessEndTime || !providerData.serviceGap ){
        toast.error("please provide all informations !")
    }else{
        if(  manualAddress || location  ){
          if(providerData.category === 'other'){
            setIsCustomCategory(true)
          }else{
            try {
              setIsLoading(true);
              const response = await fetch(summaryApi.registerProvider.url,{
                method:summaryApi.registerProvider.method,
                headers:{
                  "content-type":"application/json",
                },
                body:JSON.stringify({
                  businessName : providerData.businessName,
                  category : providerData.category,
                  profile_pic : data.picture,
                  personName : data.name,
                  email : data.email,
                  password : data.password,
                  description : providerData.description,
                  location : location,
                  gallery : providerData.gallery,
                  businessStartTime : providerData.businessStartTime,
                  businessClosingTime : providerData.businessEndTime,
                  serviceGap : providerData.serviceGap
                })
              });
              const responseResult = await response?.json();
              if(responseResult?.success){
                toast.success(responseResult?.message);
                dispatch(setUser({
                  name : responseResult?.data?.name,
                  email : responseResult?.data?.email,
                  profile_pic : responseResult?.data?.profile_pic,
                  type : responseResult?.data?.type
                }))
                setIsLoading(false);
                navigate("/")
              }else{
                setIsLoading(false);
                toast.error(responseResult?.message);
              }
              console.log(responseResult);
            } catch (error) {
              setIsLoading(false);
              console.log(error)
              toast.error("Something went wrong !");
            }
          }
        }else{
          toast.error("Location is required !");
        }
    }
  }

  useEffect(()=>{
    fetchCategories();
  },[])

  return (
    <>
    <div className='md:mx-10 mx-5 relative'>
      <div className="flex justify-center">
        <form className="max-w-xl shadow-2xl  md:p-10 p-5  flex flex-col gap-2 ">
        <h1 className='text-primary font-semibold'>Please provide some important information related to your business</h1>
        {/* Business details - business name */}
            <div >
                <label htmlFor="businessName">Shop / Business Name : </label>
                <input type="text"
                 placeholder='Business Name'
                 name='businessName'
                 id='businessName'
                 onChange={(e)=>handleOnChange(e)}
                  className='w-full p-2 border border-primary rounded-sm outline-none text-black' />
            </div>
            {/* Business Description */}
            <div >
                <label htmlFor="description">Business Description : </label>
                <input type="text"
                 placeholder='Tell us about your business'
                 name='description'
                 id='description'
                  className='w-full p-2 border border-primary rounded-sm outline-none text-black'
                  onChange={(e)=>handleOnChange(e)} />
            </div>
          
            {/* Category */}
            <div>
            <label htmlFor="category" > Select Category Of Your Business :</label>
            <select name="category" id="category" onChange={(e)=>handleOnChange(e)}  className='w-full cursor-pointer p-2 border border-primary rounded-sm outline-none text-black'> 
              <option value="" className=' p-2 text-center cursor-pointer' >---Select Category---</option>
              {
                categories?.map((category,index)=>(
                    <option key={index} value={category?._id}> {category?.name}</option>
                ))
              }
              <option value="other">Other</option>
            </select>
            </div>

            {/* Location */}
            <div className='flex flex-col gap-1'>
            <label htmlFor="location">Add Your Business Location : </label>
            <div className='w-full'>
            <Button variant="outline" className='flex justify-center w-full border-primary' onClick={(e)=>getCurrentLocation(e)}><span>Use My Current Location</span> <LocateFixedIcon /> </Button>
            </div>
            <h1 className='font-bold text-center'>OR</h1>
            <div className='flex items-center gap-2'>
                <input type="text"
                 placeholder='Enter Location Manually'
                 name='location'
                 id='location'
                  className='w-full p-2 border border-primary rounded-sm outline-none text-black'
                  onChange={(e)=>setManualAddress(e.target.value)}
                  />
                  <Button onClick={(e)=>{getLocationFromAddress(e)}}>Fetch</Button>
            </div>
            </div>

            {/* Business Start time */}
            <div>
            <label htmlFor="businessStartTime"> Select a Business Start Time : </label>
            <select name="businessStartTime" id="businessStartTime" onChange={(e)=>handleOnChange(e)}  className='w-full cursor-pointer p-2 border border-primary rounded-sm outline-none text-black'> 
              <option  value="" className=' p-2 text-center cursor-pointer'>---Select Start Time---</option>
              <option value="06:00 AM">06:00 AM</option>
              <option value="07:00 AM">07:00 AM</option>
              <option value="08:00 AM">08:00 AM</option>
              <option value="09:00 AM">09:00 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="12:00 PM">12:00 PM</option>
              <option value="01:00 PM">01:00 PM</option>
              <option value="02:00 PM">02:00 PM</option>
              <option value="03:00 PM">03:00 PM</option>
              <option value="04:00 PM">04:00 PM</option>
              <option value="05:00 PM">05:00 PM</option>
              <option value="06:00 PM">06:00 PM</option>
              <option value="07:00 PM">07:00 PM</option>
              <option value="08:00 PM">08:00 PM</option>
              <option value="09:00 PM">09:00 PM</option>
              <option value="10:00 PM">10:00 PM</option>
              <option value="11:00 PM">11:00 PM</option>
              <option value="12:00 AM">12:00 AM</option>
              <option value="01:00 AM">01:00 AM</option>
              <option value="02:00 AM">02:00 AM</option>
              <option value="03:00 AM">03:00 AM</option>
              <option value="04:00 AM">04:00 AM</option>
              <option value="05:00 AM">05:00 AM</option>
            </select>
            </div>

            {/* Business End time */}
            <div>
            <label htmlFor="businessEndTime"> Select a Business Closing Time : </label>
            <select name="businessEndTime" id="businessEndTime" onChange={(e)=>handleOnChange(e)}  className='w-full cursor-pointer p-2 border border-primary rounded-sm outline-none text-black'> 
              <option  value="" className=' p-2 text-center cursor-pointer'>---End Time---</option>
              <option value="06:00 AM">06:00 AM</option>
              <option value="07:00 AM">07:00 AM</option>
              <option value="08:00 AM">08:00 AM</option>
              <option value="09:00 AM">09:00 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="12:00 PM">12:00 PM</option>
              <option value="01:00 PM">01:00 PM</option>
              <option value="02:00 PM">02:00 PM</option>
              <option value="03:00 PM">03:00 PM</option>
              <option value="04:00 PM">04:00 PM</option>
              <option value="05:00 PM">05:00 PM</option>
              <option value="06:00 PM">06:00 PM</option>
              <option value="07:00 PM">07:00 PM</option>
              <option value="08:00 PM">08:00 PM</option>
              <option value="09:00 PM">09:00 PM</option>
              <option value="10:00 PM">10:00 PM</option>
              <option value="11:00 PM">11:00 PM</option>
              <option value="12:00 AM">12:00 AM</option>
              <option value="01:00 AM">01:00 AM</option>
              <option value="02:00 AM">02:00 AM</option>
              <option value="03:00 AM">03:00 AM</option>
              <option value="04:00 AM">04:00 AM</option>
              <option value="05:00 AM">05:00 AM</option>
            </select>
            </div>

            {/* service gap time */}
            <div >
                <label htmlFor="serviceGap">Time you take for one service (in minute) : </label>
                <input type="number"
                 placeholder='ex:- 30'
                 name='serviceGap'
                 id='serviceGap'
                  className='w-full p-2 border border-primary rounded-sm outline-none text-black'
                  onChange={(e)=>handleOnChange(e)} />
            </div>

            {/* Gallery */}
            <label htmlFor='image' className='flex flex-col gap-2 cursor-pointer'>
              <h1>Please upload some images to advertise your business : </h1>
            <div className='w-full py-10 border border-primary rounded-sm flex justify-center items-center'>
            {
              galleryLoading ? <Loader2Icon className='animate-spin text-primary' /> : <label htmlFor="image"  className='flex gap-2 cursor-pointer border p-2 rounded-sm border-primary hover:bg-primary hover:text-white ease-in-out duration-500'>Upload Images <CloudUploadIcon /></label>
            }
            <input type="file" name="image" id="image" className='hidden' onChange={(e)=>handlyGalleryUpload(e)} />
            </div>
            </label>
              <div className='grid grid-cols-5 gap-2'>
                {
                  providerData.gallery.length >= 0 ? providerData.gallery.map((photo,index)=>(
                    <div className='relative' key={index} ><img src={photo} alt="gallery" className='h-28 w-28 ' />
                      <MdDelete onClick={()=>deleteGallery(index)} className='text-red-700 absolute left-[60px] top-[76px] h-10 w-10 cursor-pointer' />
                     </div>
                  ))  : ""
                }
              </div>
            <div>
            <Button className="w-full mt-2" onClick={(e)=>handleSubmit(e)} >{isLoading ? <Loader2Icon className='animate-spin' /> : "Register"} </Button>
            </div> 
        </form>
      </div>

    </div>
      {
        isCustomCategory && (
          <div className='h-[100vh] bg-slate-400 absolute  top-[86px] bottom-0 left-0 right-0 bg-opacity-50  w-full flex justify-center items-center'>
            <div className='max-w-md mx-5 bg-white px-10 py-5 rounded-lg'>
              <div className="flex justify-end">
              <Button variant='destructive'onClick={()=>setIsCustomCategory(false)} ><MdClose /></Button>
              </div>
              <h1 className='text-lg text-primary'>Please Insert  Your Category Information !</h1>
              {/* new Category name */}
              <div className='my-2'>
              <label htmlFor="customCategory" className='text-black'>Enter Category Name : *</label>
            <input type="text"
                 placeholder='ex:- saloon'
                 name='customCategory'
                 id='customCategory'
                  className='w-full p-2 border border-primary rounded-sm outline-none text-black'
                  onChange={(e)=>setCustomCategory(e.target.value)}
                  />
              </div>

              {/* Category Image */}
              {
                imgLoading ? <div className='text-center flex justify-center'><Loader2Icon className='animate-spin text-center text-primary' /></div> : <div>{customCategoryImage ? <div className=' flex justify-center items-center rounded-full'> <img src={customCategoryImage} alt="category" className='h-32 w-32 ' /> </div> : <div><label htmlFor='categoryImage' className='flex flex-col cursor-pointer text-black'>
                  <h1>Please upload Category Image: *</h1>
                <div className='w-full py-5 border border-primary rounded-sm flex justify-center items-center'>
                <label htmlFor="categoryImage"  className='flex gap-2 cursor-pointer border p-2 rounded-sm border-primary hover:bg-primary hover:text-white ease-in-out duration-500'>Upload Category Logo <CloudUploadIcon /></label>
                <input type="file" name="categoryImage" id="categoryImage" className='hidden' onChange={(e)=>handleCategoryUploadPhoto(e)} />
                </div>
                </label></div> }</div>
              }
              
            <div className='mt-3'>
              <Button className='w-full' onClick={(e)=>handleAddCategory(e)}>{isCategoryLoading ? <Loader2Icon className='animate-spin' /> : "Add"}</Button>
            </div>
            </div>
          </div>
        )
      }
    </>
  )
}

export default ProviderDetails

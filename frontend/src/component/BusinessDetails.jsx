import { summaryApi } from '@/common/summaryApi';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Clock, Mail, MapPin, NavigationIcon, NotebookIcon, Share, User } from 'lucide-react'
import BookingSection from './BookingSection';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { getAddressFromCoordinates } from '@/helper/getAddressFromCoordinates';


const BusinessDetails = () => {
  const params = useParams();
  const user = useSelector(state=>state?.user)
  // Business Details
  const[business,setBusiness] = useState({});
  const getBusinessById = async()=>{
   const response =  await fetch(summaryApi.getBusinessById.url,{
      method: summaryApi.getBusinessById.method,
      headers:{
        "content-type" : "application/json"
      },
      body:JSON.stringify({
        id : params?.id
      })
    });

    const responseResult = await response?.json();
    setBusiness(responseResult?.data);
    console.log(responseResult)
  }
  const[suggestedBusinessList,setSuggestedBusinessList] = useState([]);
  const getAllBusinessByCategory = async()=>{
    try {
      const response = await fetch(summaryApi.getBusinessByCategory.url,{
          method : summaryApi.getBusinessByCategory.method,
          headers:{
              "content-type" : "application/json"
          },
          body : JSON.stringify({
              id : business?.category?._id
          })
      });
      const responseResult = await response?.json();
      setSuggestedBusinessList(responseResult?.data);
  } catch (error) {
      setIsLoading(false);
      toast.error("Something went wrong !");
      console.log(error)
  }
  }

    const [Address,setAddress] = useState('');
    const getAddressFromCoordinate = async()=>{
      const data  = await getAddressFromCoordinates(business?.location?.coordinates[0],business?.location?.coordinates[1]);
      console.log(data)
      setAddress(data);
    }
  // Get Suggested business List
  useEffect(()=>{
    getAllBusinessByCategory();
    getAddressFromCoordinate();
  },[business])

  const [addresses, setAddresses] = useState({});

  // Function to fetch addresses
  const getAddressFromCoordinateForSuggestions = async (latitude, longitude, id) => {
    try {
      const data = await getAddressFromCoordinates(latitude, longitude);
      setAddresses((prev) => ({ ...prev, [id]: data })); // Store each address using business ID
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  useEffect(() => {
    if (suggestedBusinessList?.length > 0) {
      suggestedBusinessList.forEach((item) => {
        if (item?.location?.coordinates) {
          getAddressFromCoordinateForSuggestions(
            item.location.coordinates[0],
            item.location.coordinates[1],
            item._id
          );
        }
      });
    }
  }, [suggestedBusinessList]);

  useEffect(()=>{
    getBusinessById();
    getAllBusinessByCategory();
  },[params.id])
  return (
    <div className='md:py-8  lg:px-20'>
      {/* Profile details */}
    <div className='md:flex gap-4 items-center'>
      <img src={business?.profile_pic} alt={business?.businessName} className='rounded-full h-[150px] w-[150px]  object-cover aspect-square' />
      <div className='flex justify-between flex-col lg:flex-row items w-full '>
      <div className='flex flex-col items-baseline gap-3 mt-4 md:mt-0'>
        <h2 className='text-primary bg-purple-200 px-2 p-1 rounded-full text-lg'>{ business?.category?.name}</h2>
        <h2 className='font-semibold text-lg md:text-2xl'>{ business?.businessName}</h2>
        <h2 className='flex text-gray-500 gap-2 text-lg'><MapPin/> { Address}</h2>
        <h2 className='flex text-gray-500 gap-2 text-lg'><Mail/> { business?.email}</h2>
      </div>
      <div className='flex flex-col mt-3 lg:mt-0 items-baseline lg:items-end gap-3'>
        <div className='flex lg:flex-col  items-baseline  lg:items-end gap-3'>
        <Button className='bg-primary order-2 lg:order-1'><Share/></Button>
        <h2 className='flex gap-2 text-xl order-1  lg:order-2 text-primary'><User /> { business?.personName} </h2>
        </div>
        <h2 className='flex gap-2 text-xl text-gray-500'><Clock /> Available {business?.businessStartTime} to {business?.businessClosingTime} </h2>
      </div>
      </div>
    </div>
    <div className='flex gap-3 mt-5'>
      {
        user?.name ? <BookingSection business={business} >
        <Button><NotebookIcon/>Book Service</Button>
        </BookingSection> : <Button onClick={()=>{toast.error("Please Login First !")}}><NotebookIcon/>Book Service</Button>
      }
      <Button className="flex items-center text-center">Start <NavigationIcon /></Button>
    </div>
    <div className='grid grid-cols-4 mt-10 gap-10'>

      {/* Business Description and gallery */}
      <div className='lg:col-span-3 col-span-4 order-2 md:order-1'>
        {/* <BusinessDescription business={businessDetails} /> */}
        <div>
      <h2 className='font-bold text-[25px] mt-5 md:mt-0'>Description</h2>
      <p className='text-gray-600 mt- text-lg'>{business?.description}</p>
      <h2 className='font-bold text-[25px] mt-5'>Gallery</h2>
      <div className='mt-5 gap-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {
          business?.gallery?.map((item,index)=>(
            <div className=' flex items-center' key={index}>
              <img src={item} alt='image' className='rounded-lg object-cover aspect-square cursor-pointer hover:scale-110 transition-all'/>
            </div>
          ))
        }
      </div>
    </div>
      </div>

        {/* Suggested Business List */}
      <div className='col-span-1 order-1 md:order-2 hidden lg:block '>
      <h2 className='mt-5 font-semibold text-lg'>Suggested Businesses</h2>
        <div className=' overflow-y-scrol'>
        {
          suggestedBusinessList && suggestedBusinessList?.map((item,index)=>(
            <Link key={index} to={"/details/"+item?._id} className='flex gap-3 mt-3 dark:bg-gray-900 cursor-pointer shadow-md  p-1 rounded-lg hover:shadow-primary'>
              <img src={item?.profile_pic} alt={item.name} height={40} width={80} className='rounded-lg h-20 object-cover' />
              <div>
              <h2 className='font-bold'>{item?.businessName}</h2>
              <h2 className='text-primary'>{item?.personName}</h2>
              {/* <h2 className='text-gray-500'>{item?.location?.coordinates[0]}</h2> */}
              <h2 className='text-gray-500 line-clamp-1'>{addresses[item._id] || "Fetching address..."}</h2>
              </div>
            </Link>
          ))
        }
      </div>
      </div>
    </div>
      <div className='lg:hidden block'>
      <h2 className='mt-5 font-bold text-xl'>Suggested Businesses</h2>

      {
          suggestedBusinessList && suggestedBusinessList?.map((item,index)=>(
            <Link key={index} to={"/details/"+item?._id} className='flex gap-3 mt-3 cursor-pointer shadow-md  p-1 rounded-lg hover:shadow-primary'>
              <img src={item?.profile_pic} alt={item.name} height={40} width={80} className='rounded-lg h-20 object-cover' />
              <div>
              <h2 className='font-bold'>{item?.businessName}</h2>
              <h2 className='text-primary'>{item?.personName}</h2>
              <h2 className='text-gray-500'>{addresses[item._id] || "Fetching address..."}</h2>
              </div>
            </Link>
          ))
        }
      </div>
  </div>
  )
}

export default BusinessDetails

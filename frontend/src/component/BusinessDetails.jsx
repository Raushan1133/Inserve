import { summaryApi } from '@/common/summaryApi';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Clock, Mail, MapPin, Share, User } from 'lucide-react'


const BusinessDetails = () => {
  const params = useParams();

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
  useEffect(()=>{
    getBusinessById();
  },[params.id])
  return (
    <div className='py-8 md:py-20  lg:px-36'>
    <div className='md:flex gap-4 items-center'>
      <div className='rounded-full h-[150px] w-[150px]'>
      <img src={ business?.profile_pic} alt={business?.businessName} className='rounded-full h-[150px] w-[150px]  object-cover' />
      </div>
      <div className='flex justify-between flex-col lg:flex-row items w-full'>
      <div className='flex flex-col items-baseline gap-3 mt-4 md:mt-0'>
        <h2 className='text-primary bg-orange-100 px-2 p-1 rounded-full text-lg'>{ business?.category?.name}</h2>
        <h2 className='font-semibold text-lg md:text-2xl'>{ business?.businessName}</h2>
        <h2 className='flex text-gray-500 gap-2 text-lg'><MapPin/> { business?.location?.coordinates[0]}</h2>
        <h2 className='flex text-gray-500 gap-2 text-lg'><Mail/> { business?.email}</h2>
      </div>

      <div className='flex flex-col mt-3 lg:mt-0 items-baseline lg:items-end gap-3'>
        <Button className='bg-primary '><Share/></Button>
        <h2 className='flex gap-2 text-xl text-primary'><User /> { business?.personName} </h2>
        <h2 className='flex gap-2 text-xl text-gray-500'><Clock /> Available {business?.businessStartTime} to {business?.businessClosingTime} </h2>
      </div>
      </div>
    </div>

    <div className='grid grid-cols-4 mt-16'>

      <div className='md:col-span-3 col-span-4 order-2 md:order-1'>
        {/* <BusinessDescription business={businessDetails} /> */}
        <div>
      <h2 className='font-bold text-[25px] mt-5 md:mt-0'>Description</h2>
      <p className='text-gray-600 mt- text-lg'>{business?.description}</p>
      <h2 className='font-bold text-[25px] mt-5'>Gallery</h2>
      <div className='mt-5 gap-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {
          business?.gallery?.map((item,index)=>(
            <div className=' flex items-center' key={index}>
              <img src={item} alt='image' className='rounded-lg object-cover'/>
            </div>
          ))
        }
      </div>
    </div>
      </div>

      <div className='col-span-1 order-1 md:order-2'>
        {/* <SuggestedBusinessList business={businessDetails} /> */}
      </div>
    </div>
  </div>
  )
}

export default BusinessDetails

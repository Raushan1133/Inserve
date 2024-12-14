import { summaryApi } from '@/common/summaryApi';
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const Hero = () => {
  // Fetch all Categories
  const[categories,setAllCategories] = useState([]);
  const fetchCategories = async()=>{
    try {
      const response = await fetch(summaryApi.fetchCategories.url);
      const responseResult = await response?.json();
      setAllCategories(responseResult);
    } catch (error) {
    }
  }
  useEffect(()=>{
    fetchCategories();
  },[])
  return (
    <>
    <div className='flex flex-col justify-center items-center gap-3 '>
      <h1 className='text-[40px] font-bold text-center'>Find Any <span className='text-primary'>Shop/Services</span><br /> Near You</h1>
      <h2 className='text-xl  text-gray-400'>Explore Best And Trusted Shops Near You</h2>
      <div className='mt-4 flex gap-4 items-center'>
      <input placeholder="Search" className="md:w-[350px] rounded-full outline-none p-3 border-primary border" />
      <Button className="bg-primary rounded-full h-[46px]">
        <Search className='h-4 w-4'  />
      </Button>
      </div>
    </div>
    {/* Category List  */}
    <h1 className='text-xl font-semibold'>Some Popular Services</h1>
    <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
        {
          categories.map((category,index)=>(
            <div key={index} className='bg-slate-200 flex cursor-pointer'>
              <div key={index}>{category?.name}</div>
              <img src={category?.icon} className='h-32 w-32' alt="icon" />
            </div>
          ))
        }
      </div>
    </>
  )
}

export default Hero
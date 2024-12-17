import { summaryApi } from '@/common/summaryApi';
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import BusinessList from '../component/BusinessList';

const Hero = () => {
  // Fetch all Categories
  const[categories,setCategories] = useState([]);
  const fetchCategories = async()=>{
    try {
      const response = await fetch(summaryApi.fetchCategories.url);
      const responseResult = await response?.json();
      setCategories(responseResult);
    } catch (error) {
    }
  }

  const [businessList,setBusinessList] = useState([]);
  const[isLoading,setIsLoading] = useState(false);
  const getAllBusiness = async()=>{
      try {
        setIsLoading(true);
        const response = await fetch(summaryApi.getAllBusiness.url);
        const responseResult = await response?.json();
        setIsLoading(false);
        setBusinessList(responseResult?.data);
        console.log("response : ",responseResult)
        // console.log(businessList)
      } catch (error) {
        setIsLoading(false)
        toast.error("something went wrong !");
      }
  }

  useEffect(()=>{
    fetchCategories();
    getAllBusiness();
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
    <div className='mt-5'>
    <h1 className='text-xl font-semibold'>Some Popular Categories</h1>
      <div className='grid grid-cols-3 mt-5 md:grid-cols-4 lg:grid-cols-10 gap-4 justify-center'>
        {
            categories.length > 0 ?categories.map((data,i)=>(
                <Link to={"/all-category-business/"+data?._id} key={i} className='flex flex-col gap bg-purple-200 overflow-hidden p-1   items-center justify-center rounded-lg cursor-pointer hover:scale-110 transition ease-in-out '>
                <div>
                    <img src={data?.icon} className='h-24 w-24 overflow-hidden object-scale-dow mix-blend-multiply' alt='icon' />
                </div>
                <h2 className='text-primary text-sm'>{data?.name}</h2>
                </Link>
            )) : [1,2,3,4,5,6].map((item,i)=>(
                <div key={i} className='h-[120px] w-full bg-slate-200 animate-pulse rounded-lg'>

                </div>
            ))
        }
      </div>
    </div>

    {/* Business List */}
    <div className='mt-10 font-semibold text-xl'>
    <h1>Some Popular Businesses Near You</h1>
    <BusinessList businessList ={businessList} isLoading={isLoading} />
    </div>
    </>
  )
}

export default Hero
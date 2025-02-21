import React, { useEffect, useState } from 'react'
import CategorySidebar from './CategorySidebar'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { summaryApi } from '@/common/summaryApi'
import BusinessList from '../BusinessList'
import toast from 'react-hot-toast'

const CategoryPage = () => {
    const params = useParams();
    const [businessList,setBusinessList] = useState([]);
    const [isLoading,setIsLoading] = useState(false);
    const navigate = useNavigate();

const handleCategoryClick = (categoryId) => {
  navigate(`/all-category-business/${categoryId}`);
};
    // sidebar category
    const[categories,setCategories] = useState([]);
    const fetchCategories = async()=>{
      try {
        const response = await fetch(summaryApi.fetchCategories.url);
        const responseResult = await response?.json();
        setCategories(responseResult);
      } catch (error) {
          console.log(error)
          toast.error("Can't fetch categories at the moment !");
      }
    }
    const getBusinessByCategory = async()=>{
        try {
            setIsLoading(true);
            const response = await fetch(summaryApi.getBusinessByCategory.url,{
                method : summaryApi.getBusinessByCategory.method,
                headers:{
                    "content-type" : "application/json"
                },
                body : JSON.stringify({
                    id : params?.category
                })
            });
            const responseResult = await response?.json();
            setIsLoading(false);
            setBusinessList(responseResult?.data);
        } catch (error) {
            setIsLoading(false);
            toast.error("Something went wrong !");
            console.log(error)
        }
    }
    useEffect(()=>{
      fetchCategories();
    },[])
    useEffect(()=>{
        getBusinessByCategory();
    },[params?.category])
  return (
    <>
    <h1 className='md:hidden'>Categories</h1>
    <div className='flex overflow-x-auto  gap-3 mt-3'>
      {
        categories?.map((item,index)=>(
          <div onClick={()=>handleCategoryClick(item?._id)}  key={index}  className={`flex flex-col justify-center items-center gap-2 p-1 rounded-sm md:hidden border cursor-pointer  hover:text-primary hover:shadow-md hover:shadow-primary transition-all ease-in-out ${item?.name === businessList[0]?.category?.name && "border-primary shadow-primary shadow-sm text-primary"}`}>
            <img src={item.icon} alt='icon' className='h-16 w-16 aspect-square object-cove'></img>
            <h2 className='text-center line-clamp-1'>{item.name}</h2>
          </div>
        ))
      }
      </div>
    <div className='grid grid-cols-4 gap-10'>
      <div className='max-w-sm md:block hidden'>
      <div>
      <h2 className='text-primary font-semibold mt-10 text-xl'>Categories</h2>
      <div className='flex flex-col gap-3 mt-3'>
      {
        categories?.map((item,index)=>(
          <div to={"/all-category-business/"+item?._id} onClick={()=>{handleCategoryClick(item?._id)}}  key={index}  className={`flex gap-2 p-4 border rounded-lg  cursor-pointer  hover:text-primary hover:shadow-md hover:shadow-primary transition-all ease-in-out ${item?.name === businessList[0]?.category?.name && "border-primary shadow-primary shadow-md text-primary"}`}>
            <h2>{item.name}</h2>
            <img src={item.icon} alt='icon' height={30} width={30}></img>
          </div>
        ))
      }
      </div>
    </div>
      </div>
      <div className='md:col-span-3 col-span-4'>
        <BusinessList businessList={businessList} title={businessList[0]?.category?.name}  isLoading={isLoading}  />
      </div>
    </div>
    </>
  )
}

export default CategoryPage

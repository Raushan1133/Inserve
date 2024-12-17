import { summaryApi } from '@/common/summaryApi';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const CategorySidebar = () => {
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
  useEffect(()=>{
      fetchCategories();
      
  },[])

  return (
    <div>
      <h2 className='text-primary font-semibold mt-10 text-xl'>Categories</h2>
      <div className='flex flex-col gap-3 mt-3'>
      {
        categories?.map((item,index)=>(
          <Link to={"/all-category-business/"+item?._id}  key={index}  className={`flex gap-2 p-4 border rounded-lg  cursor-pointer  hover:text-primary hover:shadow-md hover:shadow-primary transition-all ease-in-out`}>
            <h2>{item.name}</h2>
            <img src={item.icon} alt='icon' height={30} width={30}></img>
          </Link>
        ))
      }
      </div>
    </div>
  )
}

export default CategorySidebar
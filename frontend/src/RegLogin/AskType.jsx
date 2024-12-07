import { summaryApi } from '@/common/summaryApi';
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import {  useLocation, useNavigate } from 'react-router-dom';

const AskType = () => {
    const[type,setType] = useState();
    const navigate = useNavigate();
    const location = useLocation();
    const data = location.state;
    const handleSubmit = async(e)=>{
      e.preventDefault();
      data.type=type;
      console.log(data)
      console.log("Api : ", import.meta.env.VITE_SERVER)
        if(type){
            if(type === 'provider'){
                navigate("/business-details");
            }else{
              const response = await fetch(summaryApi.register.url,{
                method:summaryApi.register.method,
                headers:{
                  "content-type":"application/json"
                },
                body:JSON.stringify(data),
                credentials:"include"
              })

              const responseData = await response.json();
              console.log(responseData);
                // navigate("/");
            }
        }else{
            console.log("toast")
            toast.error("Please select a type !")
        }
    }
  return (
    <div className='flex items-center justify-center p-32'>
      <div className='max-w-lg shadow-lg flex items-center border border-primary rounded gap-5 p-5 justify-center flex-col'>
        <h2>Please Select Type</h2>
        <select className='text-primary outline-primary p-2 cursor-pointer border border-primary rounded' name="type" id="type" onChange={(e)=>setType(e.target.value)}>
        <option value="" >Choose an option</option>
            <option className='text-primary cursor-pointer' value="seeker">User</option>
            <option className='text-primary cursor-pointer' value="provider">Service Provider</option>
        </select>
        <div className='w-full'>
        <Button onClick={(e)=>handleSubmit(e)} className='w-full'>Next</Button>
        </div>
      </div>
    </div>
  )
}

export default AskType

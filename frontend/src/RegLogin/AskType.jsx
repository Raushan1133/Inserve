import { summaryApi } from '@/common/summaryApi';
import { Button } from '@/components/ui/button'
import { setUser } from '../features/userSlice';
import { Loader2Icon } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import {  useLocation, useNavigate } from 'react-router-dom';

const AskType = () => {
  const dispatch = useDispatch();
  const[loading,setLoading] = useState(false)
    const[userType,setUserType] = useState();
    const navigate = useNavigate();
    const location = useLocation();
    const data = location.state;
    const handleSubmit = async(e)=>{
      e.preventDefault();
      console.log(data)
      if(userType){
            if(userType === 'provider'){
                navigate("/provider-details",{state:data});
            }else{
              try {
                setLoading(true)
              const response = await fetch(summaryApi.register.url,{
                method: summaryApi.register.method,
                headers:{
                  "content-type":"application/json"
                },
                credentials:'include',
                body:JSON.stringify({
                  
                  name:data.name,
                  email: data.email,
                  password : data.password,
                  profile_pic : data.picture
                })
              })
              const responseResult = await response?.json();
              console.log("User Login : ",responseResult);
              setLoading(false);
              if(responseResult?.success){
                toast.success(responseResult?.message);
                    dispatch(setUser({
                      id:responseResult?.data?._id, 
                      name : responseResult?.data?.name,
                      email : responseResult?.data?.email,
                      profile_pic : responseResult?.data?.profile_pic,
                      type : responseResult?.data?.type
                    }))
                navigate("/");
              }else{
                toast.error(responseResult?.message);
              }
              } catch (error) {
                setLoading(false)
                toast.error("Something went wrong !");
                console.log(error);
              }
            }
        }else{
            toast.error("Please select a type !")
        }
    }
  return (
    <div className='flex items-center justify-center p-32'>
      <div className='max-w-lg shadow-lg flex items-center border border-primary rounded gap-5 p-5 justify-center flex-col'>
        <h2>Please Select Type</h2>
        <select className='text-primary outline-primary p-2 cursor-pointer border border-primary rounded' name="type" id="type" onChange={(e)=>setUserType(e.target.value)}>
            <option value="" >Choose an option</option>
            <option className='text-primary cursor-pointer' value="seeker">User</option>
            <option className='text-primary cursor-pointer' value="provider">Service Provider</option>
        </select>
        <div className='w-full'>
        <Button onClick={(e)=>handleSubmit(e)} className='w-full'>{loading ? <Loader2Icon className='animate-spin' /> : "Next"}</Button>
        </div>
      </div>
    </div>
  )
}

export default AskType

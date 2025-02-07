import { summaryApi } from '@/common/summaryApi';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom'

const UserProfile = () => {
    const params = useParams();
    const [user,setUser] = useState({

    })
    const userDetails = async()=>{
        try {
            const response = await fetch(summaryApi.getUserById.url,{
                method: summaryApi.getUserById.method,
                headers : {
                    "content-type" : "application/json"
                },
                body : JSON.stringify({
                    id : params.id
                })
            });
            const responseData =await response.json();
            if(responseData?.success){
                setUser(responseData?.data)
            }else{
                toast.error("Something went wrong !");
            }
            console.log(responseData)
        } catch (error) {
            toast.error("Something went wrong !");
            console.log(error)
        }
    }

    useEffect(()=>{
        userDetails();
    },[])
  return (
    <div>
      UserProfile
      UserProfile
    </div>
  )
}

export default UserProfile

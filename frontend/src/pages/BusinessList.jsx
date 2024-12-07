import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const BusinessList = () => {
  const user = useSelector(state => state?.user)
  const navigate = useNavigate()
  // useEffect(()=>{
  //   if(!user?.name){
  //     navigate("/")
  //   }
  // },[user])
  console.log(user)
  return (
    <div className='text-red-500'>
      hii there
    </div>
  )
}

export default BusinessList

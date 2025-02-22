import React from 'react'
import CancelImg from '../assets/cancel.webp'
import { Link } from 'react-router-dom'

const Cancel = () => {
  return (
    <div className='bg-slate-200 w-full max-w-md mx-auto flex justify-center items-center flex-col p-4 my-2 rounded'>
    <img src={CancelImg} width={150} height={150} alt="" className='mix-blend-multiply'/>
    <p className='text-red-600 font-bold text-xl'>Payment Cancelled</p>
    <Link to={'/cart'} className='p-2 px-3 rounded font-semibold mt-5 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all'>Back To Cart</Link>
  </div>
  )
}

export default Cancel

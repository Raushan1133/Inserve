import React from 'react'
import { Link } from 'react-router-dom'
import SuccessImg from '../assets/success.gif'

const Success = () => {
  return (
    <div className='bg-slate-200 w-full max-w-md mx-auto flex justify-center items-center flex-col p-4 my-2 rounded'>
      <img src={SuccessImg} width={150} height={150} alt="" className='mix-blend-multiply'/>
      <p className='text-green-600 font-bold text-xl'>Payment Success</p>
      <Link to={'/order'} className='p-2 px-3 rounded font-semibold mt-5 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all'>See Order</Link>
    </div>

  )
}

export default Success
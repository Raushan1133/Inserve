import Context from '@/utils/Context'
import React, { useContext, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {  Trash2 } from "lucide-react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { summaryApi } from '@/common/summaryApi';
import toast from 'react-hot-toast';
import emptyCart from '../assets/empty-cart.gif'




const CartPage = () => {
    const {cartItems,getCartItems} = useContext(Context);
    const [loading,setIsLoading] = useState(false);

    const deleteCartItems = async(e,productId)=>{
      e.stopPropagation();
      try {
        const response = await fetch(summaryApi.deleteCartItems.url,{
          method : summaryApi.deleteCartItems.method,
          headers : {
            "content-type" :  "application/json"
          },
          body : JSON.stringify({productId}),
          credentials : "include"
        })
        const responseData = await response.json();
        if(responseData?.success){
          toast.success(responseData?.message);
          getCartItems();
        }else{
          toast.error(responseData?.message);
        }
      } catch (error) {
        console.log(error)
        toast.error('Something went wrong !');
      }
    }

    const increaseQty = async(e,cartItemId)=>{
      e.stopPropagation();
      try {
        const response = await fetch(summaryApi.increaseQty.url,{
          method : summaryApi.increaseQty.method,
          headers : {
            "content-type" : "application/json"
          },
          body : JSON.stringify({cartItemId}),
          credentials : 'include'
        });
        const responseData = await response.json();
        console.log(responseData)
        if(responseData.success){
          getCartItems();
        }else{
          toast.error(responseData.message);
        }
      } catch (error) {
        toast.error('Somthing went wrong !');
      }
    }

    const decreaseQty = async(e,cartItemId,qty)=>{
      if(qty <= 1) return
      e.stopPropagation();
      try {
        const response = await fetch(summaryApi.decreaseQty.url,{
          method : summaryApi.decreaseQty.method,
          headers : {
            "content-type" : "application/json"
          },
          body : JSON.stringify({cartItemId}),
          credentials : 'include'
        });
        const responseData = await response.json();
        console.log(responseData)
        if(responseData.success){
          getCartItems();
        }else{
          toast.error(responseData.message);
        }
      } catch (error) {
        toast.error('Somthing went wrong !');
      }
    }

    const totalQty = cartItems.reduce((previousValue,currentValue)=>previousValue + currentValue.quantity,0)
    const totalPrice = cartItems.reduce((prev,curr)=>prev + (curr.quantity * curr?.productId?.productSellingPrice) , 0)
    let totalSavings = cartItems.reduce((prev,curr)=>prev + (curr.quantity * curr?.productId?.productCostPrice) , 0)
    totalSavings = totalSavings - totalPrice
  return (
    <div className="min-h-screen md:relative">
      <h1 className="text-3xl font-bold text-cente mb-6 text-[#6b21a8]">
        Your Cart
      </h1>
      <h1>U have total <span className='text-primary font-bold '>{cartItems.length}</span> items in cart</h1>
      {
        cartItems.length > 0 ? <div className="grid grid-cols-12 gap-5 mx-auto">
        {loading
          ? Array(6)
              .fill(0)
              .map((_, index) => (
                <Card key={index} className="bg-[#2a2a3d]  rounded-2xl shadow-lg animate-pulse">
                  <CardContent className="p-4">
                    <div className="w-full h-40 bg-gray-700 rounded-lg"></div>
                    <div className="h-6 bg-gray-600 rounded w-3/4 mt-4"></div>
                    <div className="h-4 bg-gray-600 rounded w-5/6 mt-2"></div>
                    <div className="h-5 bg-gray-700 rounded w-1/2 mt-2"></div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="h-10 bg-gray-700 rounded w-20"></div>
                      <div className="h-10 bg-gray-700 rounded w-10"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
          : cartItems.map((item,index) => (
              <div className='md:col-span-8  col-span-12 border rounded mt-5' key={index}>
                <div key={item._id} className="dark:bg-[#2a2a3d]  flex items-center justify-items-center justify-between rounded   shadow-lg p-5">
                <div className="flex">
                  <img
                    src={item?.productId?.productImages[0]}
                    alt={item?.productId?.productName}
                    className=" h-10 w-10 object-cover scale-150 rounded"
                  />
                  </div>
                  <h2 className="text-xl font-semibold mt-4">{item.productId?.productName}</h2>
                  <p className="text-sm text-gray-300">
                  </p>
                  <p className=" font-bold text-[#6b21a8] mt-2">
                    ₹{item.productId?.productSellingPrice}
                  </p>
                  <p className="text-sm md:block hidden text-gray-400">
                    Sold by: {item.productOwner.businessName}
                  </p>
                  <div className='flex flex-col justify-center items-center'> 
                    <IoIosArrowUp cursor={'pointer'} onClick={(e)=>increaseQty(e,item._id)} />
                    <span>{item.quantity}</span>
                    <IoIosArrowDown cursor={'pointer'} onClick={(e)=>decreaseQty(e,item._id,item.quantity)}/>
                  </div>
                    {/* <Button variant="destructive"  onClick={(e)=>deleteCartItems(e,item.productId?._id)} className="text-white"> */}
                      <Trash2 onClick={(e)=>deleteCartItems(e,item.productId?._id)} className='bg-red-600 text-white rounded-full p-2 cursor-pointer h-10 w-10 ' />
                    {/* </Button> */}
              </div>
              </div>
            ))}

            {
              cartItems.length > 0 && <div className='md:col-span-3 shadow-xl border rounded border-primary hover:scale-105 transition-all font-semibold col-span-12  md:absolute md:right-0'>
              <div className='px-5 py-3 flex flex-col gap-2'>
              <h1 className='font-bold border-b '> Price Summary</h1>
                  <h1>Total Quantity : {totalQty} </h1>
                  <h1>Total : ₹{totalPrice} </h1>
                  <h1>You Will Save On This Order : ₹{totalSavings} </h1>

              </div>
              <div className='p-2 bg-primary text-center font-bold text-white cursor-pointer' >Secure Checkout</div>
            </div>
            }
      </div> : <div className='flex justify-center translate-y-40'>
        <img src={emptyCart} className='mix-blend-multiply' alt="" />
      </div>
      }
    </div>
  )
}

export default CartPage

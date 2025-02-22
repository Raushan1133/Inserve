import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { summaryApi } from '@/common/summaryApi'
import dispalyINRcurrency from '@/helpers/displayINRCurrency'


const OrderHistory = () => {
  const [data,setData] = useState([])

  const fetchOrderDetails  = async ()=>{
    const response = await fetch(summaryApi.getOrders.url,{
      method:summaryApi.getOrders.method,
      credentials:'include'
    });

    const responseData = await response.json();
    console.log(responseData)
    const deliveredOrders = responseData?.data?.filter(item => item?.isDelivered) || [];
    setData(deliveredOrders);
    console.log(data)
  }

  useEffect(()=>{
    fetchOrderDetails();
  },[])
  return (
    <div>
      {
        !data[0] && (
          <p className='h-[calc(100vh-145px)] sm:h-[calc(100vh-125px)] text-2xl flex items-center justify-center font-semibold text-red-600' >No Order available</p>
        )
      }

      <div className='md:p-4 pb-4 pt-10 w-full '>
        {
          data?.map((item,index)=>{
            return(
              <div key={item.userId+index} className=''>
                <p className='font-medium text-lg'>{moment(item.createdAt).format('LL')}</p>
                <div className='border rounded'>
                <div className='flex justify-between  lg:flex-row flex-col'>
                <div className='grid gap-1 '>
                    <div className='flex lg:hidden justify-end lg:justify-start'>

                    <span className='bg-green-500   text-white font-semibold mx-2 px-2 py-1 rounded-full '>Delivered</span>
                    </div>
                  {
                    item?.productDetails?.map((product,index)=>{
                      return(
                        <div key={product.productId+index} className='flex items-center gap-3 '>
                          <img src={product.image[0]} alt="" className='w-28 h-28 object-scale-down p-2' />
                          <div>

                          <div className='font-medium text-ellipsis line-clamp-1'>{product.name}</div>
                          <div className='flex items-center flex-c gap-5 mt-1'>
                          <div className='text-lg text-red-600'>{dispalyINRcurrency(product.price)}</div>
                          <p>Quantity : {product.quantity}</p>
                          </div>
                          {/* <p>Sold By : {product.quantity}</p> */}

                          </div>
                        </div>
                      )
                    })
                  }
                </div>

                  <div className='flex gap-4 flex-col p-2 min-w-[300px]'>
                  <div>
                  <div className=' justify-end hidden lg:flex'> 
                <span className='bg-green-500  text-white font-semibold mx-2 px-2 py-1 rounded-full '>Delivered</span>
                </div>
                  <div className='text-lg font-medium'>Payment Details : </div>
                  <p className='ml-1'>Payment method : {item.paymentDetails.payment_method_type[0]}</p>
                  <p className='ml-1'>Payment Status : {item.paymentDetails.payment_status}</p>
                </div>
                <div>
                  <div className='text-lg font-medium'>Shipping Details : </div>
                  {
                    item?.shipping_options?.map((shipping,index)=>{
                      return(
                        <div key={shipping.shipping_rate} className=' ml-1'>
                          Shipping Amount : {dispalyINRcurrency(shipping.shipping_amount)}
                        </div>
                      )
                    })
                  }
                </div>
                  </div>
                </div>
                <div className='font-semibold w-fit ml-auto lg:text-lg'>
                  Total Amount : {dispalyINRcurrency(item.totalAmount)}
                </div>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default OrderHistory
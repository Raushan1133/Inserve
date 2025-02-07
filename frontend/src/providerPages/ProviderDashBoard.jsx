import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast from "react-hot-toast";
import { summaryApi } from "@/common/summaryApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MdCancel, MdDoneOutline } from "react-icons/md";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2Icon } from "lucide-react";
import ProductPage from "./ProductPage";

const ProviderDashBoard = () => {
  const [bookings, setBookings] = useState([]);
  const[loading,setLoading] = useState(false);
  const[isFetchingBookings,setIsFetchingBookings] = useState(false);
  const user = useSelector((state) => state.user);
  const fetchBookings = async () => {
    try {
      setIsFetchingBookings(true);
      const resp = await fetch(summaryApi.getBookings.url, {
        method: summaryApi.getBookings.method,
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
      });
      const response = await resp?.json();
      console.log(response);
      if (response?.success) {
        setBookings(response?.data);
        console.log(bookings);
      } else {
        toast.error("Error while fetching bookings !");
      }
      // console.log(response);
    } catch (error) {
      console.log(error);
      toast.error("Error while fetching bookings !");
    }finally{
      setIsFetchingBookings(false);
    }
  };
  const [modal, setModal] = useState(false);
  const [userInfo,setUserInfo] = useState({
          date: "",
          time: "",
          userId: ""
  })

  const [isUpdate,setIsUpdate] = useState(false);
  const[otp,setOtp] = useState("");
  const sendOtp = async (e, userId, email,date,time) => {
    e.stopPropagation();
    try {
      setLoading(true);
      const response = await fetch(summaryApi.sendCancellationOtpByUser.url, {
        method: summaryApi.sendCancellationOtpByUser.method,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          email: email,
        }),
      });
      const responseData = await response?.json();
      console.log("Mail response : ", responseData);
      if (responseData.success) {
        toast.success(responseData?.message);
        setUserInfo({
          date,
          time,
          userId,
          otp:""
        })
        console.log(userInfo)
        setModal(true);
      } else {
        toast.error(responseData?.message);
      } 
    } catch (error) {
      toast.error("Something went wrong !");
    }finally{
      setLoading(false);
    }
  };


  const cancelBookings = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      console.log(userInfo)
      setLoading(true);
      const resp = await fetch(summaryApi.cancelBookingByProvider.url, {
        method: summaryApi.cancelBookingByProvider.method,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          businessId: user?.id,
          date: userInfo.date,
          time: userInfo.time,
          userId: userInfo.userId,
          otp : otp
        }),
      });
      const response = await resp?.json();
      console.log(response)
      if (response?.success) {
        setOtp("");
        toast.success(response?.message);
        setModal(false);
        fetchBookings();
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error while cancelling !");
    }finally{
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const resp = await fetch(summaryApi.updateStatus.url,{
        method : summaryApi.updateStatus.method,
        headers:{
          "content-type":"application/json"
        },
        body:JSON.stringify({
          businessId: user?.id,
          date: userInfo.date,
          time: userInfo.time,
          userId: userInfo.userId,
          otp : otp
        })
      })
      const response = await resp?.json();
      console.log(response)
      if (response?.success) {
        setOtp("");
        setIsUpdate(false);
        setModal(false);
        fetchBookings();
        toast.success(response?.message);
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error while cancelling !");
    }finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const [isBooking,setIsBooking] = useState(false);
  const [isCompleted,setIsCompleted] = useState(false);

  return (
    <div>
      <Tabs defaultValue="booked" className="max-w-full mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="booked">Booked</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="booked">
          <Card>
            <CardHeader>
              <CardTitle>Booked</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 shadow-sm ">
              <div className="flex flex-col items-center gap-5 ">
                {
                  !isBooking && "No Bookings Yet"
                }
                {
                  isFetchingBookings  ? <Loader2Icon className="animate-spin" /> : bookings?.map(
                    (item, index) =>
                      item?.bookingStatus !== "completed" && (
                        <Link
                          to={`/user/${item?.user?._id}`}
                          key={index}
                          className="flex gap dark:bg-gray-900 items-center cursor-pointer w-full justify-between shadow rounded "
                        >
                          <div>
                            {
                              item.user.profile_pic ? <img
                              src={item.user.profile_pic}
                              alt="user"
                              className="h-20 w-20  rounded aspect-square bg-cover"
                            /> : <div className="bg-slate-200 text-black font-bold rounded-full h-10 w-10 my-2 flex items-center justify-center ">{item.user.name[0]}</div>
                            }
                            { !isBooking && setIsBooking(true)}
                          </div>
                          <p>{item.date}</p>
                          <p>{item.time}</p>
                          <p>{item.business.businessName}</p>
                          <p className="bg-purple-200 text-primary px-2 p-1 rounded-full">
                            {item.bookingStatus}
                          </p>
                          {item.bookingStatus !== "cancelled" && (
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                className="cursor-pointer"
                                asChild
                              >
                                <Button>Update</Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={(e) =>{
                                    setIsUpdate(true);
                                    sendOtp(e, item?.user?._id, item?.user?.email,item?.date,item?.time)
                                  }
                                  }
                                >
                                  <MdDoneOutline className="text-primary" />
                                  <span>Mark As Completed</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={(e) =>
                                    sendOtp(e, item?.user?._id, item?.user?.email,item?.date,item?.time)
                                  }
                                >
                                  <MdCancel className="text-red-500" />
                                  <span>Cancel</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                          <hr />
                        </Link>
                      )
                  )
                }
              </div>
            </CardContent>
            <CardFooter className="w-full"></CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 shadow-none">
              <div className="flex flex-col items-center gap-5 ">
                {
                  !isCompleted && "No Bookings to show"
                }
                {
                  isFetchingBookings ? <Loader2Icon className="animate-spin" /> : bookings?.map(
                    (item, index) =>
                      item?.bookingStatus === "completed" && (
                        <Link
                          to={`/user/${item?.user?._id}`}
                          key={index}
                          className="flex flex-wrap dark:bg-gray-900 items-center cursor-pointer w-full justify-between scrollbar-none shadow rounded "
                        >
                                                  <div>
                            {
                              item.user.profile_pic ? <img
                              src={item.user.profile_pic}
                              alt="user"
                              className="h-20 w-20  rounded aspect-square bg-cover"
                            /> : <div className="bg-slate-200  text-black font-bold rounded-full h-10 w-10 my-2 flex items-center justify-center ">{item.user.name[0]}</div>
                            }
                            {!isCompleted && setIsCompleted(true)}
                          </div>
                          <p>{item.date}</p>
                          <p>{item.time}</p>
                          
                          <p className="line-clamp-1">
                            {item.business.businessName}
                          </p>
                          <p className="bg-green-500 text-white px-2 p-1 rounded-full">
                            {item.bookingStatus}
                          </p>
                          <hr />
                        </Link>
                      )
                  )
                }
              </div>
            </CardContent>
            <CardFooter className="w-full"></CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      {
        modal && <div className="h-full w-full bg-slate-200 bg-opacity-35 top-0 bottom-0 left-0 right-0 fixed flex items-center justify-center ">
        <div className="bg-white dark:bg-gray-900 flex flex-col  rounded shadow-lg">
          <div className="text-end flex justify-end text-2xl cursor-pointer" onClick={()=>setModal(false)}><MdCancel /></div>
        <div className=" p-5 ">
          <div className="flex flex-col gap-5">
          <label htmlFor="">Enter Otp Provided To Customer: </label>
          <InputOTP maxLength={6}  value={otp} onChange={setOtp} autofocus
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          {
            isUpdate ? <Button onClick={(e)=>handleUpdateStatus(e)}>Update</Button> : <Button onClick={(e)=>cancelBookings(e)}>Submit</Button>
          }
          </div>
        </div>
        </div>
      </div>
      }
       {
        loading && <div className=" w-full bg-slate-200 bg-opacity-35 top-0 bottom-0 left-0 right-0 fixed flex items-center justify-center ">
        <div className="bg-white dark:bg-gray-900 flex flex-col  rounded shadow-lg">
        <div className=" p-5 text-center">
          <div className="text-center flex gap-2">

          Please Wait <Loader2Icon className="animate-spin" />
          </div>
        </div>
        </div>
      </div>
      }

      <ProductPage />
    </div>
  );
};

export default ProviderDashBoard;

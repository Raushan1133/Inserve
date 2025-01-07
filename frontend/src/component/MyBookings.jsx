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

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const resp = await fetch(summaryApi.getBookings.url, {
        method: summaryApi.getBookings.method,
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
      });
      const response = await resp?.json();
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
    }
  };

  const cancelBookings = async(e,businessId,date,time)=>{
    e.stopPropagation();
    e.preventDefault();
    try {
      const resp = await fetch(summaryApi.cancellBooking.url,{
        method : summaryApi.cancellBooking.method,
        headers: {
          "content-type" : "application/json"
        },
        body : JSON.stringify({
          businessId : businessId,
          date : date,
          time : time
        })
      });
      const response = await resp?.json();
      if(response?.success){
        toast.success(response?.message);
        fetchBookings();
      }else{
        toast.error(response?.message);
      }
    } catch (error) {
      console.log(error)
      toast.error("Error while cancelling !");
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

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
                {bookings?.map(
                  (item, index) =>
                    item?.bookingStatus !== "completed" && (
                      <Link
                        to={`/details/${item?.business?._id}`}
                        key={index}
                        className="flex gap dark:bg-gray-900 items-center cursor-pointer w-full justify-between shadow rounded "
                      >
                        <div>
                          <img
                            src={item.business.profile_pic}
                            alt="busienss"
                            className="h-20 w-20  rounded aspect-square bg-cover"
                          />
                        </div>
                        <p>{item.date}</p>
                        <p>{item.time}</p>
                        <p>{item.business.businessName}</p>
                        <p className="bg-purple-200 text-primary px-2 p-1 rounded-full">
                          {item.bookingStatus}
                        </p>
                        {
                         item.bookingStatus !== "cancelled" &&  <Button variant="destructive" onClick={(e)=>cancelBookings(e,item?.business?._id,item?.date,item?.time)}>Cancel</Button>
                        }
                        <hr />
                      </Link>
                    )
                )}
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
                {bookings?.map(
                  (item, index) =>
                    item?.bookingStatus === "completed" && (
                      <Link
                        to={`/details/${item?.business?._id}`}
                        key={index}
                        className="flex flex-wrap dark:bg-gray-900 items-center cursor-pointer w-full justify-between scrollbar-none shadow rounded "
                      >
                        <div>
                          <img
                            src={item.business.profile_pic}
                            alt="busienss"
                            className="h-20 w-20  rounded aspect-square bg-cover"
                          />
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
                )}
              </div>
            </CardContent>
            <CardFooter className="w-full"></CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyBookings;

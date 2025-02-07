import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NotebookIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { Calendar } from "@/components/ui/calendar";
import moment from 'moment'
import { summaryApi } from "@/common/summaryApi";
import toast from "react-hot-toast";

const BookingSection = ({ children, business }) => {
  const [date, setDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState([]);
  const [selectedTime, setSelectedTime] = useState();
  const user = useSelector(state => state?.user)
  const getTime = () => {

    const timeList = [];
    let firstShift = business?.businessStartTime?.split(":")[0];
    let secondShift = business?.businessClosingTime?.split(":")[0];
    console.log("firstShift : " ,  firstShift," SecondShift : ", secondShift)

    // Ṣhifts before Afternoon (Before 12:00PM)
    for (let i = firstShift; i < 12; i++) {
      timeList.push({
        time: i + ":00 AM",
      });
      timeList.push({
        time: i + `:${business?.serviceGap} AM`,
      });
    }


    for (let i = 12, j=0; j < secondShift; i++, j++) {
      if(i === 13){
        i = 1;
      }
      timeList.push({
        time: i + ":00 PM",
      });
      timeList.push({
        time: i + `:${business?.serviceGap} PM`,
      });
    }

    setTimeSlot(timeList);
  };

  const handleBooking = async()=>{
    try {
      const response = await fetch(summaryApi.addBooking.url,{
        method : summaryApi.addBooking.method,
        headers:{
          "content-type" : "application/json"
        },
        body:  JSON.stringify({
          userId : user.id,
          date : moment(date).format("DD-MM-YYYY"),
          time : selectedTime,
          businessId : business?._id,
        }),
        credentials:"include"
      });
      const responseResult = await response.json();
      if(responseResult?.success){
        toast.success(responseResult?.message);
        setDate(new Date());
        setSelectedTime("");
      }else{
        toast.error(responseResult?.message);
      }
      console.log("Service booked : ",responseResult)
      console.log(selectedTime , " ", moment(date).format("DD-MM-YYYY"))
    } catch (error) {
      toast.error("Something went wrong !");
    }
  }

  const[bookedSlot,setBookedSlot] = useState([]);
  const getBookedSlot = async()=>{
    try {
      const response = await fetch(summaryApi.getBookedSlot.url,{
        method : summaryApi.getBookedSlot.method,
        headers:{
          "content-type":"application/json"
        },
        body : JSON.stringify({
          businessId : business?._id,
          date :  moment(date).format("DD-MM-YYYY")
        }),
        credentials : "include"
      })
      const responseResult = await response.json();
      console.log(responseResult)
      setBookedSlot(responseResult?.data);
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong !");
    }
  }
  const isBookedSlot = (time)=>{
   return bookedSlot?.find(item=>item?.time === time && item.bookingStatus === 'booked')
  }

  useEffect(()=>{
    console.log(bookedSlot)
    getBookedSlot();
  },[date])

  useEffect(() => {
     getTime();
    setDate();
    setSelectedTime("");
  }, [business]);

  // Disable dates before today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>{children}</SheetTrigger>
        <SheetContent className="overflow-auto">
          <SheetHeader>
            <SheetTitle>Book Service</SheetTitle>
            <SheetDescription>
              Select Date And Time Slot To Book A Service
              {/* Pick a date */}
              <h1>{business?.name}</h1>
              <h2 className="font-bold my-5">Select Date</h2>
              <div className="flex flex-col gap-5 items-center ">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                  disabled={(date) => date < today}
                />
              </div>
              {/* Select Time SLot */}
              <h2 className="font-bold my-5">Select Time Slot</h2>
              <div className="grid grid-cols-3 gap-3">
                {timeSlot.map((item, index) => (
                  <Button
                    key={index}
                    // disabled={bookedDate.includes(moment(date).format("DD-MM-YYYY")) && bookedTime.includes(item?.time)}
                    disabled={isBookedSlot(item.time)}
                    onClick={() => setSelectedTime(item.time)}
                    variant="outline"
                    className={`border rounded-full text-xs sm:text-[15px] hover:bg-primary hover:text-white ${
                      selectedTime === item.time && "bg-primary text-white"
                    } ${isBookedSlot(item.time)  && "border-red-600"}`}
                  >
                    {
                      isBookedSlot(item.time) ? <span className="text-red-600">Booked</span> : `${item.time}`
                    }
                  </Button>
                ))}
              </div>
            </SheetDescription>
          </SheetHeader>
          <SheetFooter className={"mt-5"}>
            <SheetClose asChild>
                <div className="flex gap-5">
                    <Button variant="destructive" >Cancel</Button>
                    <Button disabled={!(selectedTime&&date)} onClick={(e)=>handleBooking(e)} className="bg-primary">Book</Button>
                </div>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default BookingSection;

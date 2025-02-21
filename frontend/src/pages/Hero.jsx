import { summaryApi } from "@/common/summaryApi";
import { Button } from "@/components/ui/button";
import { Cross, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import BusinessList from "../component/BusinessList";
import { useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { MdClose } from "react-icons/md";

const Hero = () => {
  // Fetch all Categories
  const user = useSelector((state) => state.user);
  const [categories, setCategories] = useState([]);
  const fetchCategories = async () => {
    try {
      const response = await fetch(summaryApi.fetchCategories.url);
      const responseResult = await response?.json();
      setCategories(responseResult);
    } catch (error) {}
  };

  let [businessName,setBusinessName] = useState("");
  const [range,setRange] = useState('500000000');
  const [userLocation,setUserLocation] = useState([]);
  const[shopkeepers,setShopkeepers] = useState([]);
  // const[modal,setModal] = useState(false);

  const [businessList, setBusinessList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const getAllBusiness = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(summaryApi.getAllBusiness.url);
      const responseResult = await response?.json();
      setIsLoading(false);
      setBusinessList(responseResult?.data);
      console.log("response : ", responseResult);
      // console.log(businessList)
    } catch (error) {
      setIsLoading(false);
      toast.error("something went wrong !");
    }
  };

  const[loading,setLoading] = useState(false);

  const handleSearch = async () => {
    if(!businessName) return
     console.log("Search initiated with:", { range, businessName });
     setLoading(true)

    try {

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
  
            setUserLocation(userLocation); // Update state
  
            console.log("User Location:", userLocation);
            businessName = businessName.trim();
            // Call API to fetch nearby shopkeepers
            const response = await fetch(summaryApi.searchBusiness.url,{
              method : summaryApi.searchBusiness.method,
              headers : {
                "content-type" : "application/json"
              },
              body : JSON.stringify({
                userLocation,
                range,
                businessName
              })
            });
  
            const data = await response.json();
  
            if (data?.success) {
              setShopkeepers(data.data);
              console.log("Nearby Shopkeepers:", shopkeepers);
            } else {
              toast.error("Server is down !")
              console.error("Error fetching shopkeepers:", data);
            }
          },
          (error) => {
            console.error("Error getting location:", error.message);
            toast.error("Error getting location:", error.message);
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        toast.error("Geolocation is not supported by this browser.");
      }
      setLoading(false)
    } catch (error) {
      setLoading(false);
      console.error("Unexpected error in handleSearch:", error);
      toast.error("Unexpected error in handleSearch:", error);
    }
  };
  

  useEffect(()=>{
    console.log(businessName)
    handleSearch();
  },[businessName,range])

  useEffect(() => {
    console.log(user);
    user.type !== "provider" && fetchCategories();
    user.type !== "provider" && getAllBusiness();
  }, []);
  return (
    <>
      <div className="flex flex-col justify-center items-center gap-3 ">
        <h1 className="text-[40px] font-bold text-center">
          Find Any <span className="text-primary">Shop/Services</span>
          <br /> Near You
        </h1>
        <h2 className="text-xl  text-gray-400">
          Explore Best And Trusted Shops Near You
        </h2>
        <div className="mt-4 relative flex gap-1 sm:gap-3 items-center">
          <Select onValueChange={(value) => setRange(value)}> 
            <SelectTrigger className="w-[100px] py-6 rounded-full ">
              <SelectValue placeholder="Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1000">1 km</SelectItem>
              <SelectItem value="2000">2 km</SelectItem>
              <SelectItem value="3000">3 km</SelectItem>
              <SelectItem value="4000">4 km</SelectItem>
              <SelectItem value="5000">5 km</SelectItem>
              <SelectItem value="6000">6 km</SelectItem>
              <SelectItem value="7000">7 km</SelectItem>
              <SelectItem value="8000">8 km</SelectItem>
              <SelectItem value="9000">9 km</SelectItem>
              <SelectItem value="10000">10 km</SelectItem>
            </SelectContent>
          </Select>

          <Input
          value={businessName}
          onChange={(e)=>{setBusinessName(e.target.value)}}
            placeholder="Which service You are looking for ?"
            className="md:w-[350px] rounded-full outline-none p-6 border-primary border"
          />

          <Button onClick={(e)=>{e.preventDefault()}} className="bg-primary rounded-full h-[46px]">
            <Search className="h-4 w-4" />
          </Button>
          {
       businessName && <div className="bg-white sm:w-[500px] w-[300px]   flex flex-col shadow-sm rounded-md border gap-5 dark:bg-gray-900 md:left- p-2 absolute top-16 z-10 ">
        <div className="text-right flex justify-end  cursor-pointer" onClick={()=>setBusinessName("")}> <MdClose className="text-red-600 text-2xl font-extrabold" /></div>
          {
            loading ? [1,1,1].map(()=>(
              <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            )) : 
            shopkeepers.length > 0 ? shopkeepers.map((item,index)=>(
                         <Link key={index} to={"/details/"+item?._id} className='flex gap-3 mt-3 cursor-pointer shadow-md  p-1 rounded-lg hover:shadow-primary'>
                            <img src={item?.profile_pic} alt={item.name} height={40} width={80} className='rounded-lg h-20 object-cover' />
                            <div>
                            <h2 className='font-bold'>{item?.businessName}</h2>
                            <h2 className='text-primary'>{item?.personName}</h2>
                            {/* <h2 className='text-gray-500'>{addresses[item._id] || "Fetching address..."}</h2> */}
                            </div>
                          </Link>
            )) : "No Shops/Services Found"
          }
       </div>
      }
        </div>
      </div>
      {/* Category List  */}
      <div className="mt-5">
        <h1 className="text-xl font-semibold">Some Popular Categories</h1>
        <div className="grid grid-cols-3 mt-5 md:grid-cols-4 lg:grid-cols-10 gap-4 justify-center">
          {categories.length > 0
            ? categories.map((data, i) => (
                <Link
                  to={"/all-category-business/" + data?._id}
                  key={i}
                  className="flex flex-col gap bg-purple-200 overflow-hidden p-1   items-center justify-center rounded-lg cursor-pointer hover:scale-110 transition ease-in-out "
                >
                  <div>
                    <img
                      src={data?.icon}
                      className="h-24 w-24 overflow-hidden object-scale-dow mix-blend-multiply"
                      alt="icon"
                    />
                  </div>
                  <h2 className="text-primary text-sm">{data?.name}</h2>
                </Link>
              ))
            : [1, 2, 3, 4, 5, 6].map((item, i) => (
                <div
                  key={i}
                  className="h-[120px] w-full bg-slate-200 animate-pulse rounded-lg"
                ></div>
              ))}
        </div>
      </div>

      {/* Business List */}
      <div className="mt-10 font-semibold text-xl">
        <h1>Some Popular Businesses Near You</h1>
        <BusinessList businessList={businessList} isLoading={isLoading} />
      
      </div>

    </>
  );
};

export default Hero;

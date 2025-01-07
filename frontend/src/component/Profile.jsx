import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import toast from "react-hot-toast";
import { summaryApi } from "@/common/summaryApi";
import { setUser } from "@/features/userSlice";
import { uploadFile } from "@/helpers/uploadPhoto";
import { MdCameraAlt, MdDelete, MdEdit } from "react-icons/md";
import { Loader2Icon, User } from "lucide-react";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!user.name) {
    navigate("/");
  }
  const [data,setData] = useState({
    profile_pic:"",
    name:"",
    email:"",
    type:""
  })
  const [password,setPassword] = useState({
    current_password : "",
    new_password : ""
  })

  const [imgLoading,setImgLoading] = useState(false);
  const handleUploadPhoto = async(e)=>{
    const file = e.target.files[0]
    
    setImgLoading(true)
    const uploadPhoto = await uploadFile(file)
    setData((preve)=>{
      return{
        ...preve, 
        profile_pic : uploadPhoto?.url
      }
    })
    setImgLoading(false);
  }

  const handleClearUploadPhoto = async(e)=>{
    e.stopPropagation()
    e.preventDefault()
    setData((preve)=>{
      return{
        ...preve,
        profile_pic : ""
      }
    })
  }
  const handleOnChangeDetails = (e)=>{
    const {name,value} = e.target;
    setData({
        ...data,
        [name] : value
    })
  }

  const handleOnChangePassword = (e)=>{
    const {name,value} = e.target;
    setPassword({
        ...password,
        [name] : value
    })
  }

  const[isDetailsLoading,setIsDetailsLoading] = useState(false);
  const handleUpdateDetails = async(e)=>{
    e.preventDefault();
    if(data.name === user?.name && data.email === user?.email && data.profile_pic === user?.profile_pic){
        toast.error("No changes !")
    }else{
      setIsDetailsLoading(true);
        try {
            const response = await fetch(summaryApi.updateUserDetails.url,{
                method: summaryApi.updateUserDetails.method,
                headers:{
                    "content-type":"application/json"
                },
                body:JSON.stringify({
                    profile_pic : data.profile_pic,
                    email : data.email,
                    name : data.name
                })
            });
            const responseResult = await response.json();
            setIsDetailsLoading(false);
            if(responseResult.success){
                toast.success(responseResult?.message);
                dispatch(setUser({
                    name:responseResult?.data?.name || responseResult?.data?.personName,
                    email :responseResult?.data?.email,
                    profile_pic : responseResult?.data?.profile_pic,
                    type : responseResult?.data?.type,
                }))
            }else{
                toast.error(responseResult.message);
            }
        } catch (error) {
            toast.error("Something went wrong !");
        }
    }
  }

  const [isPasswordLoading,setIsPasswordLoading] = useState(false)
  const handleSubmitPassword = async(e)=>{
    e.preventDefault();
    if(!password.current_password || !password.new_password ){
      toast.error("Please provide old and new password !");
      return;
    }

    try {
      setIsPasswordLoading(true);
      const response = await fetch(summaryApi.changePassword.url,{
        method: summaryApi.changePassword.method,
        headers:{
          "content-type" : "application/json"
        },
        body:JSON.stringify({
          email : user.email,
          curr_password : password.current_password,
          new_password : password.new_password
        })
      })
      const responseResult = await response.json();
      setIsPasswordLoading(false);
      if(responseResult?.success){
        toast.success(responseResult?.message);
        setPassword({
          current_password : "",
          new_password : ""
        })
      }else{
        toast.error(responseResult?.message);
      }
    } catch (error) {
      toast.error("Something went wrong !");
    }
  }
  useEffect(()=>{
    setData({
        profile_pic:user.profile_pic,
        name:user?.name,
        email:user?.email,
        type:user?.type
    })
  },[user])
  return (
    <div className="flex items-center justify-center">
      <div className="flex mx-w-md flex-col gap-4 shadow-xl items-center p-5 md:p-10 dark:bg-gray-900 rounded-lg hover:shadow-xl cursor-pointer justify-center">
      <h1 className="text-primary font-semibold text-3xl">My Profile</h1>
        <div className="h-48 w-48 border border-primary  rounded-full relative ">
          {data?.profile_pic ? (
            <div className="">
              <img
                src={data?.profile_pic}
                alt="my_pic"
                className="h-48 w-48 rounded-full object-cover aspect-square"
              />
              
            </div>
          ) : (
            <div className="h-48 w-48 rounded-full text-center flex justify-center items-center">
              <span className="text-2xl font-bold text-primary">
              {data?.name?.charAt(0)}
              {data?.name?.split(" ")[1]
                ? data?.name?.split(" ")[1].charAt(0)
                : ""}
              </span>
            </div>
          )}
            <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer" asChild>
            <span className="absolute bottom-2 right-3 text-primary text-3xl bg-slate-200 rounded-full p-2 cursor-pointer">< MdEdit /></span>
              
            </DropdownMenuTrigger>
            <DropdownMenuContent>
            <DropdownMenuItem className="cursor-pointer" >
        <MdCameraAlt className="text-primary" />
          <label className="cursor-pointer" htmlFor="profile_pic">New Photo</label>
        </DropdownMenuItem>
              <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={(e)=>handleClearUploadPhoto(e)} >
        <MdDelete className="text-red-500" />
          <span >Remove Photo</span>
        </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <input type="file"
          onChange={(e)=>handleUploadPhoto(e)} name="profile_pic" id="profile_pic" className="hidden" />
          {
            imgLoading && <span className="absolute top-20 left-20 text-primary text-3xl bg-slate-200 rounded-full p-2 cursor-pointer">< Loader2Icon className="animate-spin" /></span>
          }
          {
            user?.type === "provider" && <div className="mt-2 text-center flex justify-center "><span className="px-2 p-1 bg-purple-200 text-primary font-bold rounded-full ">{user?.type}</span></div>
          }
        </div>

          <Tabs defaultValue="account" className="max-w-md mt-8">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>   
              Make changes to your account here. Click save when you're done.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
            <label htmlFor="name"> Name: </label>
                <input type="text"
                 placeholder='Name'
                 name='name'
                 id='name'
                 value={data?.name}
                 onChange={(e)=>handleOnChangeDetails(e)}
                className='w-full p-2 border border-primary rounded-sm outline-none text-black' />
            </div>
            <div className="space-y-1">
            <label htmlFor="email"> Email: </label>
                <input type="text"
                 placeholder='Email'
                 name='email'
                 disabled
                 id='email'
                 value={data?.email}
                 onChange={(e)=>handleOnChangeDetails(e)}
                className='w-full p-2 border border-primary rounded-sm outline-none text-black cursor-not-allowed' />
            </div>
          </CardContent>
          <CardFooter className="w-full" >
            <div className="w-full">
            <Button className="w-full" onClick={(e)=>handleUpdateDetails(e)} >{isDetailsLoading ? <Loader2Icon className="animate-spin"/> : "Save Changes"}</Button>

            </div>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you'll be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
            <label htmlFor="current_password"> Current Password </label>
                <input type="text"
                 placeholder='current password'
                 name='current_password'
                 id='current_password'
                 value={password.current_password}
                 onChange={(e)=>handleOnChangePassword(e)}
                className='w-full p-2 border border-primary rounded-sm outline-none text-black' />
            </div>
            <div className="space-y-1">
            <label htmlFor="new_password"> New Password </label>
                <input type="text"
                 placeholder='new password'
                 name='new_password'
                 id='new_password'
                 value={password.new_password}
                 onChange={(e)=>handleOnChangePassword(e)}
                className='w-full p-2 border border-primary rounded-sm outline-none text-black' />
            </div>
          </CardContent>
          <CardFooter className="w-full" >
            <div className="w-full">
            <Button className="w-full" onClick={(e)=>handleSubmitPassword(e)}>{isPasswordLoading ? <Loader2Icon className="animate-spin" /> : "Save password"}</Button>

            </div>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
      </div>
    </div>
  );
};

export default Profile;

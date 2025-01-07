import { useDescope, useSession, useUser } from "@descope/react-sdk";
import { Descope } from "@descope/react-sdk";
import { getSessionToken, } from "@descope/react-sdk";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { setUser } from "../features/userSlice";
import { useDispatch } from "react-redux";
import { data, Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { LucideEye, LucideEyeClosed } from "lucide-react";
import { summaryApi } from "@/common/summaryApi";
import toast from "react-hot-toast";

export const Login = () => {

  const[loading,setLoading] = useState(false);
  const[showPassword,setShowPassword] = useState(false);
  const [data,setData] = useState({
    email : "",
    password : ""
  })
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useUser();
    
    const handleOnChange = async(e)=>{
      const {name,value} = e.target;

      setData({
        ...data,
        [name] : value
      })
    }

    const handleOnSubmit = async(e)=>{
      e.preventDefault();
     try {
      setLoading(true);
        const response = await fetch(summaryApi.login.url,{
          method: summaryApi.login.method,
          headers:{
            "content-type":"application/json"
          },
          credentials:"include",
          body:JSON.stringify({
            email : data.email,
            password : data.password
          })
        });

        const responseResult = await response?.json();
        console.log(responseResult);
        dispatch(setUser({
          id:responseResult?.data?._id,
          name:responseResult?.data?.name,
          email :responseResult?.data?.email,
          profile_pic :responseResult?.data?.profile_pic,
          type : responseResult?.data?.type,
        }))
        if(responseResult?.success){
          toast.success(responseResult?.message);
          navigate("/");
        }else{
          toast.error(responseResult?.message);
        }
        setLoading(false);
     } catch (error) {
      setLoading(false);
      toast.error("Something went wrong !")
        console.log(error)
     }
    }
    
  return (
    <div className="flex justify-center  ">
      <div className="max-w-xl shadow-xl p-10 ">
        <h1 className="text-primary font-semibold"> Let's  Get started with inserve !</h1>
        
          <form className="p-3 flex flex-col gap-3 ">
            <div>
            <label htmlFor="email">Email : </label>
            <input
              type="text"
              name="email"
              id="email"
              value={data.email}
              onChange={(e)=>handleOnChange(e)}
              className="w-full p-3 border text-black border-primary rounded-sm outline-none"
              placeholder="enter your email"
            />
            </div>
              <div>
              <label htmlFor="password">Password : </label>
              <div className="relative">
              <input
            required
            name="password"
            id="password"
            value={data.password}
              type={showPassword ? "text" :"password"}
              className="w-full p-3 border border-primary text-black rounded-sm outline-none"
              placeholder="password"
              onChange={(e)=>{handleOnChange(e)}}
            />
            {
              showPassword ? <LucideEyeClosed className="absolute text-primary right-3 cursor-pointer bottom-3 " onClick={()=>setShowPassword(!showPassword)} /> : <LucideEye onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 cursor-pointer bottom-3 text-primary" />
            }
              </div>
              </div>

              <div className="w-full mt-3 ">
                <Button className='w-full' onClick={(e)=>handleOnSubmit(e)} >Login</Button>
              </div>
              <Link to={'/register'}  className="text-right text-primary">New User ? Register here</Link >
          </form>
          <Descope
            flowId="sign-up-or-in"
            // get user details inside the onSuccess function
            onSuccess={(e) => {
              handleOnSubmit(e.detail.user.email)
              console.log(e.detail.user.name);
              console.log(e.detail.user.email);
              console.log(e.detail.user);
              dispatch(
                setUser({
                  name: e.detail.user.name,
                  email: e.detail.user.email,
                  profilePic: e.detail.user.picture,
                  type: "user",
                  token: "no token",
                })
              );

              navigate("/");
            }}
          />
      </div>
        
    </div>
  );
};

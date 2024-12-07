import { useDescope, useSession, useUser } from "@descope/react-sdk";
import { Descope } from "@descope/react-sdk";
import { getSessionToken } from "@descope/react-sdk";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { setUser } from "@/features/UserSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast";

export const RegisterLogin = () => {

  const [data,setData] = useState({
    name:"",
    email:"",
    password:"",
    confirmPassword:"",
    picture:"",
    type:""
  })

  const nameRegex = /^(?!.*([a-zA-Z])\1{2,})(?!.*(?:abcdefghijklmnopqrstuvwxyz|zyxwvutsrqponmlkjihgfedcba)).{3,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*\d)(?=.*[A-Z]).{8,}$/;
  const [checkName,setCheckName] = useState(true);
  const[checkEmail,setCheckEmail] = useState(true);
  const[checkPassword,setCheckPassword] = useState(true);
  const[checkConfirmPassword,setConfirmCheckPassword] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleOnChange = (e)=>{
      const {name,value} = e.target;
      setData({
        ...data,
        [name] : value
      })
    }

    const handleOnSubmit = async(e)=>{
      e.preventDefault();
      if(data.name && data.email && data.password && data.confirmPassword){
        if(!checkName || !checkEmail || !checkPassword || !checkConfirmPassword){
          toast.error("Please fill all fields properly !");
        }else{
          navigate("/type",{state:data})
        }
      }else{
        toast.error("All fields are required !");
      }
      console.log(data)
    }
  return (
    <div className="flex justify-center">

      <div className="max-w-xl shadow-xl p-10 ">
        <h1 className="text-primary font-semibold"> Let's  Get started with inserve !</h1>
          <form className="p-3 flex flex-col gap-3 ">
            <div>
            <label htmlFor="name">Name : </label>
            <input required
            name="name"
            id="name"
            value={data.name}
              type="text"
              className="w-full p-3 border border-primary rounded-sm outline-none"
              placeholder="enter your name"
              onChange={(e)=>{handleOnChange(e); setCheckName(nameRegex.test(e.target.value))}}
            />
            { !checkName && <p className="text-red-600">please enter a valid name !</p>}
            </div>
            <div>
            <label htmlFor="email">Email : </label>
            <input required
            name="email"
            id="email"
            value={data.email}
              type="text"
              className="w-full p-3 border border-primary rounded-sm outline-none"
              placeholder="enter your email"
              onChange={(e)=>{handleOnChange(e);setCheckEmail(emailRegex.test(e.target.value))}}
            />
            { !checkEmail && <p className="text-red-600">Invalid email !</p>}
            </div>
            {/* <div className="flex flex-col md:flex-row gap-3"> */}
              <div>
              <label htmlFor="password">Password : </label>
            <input
            required
            name="password"
            id="password"
            value={data.password}
              type="text"
              className="w-full p-3 border border-primary rounded-sm outline-none"
              placeholder="create a strong password"
              onChange={(e)=>{handleOnChange(e);setCheckPassword(passwordRegex.test(e.target.value))}}
            />
              { !checkPassword && <p className="text-red-600">Password must be at least 8 characters long, contain at least one uppercase letter, one digit, and one special character (!@#$%^&*)</p>}
              </div>
              <div>
            <label htmlFor="confirmPassword">Confirm Password : </label>
            <input
            required
            name="confirmPassword"
            id="confirmPassword"
            value={data.confirmPassword}
              type="text"
              className="w-full text-black p-3 border border-primary rounded-sm outline-none"
              placeholder="confirm password"
              onChange={(e)=>{handleOnChange(e); setConfirmCheckPassword(data.password === e.target.value)}}
            />
              { !checkConfirmPassword&& <p className="text-red-600">password and confirm password not matching</p>}
              </div>

            {/* </div> */}
              <div className="w-full mt-3 ">
                {/* <Link to={'/type'}> */}
                <Button onClick = {(e)=>handleOnSubmit(e)} className='w-full' type="submit" >Register</Button>
                {/* </Link> */}
              </div>
              <Link to={'/login'}  className="text-right text-primary">Already have an account ?</Link >
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

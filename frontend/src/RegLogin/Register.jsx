import { useDescope, useSession, useUser } from "@descope/react-sdk";
import { Descope } from "@descope/react-sdk";
import { getSessionToken } from "@descope/react-sdk";
import { setUser } from "../features/userSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast";
import {  CameraIcon, LucideEye, LucideEyeClosed } from "lucide-react";
import profile_gif from '../assets/profile_pic.webp'
import {uploadFile , deleteFile} from "@/helpers/uploadPhoto";
import { MdDelete } from "react-icons/md";


export const RegisterLogin = () => {

  const [data,setData] = useState({
    name:"",
    email:"",
    password:"",
    confirmPassword:"",
    picture:"",
  })

  const nameRegex = /^(?!.*([a-zA-Z])\1{2,})(?!.*(?:abcdefghijklmnopqrstuvwxyz|zyxwvutsrqponmlkjihgfedcba)).{3,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*\d)(?=.*[A-Z]).{8,}$/;
  const [checkName,setCheckName] = useState(true);
  const[checkEmail,setCheckEmail] = useState(true);
  const[checkPassword,setCheckPassword] = useState(true);
  const[checkConfirmPassword,setConfirmCheckPassword] = useState(true);
  const[showPassword,setShowPassword] = useState(false);
  const [showConfirmaPassword,setShowConfirmPassword] = useState(false);
  let public_id;
  // Image handling
  const [imgLoading,setImgLoading] = useState(false);
  const handleUploadPhoto = async(e)=>{
    const file = e.target.files[0]
    
    setImgLoading(true)
    const uploadPhoto = await uploadFile(file)
    console.log(uploadPhoto);
    public_id = uploadPhoto?.url
    setData((preve)=>{
      return{
        ...preve,
        picture : uploadPhoto?.url
      }
    })
    setImgLoading(false);
  }

  const handleClearUploadPhoto = async(e)=>{
    e.stopPropagation()
    e.preventDefault()
    // const data = await deleteFile(public_id);
    // console.log(data)
    setData((preve)=>{
      return{
        ...preve,
        picture : ""
      }
    })
  }


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
            {/* Image Handling */}
            <div>
            <div className='flex justify-center'>
            <div className='flex flex-col gap-1'>
                <label htmlFor='picture'>
                  {
                    data?.picture? <div className='h-28 relative rounded-full overflow-hidden  w-28 bg-slate-300 flex justify-center items-center border hover:border-primary cursor-pointer'>
                    <div className='h-full w-full flex justify-center items-center'>
                      {
                       <div> 
                        <img src={data?.picture} alt='profile pic' className='rounded-full h-full w-full  object-cover '/>
                        <div className='absolute text-2xl text-red-600 left-16 top-16 z-10'>
                        <button title='remove photo' className='text-4xl font-bold bg-white rounded-full   hover:text-red-600' onClick={handleClearUploadPhoto}>
                            <MdDelete/>
                          </button>
                        </div></div>
                      }
                    </div>
                      
                    
                </div> : <div className='h-28 relative rounded-full overflow-hidden  w-28 bg-slate-300 flex justify-center items-center border hover:border-primary cursor-pointer'>
                  {
                    imgLoading ? <div>                     <div className='h-full w-full'>
                    <img src={profile_gif} alt='profile pic' className='scale-125 rounded-full '/>
                  </div>
                    <div className='absolute text-4xl text-primary left-12 top-12 z-10 '><div className='flex justify-center items-center py-1'><div className='h-6 w-6 rounded-full border-t-transparent animate-spin border-4 border-primary'></div></div></div></div> :  <div><div className='h-full w-full'>
                    <img src={profile_gif} alt='profile pic' className='scale-125 rounded-full '/>
                  </div>
                    <div className='absolute text-2xl text-primary left-16 top-16 z-10'><CameraIcon/></div></div>
                  }

                </div>
                  }
                
                </label>
                
                <input
                  type='file'
                  id='picture'
                  name='picture'
                  className='bg-slate-100 px-2 py-1 focus:outline-primary hidden'
                  onChange={handleUploadPhoto}
                />
              </div>
            </div>
            </div>
            <div>
            <label htmlFor="name">Name : </label>
            <input required
            name="name"
            id="name"
            value={data.name}
              type="text"
              className="w-full p-3 border border-primary text-black rounded-sm outline-none"
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
              className="w-full p-3 border border-primary text-black rounded-sm outline-none"
              placeholder="enter your email"
              onChange={(e)=>{handleOnChange(e);setCheckEmail(emailRegex.test(e.target.value))}}
            />
            { !checkEmail && <p className="text-red-600">Invalid email !</p>}
            </div>
            {/* <div className="flex flex-col md:flex-row gap-3"> */}
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
              placeholder="create a strong password"
              onChange={(e)=>{handleOnChange(e);setCheckPassword(passwordRegex.test(e.target.value))}}
            />
            {
              showPassword ? <LucideEyeClosed className="absolute text-primary right-3 cursor-pointer bottom-3 " onClick={()=>setShowPassword(!showPassword)} /> : <LucideEye onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 cursor-pointer bottom-3 text-primary" />
            }
            {/* <LucideEyeClosed /> */}
              </div>
              { !checkPassword && <p className="text-red-600">Password must be at least 8 characters long, contain at least one uppercase letter, one digit, and one special character (!@#$%^&*)</p>}
              </div>
              <div>
            <label htmlFor="confirmPassword">Confirm Password : </label>
            <div className="relative">
            <input
            required
            name="confirmPassword"
            id="confirmPassword"
            value={data.confirmPassword}
              type={showConfirmaPassword ? "text" : "password"}
              className="w-full text-black p-3 border border-primary rounded-sm outline-none"
              placeholder="confirm password"
              onChange={(e)=>{handleOnChange(e); setConfirmCheckPassword(data.password === e.target.value)}}
            />
              {
              showConfirmaPassword ? <LucideEyeClosed className="absolute text-primary right-3 cursor-pointer bottom-3 " onClick={()=>setShowConfirmPassword(!showConfirmaPassword)} /> : <LucideEye onClick={()=>setShowConfirmPassword(!showConfirmaPassword)} className="absolute right-3 cursor-pointer bottom-3 text-primary" />
            }
            </div>
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

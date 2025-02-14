import React, { useEffect } from "react";
import Logo from "../assets/logo.png";
import { Button } from "../components/ui/button";
import { ModeToggle } from "../components/Toggle";
import { Link } from "react-router-dom";
import { useDescope, useUser } from "@descope/react-sdk";

 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../features/userSlice";
import toast from "react-hot-toast";
import { summaryApi } from "@/common/summaryApi";
import { BookCheck, LogOut, Settings, ShoppingCartIcon, User } from "lucide-react";

const Header = () => {
  // const { user } = useUser();
  const sdk = useDescope();
  const user = useSelector((state)=> state.user)
  const dispatch = useDispatch()
  // useEffect(() => {
  //   console.log(user);
  // }, [user]);
  const handleLogOut = async()=>{
    try {
        const response = await fetch(summaryApi.logout.url,{
          method:summaryApi.logout.method,
          credentials:"include"
        });
        const responseResult = await response.json();
        if(responseResult?.success){
          toast.success(responseResult?.message);
          sdk.logout();
          dispatch(removeUser());
        }else{
          toast.error(responseResult?.message);
        }
    } catch (error) {
      toast.error("Something went wrong !");
    }
  }
  return (
    <div className="flex backdrop-blur z-10 bg-background/50  items-center justify-between py-1 top-0 sticky shadow-md px-5 md:px-16">
      <Link to={"/"}>
        <img src={Logo} alt="logo" className="h-[80px] w-[80px]" />
      </Link>

      <div className="flex items-center gap-5">
        <ModeToggle />
        {
          user?.name && <div className="cursor-pointer">
            <span className="relative"><ShoppingCartIcon  /></span>
            <div className="bg-primary absolute top-5 ml-3 text-white h-6 w-6 text-center rounded-full">3</div>
          </div>
        }

        {!user?.name ? (
          
          <Link to={"/register"}>
            <Button>Get Started</Button>
          </Link>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer" asChild>
              <div className="h-[50px] w-[50px] rounded-full bg-slate-400 flex items-center justify-center">
                {
                  user?.profile_pic ? <img
                  src={user?.profile_pic}
                  className="rounded-full h-[50px] w-[50px] object-cover aspect-square"
                  alt="me"
                /> : <span className="font-bold">{user?.name?.charAt(0)}{user?.name?.split(" ")[1] ? user?.name?.split(" ")[1].charAt(0) : ""}</span>
                }
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent  >
            <Link  to={"/my-profile"}>
            <DropdownMenuItem className="cursor-pointer" >
            <User />
            <span >Profile</span>
          </DropdownMenuItem>
            </Link>
              <DropdownMenuSeparator  />
            {user.type === "seeker" ? <Link to={"/mybookings"}>
              <DropdownMenuItem className="cursor-pointer" >
            <BookCheck/>
            <span >My Bookings</span>
          </DropdownMenuItem></Link> : <Link to={"/provider-settings"}>
              <DropdownMenuItem className="cursor-pointer" >
            <Settings/>
            <span >Setting</span>
          </DropdownMenuItem></Link>
          }  
              <DropdownMenuSeparator />
        <DropdownMenuItem className='cursor-pointer' onClick={()=>handleLogOut()}>
          <LogOut />
          <span>Log out</span>
        </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default Header;

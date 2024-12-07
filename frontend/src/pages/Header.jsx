import React, { useEffect } from "react";
import Logo from "../assets/logo.png";
import { Button } from "../components/ui/button";
import { ModeToggle } from "../components/Toggle";
import { Link } from "react-router-dom";
import { useDescope, useUser } from "@descope/react-sdk";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RegisterLogin } from "@/RegLogin/Register";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "@/features/UserSlice";

const Header = () => {
  // const { user } = useUser();
  const sdk = useDescope();
  const user = useSelector((state)=> state.user)
  const dispatch = useDispatch()
  console.log(user)
  // useEffect(() => {
  //   console.log(user);
  // }, [user]);
  return (
    <div className="flex backdrop-blur z-10 bg-background/50  items-center justify-between py-1 top-0 sticky shadow-md px-5 md:px-16">
      <Link to={"/"}>
        <img src={Logo} alt="logo" className="h-[80px] w-[80px]" />
      </Link>

      <div className="flex items-center gap-2">
        <ModeToggle />

        {!user.name ? (
          
          <Link to={"/register"}>
            <Button>Get Started</Button>
          </Link>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer" asChild>
              <div className="h-[35px] w-[35px] rounded-full bg-primary">
                
                <img
                  src={user?.profilePic}
                  className="rounded-full"
                  alt="me"
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link>My Booking</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {sdk.logout();dispatch(removeUser())}}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default Header;

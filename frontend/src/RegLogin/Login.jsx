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
import { setUser } from "@/features/UserSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

export const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useUser();
    

    const handleOnSubmit = async(email)=>{
     const response =  await fetch("");
    }
    
  return (
    <div className="flex justify-center  ">
      <div className="max-w-xl shadow-xl p-10 ">
        <h1 className="text-primary font-semibold"> Let's  Get started with inserve !</h1>
        
          <form className="p-3 flex flex-col gap-3 ">
            <div>
            <label htmlFor="">Email : </label>
            <input
              type="text"
              className="w-full p-3 border border-primary rounded-sm outline-none"
              placeholder="enter your email"
            />
            </div>
              <div>
              <label htmlFor="">Password : </label>
            <input
              type="text"
              className="w-full p-3 border border-primary rounded-sm outline-none"
              placeholder="Enter password"
            />
              </div>

              <div className="w-full mt-3 ">
                <Button className='w-full ' >Login</Button>
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

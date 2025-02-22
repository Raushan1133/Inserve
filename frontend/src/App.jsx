import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { RegisterLogin } from './RegLogin/Register'
// import BusinessList from './pages/BusinessList'
import Hero from './pages/Hero'
import Layout from './pages/Layout'
import NotFound from './pages/NotFound'
import { Login } from './RegLogin/Login'
import AskType from './RegLogin/AskType'
import ProviderDetails from './RegLogin/ProviderDetails'
import BusinessList from './pages/BusinessList'
import ProviderDashBoard from './providerPages/ProviderDashBoard'
import { summaryApi } from './common/summaryApi'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from './features/userSlice'
import Profile from './component/Profile'
import BusinessDetails from './component/BusinessDetails'
import CategoryPage from './component/layout/CategoryPage'
import MyBookings from './component/MyBookings'
import ProviderSettings from './pages/ProviderSettings'
import UserProfile from './component/UserProfile'
import toast from 'react-hot-toast'
import Context from './utils/Context'
import CartPage from './pages/CartPage'
import MapComponent from './component/MapBox'
import Cancel from './pages/Cancel'
import Success from './pages/Success'
import Orders from './pages/Orders'
import OrderHistory from './pages/OrderHistory'
// import { BusinessList } from './pages/BusinessList'

function App() {
  const dispatch = useDispatch();
  const getUserDetails = async()=>{
    const response = await fetch(summaryApi.getUserDetails.url,{
      method:summaryApi.getUserDetails.method,
      credentials:"include", 
    })
    const responseResult = await response?.json();
    console.log(responseResult);
    dispatch(setUser({
      id:responseResult?.data?._id,
      name : responseResult?.data?.name || responseResult?.data?.personName,
      email : responseResult?.data?.email,
      profile_pic : responseResult?.data?.profile_pic,
      type : responseResult?.data?.type 
    }))
  }
  const user = useSelector(state => state.user);

  const addToCart = async(productId,productOwner)=>{
    try {
      
    } catch (error) {
      
    }
  }
  const [cartItems,setCartItems] = useState([]);
  const getCartItems = async()=>{
    try {
      const response = await fetch(summaryApi.getCartItems.url,{credentials :'include'});
      const responseData = await response.json();
      if(responseData?.success){
        setCartItems(responseData?.data);
      }
      console.log(responseData);
    } catch (error) {
      toast.error("Something went wrong !");
    }
  }

  // const context = context();

  useEffect(()=>{
    getUserDetails();
    getCartItems()
  },[user])
  return (
    <>
        <Context.Provider
          value={{cartItems,getCartItems,addToCart}}
        >
        <BrowserRouter >
        <Routes>
          <Route path='/' element={<Layout/>}>
          <Route index  element={user.type === 'provider' ? <ProviderDashBoard/> : <Hero/>} />
          <Route path='/business' element={<BusinessList  />} />
          <Route path='register' element={<RegisterLogin />} />
          <Route path='login' element={<Login />} />
          <Route path='type' element={<AskType />} />
          <Route path='my-profile' element={<Profile />} />
          <Route path='provider-details' element={<ProviderDetails />} />
          <Route path='details/:id' element={<BusinessDetails />} />
          <Route path='user/:id' element={<UserProfile />} />
          <Route path='all-category-business/:category' element={<CategoryPage />} />
          <Route path='mybookings' element={<MyBookings />} />
          <Route path='provider-dashboard' element={<ProviderDashBoard />} />
          <Route path='provider-settings' element={<ProviderSettings />} />
          <Route path='success' element={<Success />} />
          <Route path='cancel' element={<Cancel />} />
          <Route path='order' element={<Orders />} />
          <Route path='cart' element={<CartPage />} />
          <Route path='order-history' element={<OrderHistory />} />
          <Route path='navigate-to-provider' element={<MapComponent />} />
          </Route>
          <Route path='*' element={<NotFound/>} />
        </Routes>
      </BrowserRouter>
      </Context.Provider>
    </>
  )
}

export default App

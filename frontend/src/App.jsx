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
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from './features/userSlice'
import Profile from './component/Profile'
import BusinessDetails from './component/BusinessDetails'
import CategoryPage from './component/layout/categoryPage'
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
      name : responseResult?.data?.name || responseResult?.data?.personName,
      email : responseResult?.data?.email,
      profile_pic : responseResult?.data?.profile_pic,
      type : responseResult?.data?.type 
    }))
  }
  const user = useSelector(state => state.user);
  useEffect(()=>{
    getUserDetails();
  },[user])
  return (
    <>
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
          <Route path='all-category-business/:category' element={<CategoryPage />} />
          <Route path='provider-dashboard' element={<ProviderDashBoard />} />
          </Route>
          <Route path='*' element={<NotFound/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { RegisterLogin } from './RegLogin/Register'
import BusinessList from './pages/BusinessList'
import Header from './pages/Header'
import Hero from './pages/Hero'
import Layout from './pages/Layout'
import NotFound from './pages/NotFound'
import { Login } from './RegLogin/Login'
import AskType from './RegLogin/AskType'
import AskBusinessDetails from './RegLogin/AskBusinessDetails'


function App() {
  return (
    <>
        <BrowserRouter >
        <Routes>
          <Route path='/' element={<Layout/>}>
          <Route index  element={<Hero/>} />
          <Route path='/business' element={<BusinessList  />} />
          <Route path='register' element={<RegisterLogin />} />
          <Route path='login' element={<Login />} />
          <Route path='type' element={<AskType />} />
          <Route path='business-details' element={<AskBusinessDetails />} />
          </Route>
          <Route path='*' element={<NotFound/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

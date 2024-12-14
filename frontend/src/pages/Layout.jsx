import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <>
      <Header/>
        <br />
      <div className='md:mx-16 mx-5'>
      <Outlet  />
      </div>
    </>
  )
}

export default Layout

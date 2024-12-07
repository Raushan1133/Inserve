import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { useSelector } from 'react-redux'

const Hero = () => {
  const user = useSelector(state=>state.user)
  return (
    <div className=''>
      Hero
      Hero
      {
        user?.name && (
          <h1>Hello {user.name}</h1>
        )
      }
      <Link to={"/business"}>
      <Button>Click Me</Button>
      </Link>
    </div>
  )
}

export default Hero

import { Button } from '@/components/ui/button'
import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div>
      Not found
      <Link to={'/'}>
      <Button>Back to Home</Button>
      </Link>
    </div>
  )
}

export default NotFound

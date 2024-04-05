import React from 'react'
import  { Link } from "react-router-dom"

const Error404 = () => {
  return (
    <div>
        <div className='w-fit text-3xl mx-auto mt-[40vh]'>Page Not Found!</div>    
        <Link to={"/"}><div className='bg-[#fea920] w-fit p-3 rounded-lg my-[10px] mx-auto '>Go back to Home</div></Link>
    </div>
  )
}

export default Error404

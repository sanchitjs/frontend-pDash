import React, { useContext, useState, useEffect } from 'react'
import logo from './assets/logo2.png'
import {Link} from 'react-router-dom'
import { useAuth } from "../../context/AuthContext.jsx"

const Navbar = () => {
  const [opacity1, setopacity1] = useState(0);
  const [opacity2, setopacity2] = useState(0);
  // const [islogin, setislogin] = useState(1);
  const { islogin, setislogin } = useAuth();

  
  
  return (
    <nav className='py-5 bg-black'>
    <div className='flex items-center justify-between mx-[250px] max-second:mx-[50px]'>
      <img className='w-[130px] hover:cursor-pointer' src={logo}/>        
        <ul className='flex gap-[50px] items-center text-[17px] text-white'>
            {/* <li className='flex flex-col justify-center hover:cursor-pointer' onMouseOver={()=>{setopacity1(1)}} onMouseOut={()=>{setopacity1(0)}}>
              <div className='text-[17px]'>Home</div>
              {/* {
                (opacity1) ? 
                <div className= 'bg-[#fea920] w-full h-[2px] opacity-1 transition-all duration-300'></div>:
                <div className= 'bg-[#fea920] w-full h-[2px] opacity-0 transition-all duration-300'></div>
              } 
              <div className={`bg-[#fea920] w-full h-[2px] opacity-${opacity1} transition-all duration-300`}></div>
            </li> */}
            {/* <li className='flex flex-col justify-center hover:cursor-pointer' onMouseOver={()=>{setopacity2(1)}} onMouseOut={()=>{setopacity2(0)}}>
              <div className='text-[17px]'>Real-time</div>
              <div className={`bg-[#fea920] w-full h-[2px] opacity-${opacity2} transition-all duration-300`}></div>
            </li> */}
            {/* <Link to="/"><li className='flex flex-col justify-center hover:cursor-pointer' onMouseOver={()=>{setopacity1(1)}} onMouseOut={()=>{setopacity1(0)}}>
              <div className='text-[17px]'>Login</div>
              <div className={`bg-[#fea920] w-full h-[2px] opacity-${opacity1} transition-all duration-300`}></div>
            </li></Link> */}

            <a href="https://www.photomtechnologies.com/" target='_blank'><li className='flex flex-col justify-center hover:cursor-pointer' onMouseOver={()=>{setopacity2(1)}} onMouseOut={()=>{setopacity2(0)}}>
              <div className='text-[17px]'>About Us</div>
              <div className={`bg-[#fea920] ${opacity2 ? "w-[80%]" : "w-full"} m-auto h-[2px] opacity-${opacity2} transition-all duration-300`}></div>
            </li></a>
            
            <Link to="/"><li><button className='hover:px-2 hover:py-[3px] mb-[4px] rounded-md hover:bg-[#fea920] hover:text-black text-white transition-all duration-300'>Login</button></li></Link>
            {/* {((islogin) ?
              <li><button onClick={() => {setislogin(0)}} className='hover:px-2 hover:py-[3px] mb-[4px] rounded-md hover:bg-[#fea920] hover:text-white text-white transition-all duration-300'><Link to="/signup">Sign Up</Link></button></li>:
              <li><button onClick={() => {setislogin(1)}} className='hover:px-2 hover:py-[3px] mb-[4px] rounded-md hover:bg-[#fea920] hover:text-white text-white transition-all duration-300'><Link to="/">Login</Link></button></li>)
            } */}
        </ul>              
    </div>
    </nav>
  )
}

export default Navbar

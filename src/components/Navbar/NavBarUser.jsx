import React, { useContext, useState, useEffect } from 'react'
import logo from './assets/logo2.png'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from "../../context/AuthContext.jsx"
import { auth } from "../../firebase";
import { signOut } from "firebase/auth"
import { useNavigate } from 'react-router-dom';

const NavbarUser = () => {
    const [opacity1, setopacity1] = useState(0);
    const [opacity2, setopacity2] = useState(0);
    const [opacity3, setopacity3] = useState(0);
    const [opacity4, setopacity4] = useState(0);
    const navigate = useNavigate()

    const handleLogout = () => {
        signOut(auth).then(() => {
            // alert('Logged out successfully');
            navigate("/");
            window.localStorage.removeItem('isLoggedIn');
        }).catch((err) => {
            console.log(err);
        });
    }

    return (
        <>
            <nav className='py-5 bg-black text-white sticky top-0 z-10'>
                <div className='flex items-center justify-between mx-[50px] '>
                    <img className='w-[130px] hover:cursor-pointer' src={logo} />
                    <ul className='flex gap-[40px] items-center text-[17px]  '>
                        <NavLink to={"/user/dashboard"}><li className='flex flex-col justify-center hover:cursor-pointer' onMouseOver={() => { setopacity1(1) }} onMouseOut={() => { setopacity1(0) }}>
                            <div className='text-[17px] px-1 transition-all duration-300 '>Real-time</div>
                            <div className={`bg-[#fea920] ${opacity1 ? "w-[80%]" : "w-full"} h-[2px] opacity-${opacity1} transition-all duration-300 m-auto`}></div>
                        </li></NavLink>
                        <NavLink to={"/user/daily-report"}><li className='flex flex-col justify-center hover:cursor-pointer' onMouseOver={() => { setopacity2(1) }} onMouseOut={() => { setopacity2(0) }}>
                            <div className='text-[17px] px-1 transition-all duration-300 '>Report</div>
                            <div className={`bg-[#fea920] ${opacity2 ? "w-[80%]" : "w-full"} m-auto h-[2px] opacity-${opacity2} transition-all duration-300`}></div>
                        </li></NavLink>
                        <NavLink to={"/user/user-manual"}><li className='flex flex-col justify-center hover:cursor-pointer' onMouseOver={() => { setopacity3(1) }} onMouseOut={() => { setopacity3(0) }}>
                            <div className='text-[17px] px-1 transition-all duration-300 '>User Manual</div>
                            <div className={`bg-[#fea920] ${opacity3 ? "w-[80%]" : "w-full"} m-auto h-[2px] opacity-${opacity3} transition-all duration-300`}></div>
                        </li></NavLink>
                        <a href="https://www.photomtechnologies.com/" target='_blank'><li className='flex flex-col justify-center hover:cursor-pointer' onMouseOver={() => { setopacity4(1) }} onMouseOut={() => { setopacity4(0) }}>
                            <div className='text-[17px] px-1 transition-all duration-300 '>About Us</div>
                            <div className={`bg-[#fea920] ${opacity4 ? "w-[80%]" : "w-full"} m-auto h-[2px] opacity-${opacity4} transition-all duration-300`}></div>
                        </li></a>
                        <li onClick={handleLogout} className='cursor-pointer hover:px-2 hover:py-[3px] rounded-md transition-all duration-300 hover:bg-[#fea920] hover:text-black'>Logout</li>
                    </ul>
                </div>
            </nav>
            <Outlet />
        </>
    )
}

export default NavbarUser

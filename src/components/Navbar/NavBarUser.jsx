import React, { useContext, useState, useEffect, useRef } from 'react'
import logo from './assets/logo2.png'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from "../../context/AuthContext.jsx"
import { auth } from "../../firebase";
import { signOut } from "firebase/auth"
import { useNavigate } from 'react-router-dom';
import menu from '../../assets/menu-01-stroke-rounded.svg'
import close from '../../assets/cancel-01-stroke-rounded.svg'

const NavbarUser = () => {
    const [opacity1, setopacity1] = useState(0);
    const [opacity2, setopacity2] = useState(0);
    const [opacity3, setopacity3] = useState(0);
    const [opacity4, setopacity4] = useState(0);
    const [menuVisible, setMenuVisible] = useState(false)
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

    const handleMenuVisibility = () => {
        setMenuVisible(!menuVisible)
    }

    const floatingNavRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (floatingNavRef.current && !floatingNavRef.current.contains(event.target)) {
          setMenuVisible(false);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [floatingNavRef]);

    return (
        <>
            <nav className='py-5 bg-black text-white sticky top-0 z-20 h-[90px] max-[768px]:h-[80px] '>
                <div className='flex items-center justify-between mx-[50px] max-[1000px]:mx-[20px] '>
                    <img className='w-[130px] max-[768px]:w-[100px] hover:cursor-pointer' src={logo} />
                    <img onClick={handleMenuVisibility} src={menu} className='invert font-bold size-7 hidden max-[1000px]:block' />

                    {
                         (
                            <div className={`absolute bg-[#000000c1] w-[100vw] top-0 left-0 h-[100vh] hidden max-[1000px]:${menuVisible ? 'block' : 'hidden'}`}>
                                <div ref={floatingNavRef} className={`bg-black h-full w-fit pt-16 px-16 absolute transition-all duration-300 ${menuVisible ? 'right-0' : 'right-[-100%]'}`}>
                                    <div onClick={handleMenuVisibility} className=' cursor-pointer invert rounded-full absolute top-0 right-0 w-fit m-5'>
                                        <img src={close} className='size-6' />
                                    </div>
                                    <ul className='flex flex-col  gap-[40px] items-center text-[17px]'>
                                        <NavLink onClick={handleMenuVisibility} to={"/user/dashboard"}><li className='flex flex-col justify-center hover:cursor-pointer' onMouseOver={() => { setopacity1(1) }} onMouseOut={() => { setopacity1(0) }}>
                                            <div className='text-[17px] px-1 transition-all duration-300 '>Real-time</div>
                                            <div className={`bg-[#fea920] ${opacity1 ? "w-[80%]" : "w-full"} h-[2px] opacity-${opacity1} transition-all duration-300 m-auto`}></div>
                                        </li></NavLink>
                                        <NavLink onClick={handleMenuVisibility} to={"/user/daily-report"}><li className='flex flex-col justify-center hover:cursor-pointer' onMouseOver={() => { setopacity2(1) }} onMouseOut={() => { setopacity2(0) }}>
                                            <div className='text-[17px] px-1 transition-all duration-300 '>Report</div>
                                            <div className={`bg-[#fea920] ${opacity2 ? "w-[80%]" : "w-full"} m-auto h-[2px] opacity-${opacity2} transition-all duration-300`}></div>
                                        </li></NavLink>
                                        <NavLink onClick={handleMenuVisibility} to={"/user/user-manual"}><li className='flex flex-col justify-center hover:cursor-pointer' onMouseOver={() => { setopacity3(1) }} onMouseOut={() => { setopacity3(0) }}>
                                            <div className='text-[17px] px-1 transition-all duration-300 '>User Manual</div>
                                            <div className={`bg-[#fea920] ${opacity3 ? "w-[80%]" : "w-full"} m-auto h-[2px] opacity-${opacity3} transition-all duration-300`}></div>
                                        </li></NavLink>
                                        <a onClick={handleMenuVisibility} href="https://www.photomtechnologies.com/" target='_blank'><li className='flex flex-col justify-center hover:cursor-pointer' onMouseOver={() => { setopacity4(1) }} onMouseOut={() => { setopacity4(0) }}>
                                            <div className='text-[17px] px-1 transition-all duration-300 '>About Us</div>
                                            <div className={`bg-[#fea920] ${opacity4 ? "w-[80%]" : "w-full"} m-auto h-[2px] opacity-${opacity4} transition-all duration-300`}></div>
                                        </li></a>
                                        <li onClick={handleLogout} className='cursor-pointer hover:px-2 hover:py-[3px] rounded-md transition-all duration-300 hover:bg-[#fea920] hover:text-black'>Logout</li>
                                    </ul>
                                </div>
                            </div>
                        )

                    }

                    <ul className='flex gap-[40px] items-center text-[17px] max-[1000px]:hidden'>
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

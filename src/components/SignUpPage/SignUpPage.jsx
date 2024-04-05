import React, { useState } from 'react'
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext.jsx"

const LoginPage = () => {

    const [credentials, setCredentials] = useState({});
    const navigate = useNavigate()
    const { setislogin } = useAuth();

    const handleCredentials = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    const handleSignup = (e) => {
        e.preventDefault();

        if (credentials.email && credentials.password) {
            createUserWithEmailAndPassword(auth, credentials.email, credentials.password)
                .then(() => {
                    alert('Account Created Succesfully');
                    navigate('/');
                    window.localStorage.setItem("isSignedIn",true);
                    setislogin(1);
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // alert("Account already exists");
                });
        }

        else {
            alert("Please enter both the fields");
        }
    }

    return (
        <div className=" w-full h-[80vh] flex justify-center px-20 py-10 text-white items-center">
            <div className='flex items-center w-[90%] gap-[200px] justify-center '>
                <div className="left flex justify-center items-center">
                    <div className=' flex flex-col items-start'>
                        <div className='text-[80px] w-fit m-0'>PDash</div>
                        <div className='text-lg w-fit'>Unlock the Future of Robotics with Photom Technologies. Real-time Control. Precise Monitoring. Innovation at Your Fingertips.</div>
                    </div>
                </div>

                <div className="right backdrop-blur-lg rounded-lg flex flex-col justify-center gap-7 p-5 py-10 w-[50%] relative shadow-[0_20px_96px_6px_rgb(0,0,0)]">
                    <div className='flex flex-col items-center'>
                        <h1 className='text-3xl text-center [text-shadow:_2px_2px_0_rgb(0_0_0_/_40%)]'>Sign Up</h1>
                        {/* <span className='text-sm underline cursor-pointer text-center' onMouseOver={() => { setOpacity(1) }} onMouseOut={() => { setOpacity(0) }}>Forgot your credentials?</span>
                        <div className={`text-[11px] absolute top-[60px] right-[8px] bg-[#0000007f] text-white p-1 rounded-lg opacity-${opacity} transition-all duration-300`}>
                            <div>Contact</div>
                            <div>+91 XXXXX XXXXX</div>
                            <div>support@photomtechnologies.com</div>
                        </div> */}
                    </div>
                    <div>
                        <div className='text-md w-fit [text-shadow:_2px_2px_0_rgb(0_0_0_/_40%)]'>Email Address*</div>
                        <input onChange={(e) => { handleCredentials(e) }} className='px-3 py-2 w-full rounded-lg text-black' type="text" name='email' placeholder="enter email address" />
                    </div>
                    <div>
                        <div className='text-md flex justify-between items-end'>
                            <span className='[text-shadow:_2px_2px_0_rgb(0_0_0_/_40%)]'>Password*</span>



                        </div>
                        <input onChange={(e) => { handleCredentials(e) }} className='px-3 py-2 w-full rounded-lg text-black' type="password" name='password' placeholder="enter password" />
                    </div>
                    <div className='flex flex-col items-center justify-center rounded-full h-[45px] mt-4 '>
                        <button onClick={(e) => { handleSignup(e) }} className=' border-solid border-2 border-black text-black py-2 my-1  rounded-lg transition-all duration-300 w-[98%] hover:w-[100%] hover:bg-[#000000] hover:border-none hover:text-white '>Sign Up</button>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;

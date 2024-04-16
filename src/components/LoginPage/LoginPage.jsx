import React, { useState } from 'react'
import { auth } from '../../firebase';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from 'react-router-dom';
import { getCurrentUser, fetchUserRoleFromFirestore } from '../../auth.js';
import { useTypewriter, Cursor, Typewriter } from 'react-simple-typewriter'
import arrow from '../../assets/square-arrow-down-double-stroke-rounded.svg';

const LoginPage = () => {

    const [typeEffect] = useTypewriter({
        words: ['Real-time Control', 'Precise Monitoring', 'Daily and Monthly Updates'],
        loop: {},
        typeSpeed: 20,
        deleteSpeed: 10
    })

    const [credentials, setCredentials] = useState({});
    const navigate = useNavigate();

    const handleCredentials = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    const handleLogin = async (e) => {
        e.preventDefault();

        // if (credentials.email && credentials.password) {
        //     signInWithEmailAndPassword(auth, credentials.email, credentials.password)
        //         .then(() => {
        //             console.log("Logged in successfully");

        //         })
        //         .catch((error) => {
        //             const errorCode = error.code;
        //             const errorMessage = error.message;
        //             alert("Account does not exist! Please SignUp")
        //         });
        // }

        if (credentials.email && credentials.password) {
            try {
                // Replace with your actual authentication method (e.g., Firebase authentication)
                await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
                window.localStorage.setItem('isLoggedIn', true);
                // After successful login, fetch user role and navigate to the appropriate page
                const currentUser = await getCurrentUser();
                // Assuming you have a method to fetch user roles from Firestore
                const userRole = await fetchUserRoleFromFirestore(currentUser.uid);
                if (userRole === 'admin') {
                    navigate('/admin');
                } else if (userRole === 'user') {
                    navigate('/user/dashboard');
                } else {
                    // Handle other roles or scenarios
                }
            }
            catch (error) {
                let err = error.message;

                if (err == "Firebase: Error (auth/invalid-email).") {
                    alert('Login failed: Enter valid Email-ID');
                }
                if (err == "Firebase: Error (auth/invalid-credential).") {
                    alert('Login failed: Invalid Credentials');
                }
                if (err == "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).") {

                    alert('Login failed: \n\nAccess to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.\n\n Still facing issues contact admin');
                }
            }
        }

        else {
            alert("Please enter both the fields");
        }
    }

    const handleForgotPassword = () => {
        const email = prompt('Enter Email Address');

        if (email !== null) {
            if (email !== "") {
                sendPasswordResetEmail(auth, email);
                alert('Email has been sent for password reset');
            }
            else {
                alert('Invalid Entry! Please try again');
            }
        }

    }

    return (
        <div className=" w-[100vw] h-[75vh] flex justify-center px-20 max-[1400px]:px-10 py-10 text-white items-center">
            <div className='flex max-[920px]:flex-col items-center w-full second:px-32 justify-between '>
                <div className="left flex w-full max-[920px]:w-full justify-start items-center">
                    <div className='flex w-full flex-col items-start max-[920px]:items-center '>
                        <div className='text-[80px] max-[1200px]:text-[70px] third:text-[110px] max-[520px]:text-[50px] w-fit m-0 leading-[1]'>PDash</div>
                        <div className='w-full max-[920px]:text-center'>
                            {/* <div className='w-full text-xl max-[1200px]:text-[15px] max-[520px]:text-[14px] third:text-2xl max-[920px]:text-center max-[520px]:w-full'>Unlock the Future of Robotics with Photom Technologies</div> */}
                            {/* <div className='inline-block h-3 w-[1px] mx-2 bg-white'></div>
                            <span>Real-time Control</span>
                            <div className='inline-block h-3 w-[1px] mx-2 bg-white'></div>
                            <span>Precise Monitoring</span>
                            <div className='inline-block h-3 w-[1px] mx-2 bg-white'></div>
                            <span>Innovation at Your Fingertips</span> */}
                            <div className=' h-[50px] my-3 flex items-center max-[920px]:justify-center max-[920px]:mb-16 '>
                                <div className='text-[35px] max-[1200px]:text-[35px] third:text-[40px] max-[600px]:text-[25px] text-white'>
                                <Typewriter
                                    words={['Real-time Control', 'Precise Monitoring', 'Daily Updates','Monthly Updates']}
                                    loop={false}
                                    cursor
                                    cursorStyle='_'
                                    typeSpeed={20}
                                    deleteSpeed={10}
                                />
                                </div>
                                
                            </div>
                        </div>

                        <Link to={"/manual"}><div className='text-lg third:text-2xl max-[920px]:hidden flex gap-2 items-center w-fit py-3 px-6 transition-all duration-300 mt-3 rounded-lg cursor-pointer text-black bg-[#fea920]'>
                            <div>Get Started Now!</div>
                            <div><img src={arrow} className='rotate-[270deg] h-[35px]' /></div>
                        </div></Link>
                    </div>
                </div>

                <div className="right backdrop-blur-lg rounded-lg flex flex-col justify-center gap-7 p-5 py-10 min-w-[500px] max-[1400px]:min-w-[450px] max-[520px]:min-w-[350px] max-[520px]:py-7 max-[520px]:gap-4 relative shadow-[0_20px_96px_6px_rgb(0,0,0)]">
                    <div className='flex flex-col items-center'>
                        <h1 className='text-3xl [text-shadow:_2px_2px_0_rgb(0_0_0_/_40%)]'>Login</h1>

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
                            <span onClick={() => { handleForgotPassword() }} className='text-[blue] max-[1230px]:text-white max-[1230px]:text-[13px] text-[10px] font-bold underline my-[2px] cursor-pointer'>forgot password?</span>
                        </div>
                        <input onChange={(e) => { handleCredentials(e) }} className='px-3 py-2 w-full rounded-lg text-black' type="password" name='password' placeholder="enter password" />
                    </div>
                    <div className='flex flex-col items-center justify-center rounded-full h-[45px] mt-5'>
                        <button onClick={(e) => { handleLogin(e) }} className=' border-solid border-2 border-black text-black py-2 my-1  rounded-lg transition-all duration-300 w-[98%] hover:w-[100%] hover:bg-[#000000] hover:text-white max-[1500px]:hover:bg-white max-[1500px]:text-white max-[1500px]:border-white max-[1500px]:hover:text-black max-[1030px]:bg-[#fea920] max-[1030px]:text-black max-[1030px]:border-0 '>Login</button>
                        {/* {(islogin) ?
                            <span className='[text-shadow:_2px_2px_0_rgb(0_0_0_/_40%)] my-3'>New User? <span onClick={() => { setislogin(0) }} className='text-[blue] font-bold underline my-[2px] cursor-pointer [text-shadow:_0px_0px_0_rgb(0_0_0_/_40%)] mx-[2px]'> signup</span></span> :
                            <span className='[text-shadow:_2px_2px_0_rgb(0_0_0_/_40%)] my-3'>Already have an account?<span onClick={() => { setislogin(1) }} className='text-[blue] font-bold underline my-[2px] cursor-pointer [text-shadow:_0px_0px_0_rgb(0_0_0_/_40%)] mx-[5px]'>login</span></span>
                        } */}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage

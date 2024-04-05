import React, { useEffect } from 'react'
import { auth } from "../../firebase";
import { signOut } from "firebase/auth"
import { useNavigate } from 'react-router-dom';

const AdminDashboard = ({setProgress}) => {

  // useEffect(() => {
  //   setProgress(100);
  // }, [])

    const navigate = useNavigate();

    const handleLogout = async() => {
      signOut(auth).then(async() => {
        // alert('Logged out successfully');
          navigate("/");
          window.localStorage.removeItem('isLoggedIn');
          
        }).catch((err) => {
            console.log(err);
        });
    }

  return (
    <div>
      AdminDashboard
      <br />
      <button onClick={handleLogout} className='m-10 border border-black p-3 hover:bg-black hover:text-white'> Logout</button>
    </div>
  )
}

export default AdminDashboard
// import React, { useEffect, useState } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { getCurrentUser, fetchUserRoleFromFirestore } from '../auth.js';

// const PrivateRoute = ({ element: Element, requiredRoles, ...rest }) => {
//   const [userRole, setUserRole] = useState(null);

//   useEffect(() => {
//     const fetchUserRole = async () => {
//       try {
//         const currentUser = await getCurrentUser();
//         // Assuming you have a method to fetch user roles from Firestore
//         const userRole = await fetchUserRoleFromFirestore(currentUser.uid);
//         setUserRole(userRole);
//       } catch (error) {
//         console.error('Error fetching user role:', error.message);
//         // Handle error or set a default role
//       }
//     };

//     fetchUserRole();
//   }, []);

//   if (userRole === null) {
//     // User role is still being fetched, show loading spinner or similar
//     return <div>Loading...</div>;
//   }
  
//   // Check user role for role-based routing
//   if (requiredRoles && !requiredRoles.includes(userRole)  && userRole !== 'admin') {
//     return <Navigate to="/" />; // Redirect to the default route if the user doesn't have the required role
//   }
//   return <Element {...rest} />;
// };

// export default PrivateRoute;


import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { getCurrentUser, fetchUserRoleFromFirestore } from '../auth.js';

const PrivateRoute = ({ element: Element, requiredRoles, setProgress, ...rest}) => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
       
    const fetchUserRole = async () => {
      try {
        // setProgress(5); 
        const currentUser = await getCurrentUser();
        // setProgress(10); 

        if (currentUser) {
          const role = await fetchUserRoleFromFirestore(currentUser.uid);
          setUserRole(role);
        } else {
          setUserRole('guest'); // Set a default role for non-authenticated users
        }
      } catch (error) {
        console.error('Error fetching user role:', error.message);
        setUserRole('guest'); // Set a default role in case of an error
      }
    };

    fetchUserRole();
  }, []);

  if (userRole === null) {
    // User role is still being fetched, show loading spinner or similar
    return <div>Loading...</div>;
  }

  // Check user role for role-based routing
  if (requiredRoles && requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
    // Redirect to the default route if the user doesn't have the required role
    return <Navigate to="/" />;
  }

  return <Element {...rest} />;
};

export default PrivateRoute;

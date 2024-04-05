import { useState, useEffect } from 'react';
import { getCurrentUser, fetchUserRoleFromFirestore} from '../../auth'; 
import { Route, useNavigate } from 'react-router-dom';

const RoleChecker = () => {

    const [initialRoute, setInitialRoute] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
          const checkUserRole = async () => {
            try {
              const currentUser = await getCurrentUser();
      
              if (currentUser) {
                const userRole = await fetchUserRoleFromFirestore(currentUser.uid);
                console.log(userRole);
      
                if (userRole === 'admin') {
                  setInitialRoute('/admin');
                } else if (userRole === 'user') {
                  setInitialRoute('/user/dashboard');
                }
              } else {
                setInitialRoute('/');
              }
              navigate(initialRoute);
            } catch (error) {
              console.error('Error checking user role:', error.message);
            }
          };
      
          if (window.localStorage.getItem('isLoggedIn')) {
            checkUserRole();
          }
        }, [initialRoute]);

  return null
}

export default RoleChecker

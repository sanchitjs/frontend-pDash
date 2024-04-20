import React, { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar/Navbar.jsx';
import LoginPage from './components/LoginPage/LoginPage.jsx';
import SignUpPage from './components/SignUpPage/SignUpPage.jsx';
import AdminDashboard from './components/AdminDashboard/AdminDashboard.jsx';
import UserDashboard from './components/User/UserDashboard/UserDashboard.jsx';
import BgImage from './components/BgImage/BgImage.jsx';
import { BrowserRouter, Route, Routes, Router, useNavigate, Navigate, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute.jsx';
import { getCurrentUser, fetchPlantIDAndPlantNameFromFirestore, fetchUserRoleFromFirestore } from './auth'; // Assuming you have these functions
import NavbarUser from './components/Navbar/NavBarUser.jsx';
import NavbarManual from './components/Navbar/NavbarManual.jsx';
import Footer from './components/Footer/Footer.jsx';
import FooterLogin from './components/Footer/FooterLogin.jsx';
import Manual from './components/Manual/Manual.jsx';
import DailyReport from './components/User/DailyReport/DailyReport.jsx';
import RoleChecker from './components/RoleChecker/RoleChecker.jsx';
import Error404 from './components/Error404/Error404.jsx';
import LoadingBar from 'react-top-loading-bar'
import { SkeletonTheme } from 'react-loading-skeleton';

// const UserDashboard = lazy(() => import('./components/User/UserDashboard/UserDashboard.jsx'));
// const DailyReport = lazy(() => import('./components/User/DailyReport/DailyReport.jsx'));

const App = () => {

  const [progress, setProgress] = useState(0);

  const loaderFunc = async () => {
    const currUser = await getCurrentUser();
    // if (currUser) {
    //   const { plantID, plantName, userName } = await fetchPlantIDAndPlantNameFromFirestore(currUser.uid);
    //   return { plantID, plantName, userName };
    // }
    // return null
    if (currUser) return { currUser };
    else return null;
  }

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<><RoleChecker /><BgImage><Navbar /><LoginPage /><FooterLogin /></BgImage></>} />
        <Route path="*" element={<><Error404 /></>} />
        {/* <Route path="/signup" element={<BgImage><Navbar /><SignUpPage /></BgImage>} /> */}
        <Route path="manual" element={<><NavbarManual /><Manual /><Footer /></>} />
        <Route path="admin" element={<><PrivateRoute setProgress={setProgress} element={() => <AdminDashboard setProgress={setProgress} />} requiredRoles={['admin']} /></>} />
        <Route path="user" element={<><PrivateRoute setProgress={setProgress} element={() => <><NavbarUser /><Footer /></>} requiredRoles={['user']} /></>}>
          <Route
            path='dashboard'
            loader={loaderFunc}
            element={<><PrivateRoute setProgress={setProgress} element={() => <UserDashboard setProgress={setProgress} />} requiredRoles={['user']} /></>}
          />
          <Route
            path='daily-report'
            loader={loaderFunc}
            element={<><PrivateRoute setProgress={setProgress} element={() => <DailyReport />} requiredRoles={['user']} /></>}
          />
          <Route path='user-manual' element={<><PrivateRoute setProgress={setProgress} element={() => <Manual />} requiredRoles={['user']} /></>} />
        </Route>
      </>
    )
  )



  return (
    <>
      {/* <LoadingBar
        color='#fea920'
        progress={progress}
        // onLoaderFinished={() => setProgress(0)}
      /> */}
      <SkeletonTheme baseColor="#DFDFDF" highlightColor="#BCBCBC">
        <RouterProvider router={router} />
      </SkeletonTheme>
    </>
  );

  // return (
  //   <Routes>
  //       {/* {initialRoute !== null ? (navigate(initialRoute)) : (navigate('/'))} */}
  //       <Route path="/" element={<><BgImage><Navbar /><LoginPage /><FooterLogin /></BgImage></>} />
  //       {/* <Route path="/signup" element={<BgImage><Navbar /><SignUpPage /></BgImage>} /> */}
  //       <Route path="manual" element={<><NavbarManual /><Manual /><Footer /></>} />
  //       <Route path="admin" element={<><PrivateRoute element={() => <AdminDashboard />} requiredRoles={['admin']} /></>} />
  //       <Route path="user" element={<><PrivateRoute element={() => <><NavbarUser /><Footer /></>} requiredRoles={['user']} /></>}>
  //         <Route
  //           path='dashboard'
  //           // loader={loaderFunc}
  //           element={<><PrivateRoute element={() => <UserDashboard />} requiredRoles={['user']} /></>}
  //         />
  //         <Route
  //           path='daily-report'
  //           // loader={loaderFunc}
  //           element={<><PrivateRoute element={() => <DailyReport />} requiredRoles={['user']} /></>}
  //         />
  //         <Route path='user-manual' element={<><PrivateRoute element={() => <Manual />} requiredRoles={['user']} /></>} />
  //       </Route>
  //     </Routes>
  // )
};

export default App; 
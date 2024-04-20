import React, { useState, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { RiH1 } from 'react-icons/ri'

ReactDOM.createRoot(document.getElementById('root')).render(



    // <BrowserRouter>
    <AuthProvider>
        <App />
    </AuthProvider>
    // </BrowserRouter>
)

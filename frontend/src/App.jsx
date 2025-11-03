import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router'
import { Toaster } from 'react-hot-toast'

import { SignedIn, SignedOut, useAuth , SignInButton, SignOutButton ,UserButton,useUser } from '@clerk/clerk-react'

import HomePage from './pages/HomePage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ProblemsPage from './pages/ProblemsPage.jsx'

function App() {
  const {isSignedIn} = useUser();
  return (
    <>
    <Routes>
      <Route path = "/" element = {<HomePage/>} />
      <Route path = "/about" element = {<AboutPage/>} />
      <Route path = "/problems" element = {isSignedIn ? <ProblemsPage/> : <Navigate to={'/'}/>} />

    </Routes>
    <Toaster toastOptions={{duration : 3000}}/>
    </>

  )
}

export default App

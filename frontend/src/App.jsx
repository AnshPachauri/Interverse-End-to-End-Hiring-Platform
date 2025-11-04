import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router'
import { Toaster } from 'react-hot-toast'

import { SignedIn, SignedOut, useAuth , SignInButton, SignOutButton ,UserButton,useUser } from '@clerk/clerk-react'

import HomePage from './pages/HomePage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ProblemsPage from './pages/ProblemsPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ProblemPage from './pages/ProblemPage.jsx'

function App() {
  const {isSignedIn,isLoaded} = useUser();

  if(!isLoaded){
    return null;
  }
  return (
    <>
    <Routes>
      <Route path = "/" element = {!isSignedIn ? <HomePage/> : <Navigate to={'/dashboard'}/>} />
      <Route path = "/dashboard" element = {isSignedIn ? <Dashboard/> : <Navigate to={'/'}/>} />
      <Route path = "/about" element = {<AboutPage/>} />
      <Route path = "/problems" element = {isSignedIn ? <ProblemsPage/> : <Navigate to={'/'}/>} />
      <Route path = "/problem/:id" element = {isSignedIn ? <ProblemPage/> : <Navigate to={'/'}/>} />

    </Routes>
    <Toaster toastOptions={{duration : 3000}}/>
    </>

  )
}

export default App

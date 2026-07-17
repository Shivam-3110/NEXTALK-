import React, { useContext, useState, useEffect } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'

const LoginPage = () => {

  const [currState, setCurrState] = useState("Sign up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [error, setError] = useState("");

  const {login} = useContext(AuthContext)

  useEffect(() => {
    const handleMouseMove = (e) => {
      const trail = document.createElement('div')
      trail.className = 'zigzag-trail'
      trail.style.left = e.clientX + 'px'
      trail.style.top = e.clientY + 'px'
      document.body.appendChild(trail)
      setTimeout(() => trail.remove(), 800)
    }
    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const onSubmitHandler = (event)=>{
    event.preventDefault();

    const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if(!emailPattern){
      setError("Email is required!");}
      else if(!emailPattern.test(email)){
        setError("Please enter a valid Gmail address ");}
        else{
          setError("");
        }


    if(currState === 'Sign up' && !isDataSubmitted){
      setIsDataSubmitted(true)
      return;
    }

    login(currState=== "Sign up" ? 'signup' : 'login', {fullName, email, password, bio})
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col relative overflow-hidden'>
      {/* 3D Animated Background */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='floating-shape shape-1'></div>
        <div className='floating-shape shape-2'></div>
        <div className='floating-shape shape-3'></div>
        <div className='floating-shape shape-4'></div>
        <div className='floating-shape shape-5'></div>
        <div className='shape-3d cube-1'></div>
        <div className='shape-3d sphere-1'></div>
        <div className='shape-3d pyramid-1'></div>
        <div className='shape-3d torus-1'></div>
      </div>
      <div className='absolute inset-0 backdrop-blur-sm bg-black/20'></div>

      {/* -------- left -------- */}
      <img src={assets.logo_icon} alt="" className='w-[min(30vw,250px)] relative z-10 logo-3d'/>

      {/* -------- right -------- */}

      <form onSubmit={onSubmitHandler} className='border-2 bg-white/10 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg relative z-10 backdrop-blur-md'>
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currState}
          {isDataSubmitted && <img onClick={()=> setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" className='w-5 cursor-pointer'/>
          }
          
         </h2>

        {currState === "Sign up" && !isDataSubmitted && (
          <input onChange={(e)=>setFullName(e.target.value)} value={fullName}
           type="text" className='p-2 border border-gray-500 rounded-md focus:outline-none' placeholder="Full Name" required/>
        )}

        {!isDataSubmitted && (
          <>
          <input onChange={(e)=>setEmail(e.target.value)} value={email}
           type="email" placeholder='Email Address' required 
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'/>
            {error && <p className='text-red-500 text-sm'>{error}</p>}

          <input onChange={(e)=>setPassword(e.target.value)} value={password}
           type="password" placeholder='Password' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'/>
          </>
        )}

        {currState === "Sign up" && isDataSubmitted && (
            <textarea onChange={(e)=>setBio(e.target.value)} value={bio}
             rows={4} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='provide a short bio...' required></textarea>
          )
        }

        <button type='submit' className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>
          {currState === "Sign up" ? "Create Account" : "Login Now"}
        </button>

        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        <div className='flex flex-col gap-2'>
          {currState === "Sign up" ? (
            <p className='text-sm text-gray-500'>Already have an account? <span onClick={()=>{setCurrState("Login"); setIsDataSubmitted(false)}} className='font-medium text-violet-500 cursor-pointer'>Login here</span></p>
          ) : (
            <p className='text-sm text-gray-600'>Create an account <span onClick={()=> setCurrState("Sign up")} className='font-medium text-violet-500 cursor-pointer'>Click here</span></p>
          )}
        </div>
         
      </form>
    </div>
  )
}

export default LoginPage

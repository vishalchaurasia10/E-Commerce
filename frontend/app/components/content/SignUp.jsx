'use client'
import { bebas_neue, roboto } from '@/app/utils/fonts'
import Link from 'next/link'
import React, { useContext, useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { FcGoogle } from 'react-icons/fc'
import authContext from '@/app/context/Auth/authContext'

const SignUp = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '', confirmPassword: '' })
    const { signUp, googleAuth, loading } = useContext(authContext)

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const handleSignUp = () => {
        if (credentials.password === '' || credentials.email === '' || credentials.confirmPassword === '') {
            toast.error('Please fill all the details')
            return
        } else if (credentials.password !== credentials.confirmPassword) {
            toast.error('Password does not match')
            return
        } else if (credentials.password.length < 8) {
            toast.error('Password must be at least 8 characters')
            return
        }
        signUp(credentials.email, credentials.password)
        setCredentials({ email: '', password: '', confirmPassword: '' })
    }


    return (
        <>
            <Toaster />
            <div className="login md:w-1/2 px-3 py-5 mx-auto flex flex-col space-y-4 items-center justify-center">
                <h1 className={`${bebas_neue.className} text-6xl`} >Sign Up</h1>
                <input
                    className='w-full outline-none border border-[#4D7E86] px-4 py-2'
                    onChange={(e) => handleChange(e)}
                    value={credentials.email}
                    type="email"
                    name='email'
                    id='email'
                    placeholder='Email' />
                <input
                    className='w-full outline-none border border-[#4D7E86] px-4 py-2'
                    onChange={(e) => handleChange(e)}
                    value={credentials.password}
                    type="password"
                    name='password'
                    id='password'
                    placeholder='Create Password' />
                <input
                    className='w-full outline-none border border-[#4D7E86] px-4 py-2'
                    onChange={(e) => handleChange(e)}
                    value={credentials.confirmPassword}
                    type="password"
                    name='confirmPassword'
                    id='confirmPassword'
                    placeholder='Confirm Password' />
                <button onClick={handleSignUp} className={`${roboto.className} w-full flex items-center justify-center py-2 bg-[#2C3E50] text-white`}>
                    {loading && <span className="loading mr-2 loading-spinner loading-md"></span>}
                    <span>Sign Up</span>
                </button>
                <p className='text-sm'>
                    Already have an account?
                    <Link className='text-[#4D7E86] hover:underline' href='/sign-in'>
                        Login
                    </Link>
                </p>
                <div className="divider">Or</div>
                <button onClick={googleAuth} className={`${roboto.className} flex items-center justify-center space-x-2 w-full py-2 border border-[#4D7E86]`}>
                    <FcGoogle className='text-2xl' />
                    <span>
                        Login with Google
                    </span>
                </button>
            </div>
        </>
    )
}

export default SignUp

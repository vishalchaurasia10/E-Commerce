'use client'
import { bebas_neue, roboto } from '@/app/utils/fonts'
import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import authContext from '@/app/context/Auth/authContext'
import { toast, Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const SignIn = () => {

    const [credentials, setCredentials] = useState({ email: '', password: '' })
    const { signIn } = useContext(authContext)
    const { user } = useContext(authContext)
    const router = useRouter()

    useEffect(() => {
        if (user) {
            router.push('/profile')
        }
    }, [user])

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const handleSignIn = () => {
        if (credentials.password === '' || credentials.email === '') {
            toast.error('Please fill all the details')
            return
        } else if (credentials.password.length < 8) {
            toast.error('Password must be at least 8 characters')
            return
        }
        signIn(credentials.email, credentials.password)
        setCredentials({ email: '', password: '' })
    }

    return (
        <>
            <Toaster />
            <div className="login md:w-1/2 px-3 py-5 mx-auto flex flex-col space-y-4 items-center justify-center">
                <h1 className={`${bebas_neue.className} text-6xl`} >Log IN</h1>
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
                    placeholder='Password' />
                <p className='text-sm'>
                    <Link className='hover:underline hover:text-[#4D7E86]' href='/sign-up'>
                        Forgot Password?
                    </Link>
                </p>
                <button onClick={handleSignIn} className={`${roboto.className} w-full py-2 bg-[#2C3E50] text-white`}>Sign In</button>
                <p className='text-sm'>
                    Don't have an account?
                    <Link className='text-[#4D7E86] hover:underline' href='/sign-up'>
                        Sign Up
                    </Link>
                </p>
                <div className="divider">Or</div>
                <button className={`${roboto.className} flex items-center justify-center space-x-2 w-full py-2 border border-[#4D7E86]`}>
                    <FcGoogle className='text-2xl' />
                    <span>
                        Login with Google
                    </span>
                </button>
            </div>
        </>
    )
}

export default SignIn
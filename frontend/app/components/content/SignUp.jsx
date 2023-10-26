import { bebas_neue, roboto } from '@/app/utils/fonts'
import Link from 'next/link'
import React from 'react'
import { FcGoogle } from 'react-icons/fc'

const SignUp = () => {
    return (
        <>
            <div className="login md:w-1/2 px-3 py-5 mx-auto flex flex-col space-y-4 items-center justify-center">
                <h1 className={`${bebas_neue.className} text-6xl`} >Sign Up</h1>
                <input className='w-full outline-none border border-[#4D7E86] px-4 py-2' type="email" name='email' id='email' placeholder='Email' />
                <input className='w-full outline-none border border-[#4D7E86] px-4 py-2' type="password" name='password' id='password' placeholder='Create Password' />
                <input className='w-full outline-none border border-[#4D7E86] px-4 py-2' type="password" name='password' id='password' placeholder='Confirm Password' />
                <button className={`${roboto.className} w-full py-2 bg-[#2C3E50] text-white`}>Sign Up</button>
                <p className='text-sm'>
                    Already have an account?
                    <Link className='text-[#4D7E86] hover:underline' href='/sign-in'>
                        Login
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

export default SignUp

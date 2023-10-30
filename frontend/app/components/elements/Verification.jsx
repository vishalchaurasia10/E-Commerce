'use client'
import React, { useContext, useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { AiFillCheckCircle, AiFillCloseCircle, AiFillExclamationCircle } from 'react-icons/ai';
import { useSearchParams, useRouter } from 'next/navigation';
import authContext from '@/app/context/Auth/authContext';

const Verificaiton = () => {

    const [verified, setVerified] = useState(false)
    const token = useSearchParams().get('token')
    const { user } = useContext(authContext)
    const router = useRouter()

    useEffect(() => {
        if (token) {
            localStorage.setItem('accessToken', token)
        }
    }, [])

    useEffect(() => {
        setVerified(true)
        if (user) {
            router.push('/profile')
        }
    }, [user])

    return (
        <>
            <Toaster />
            {(verified ?
                <div className='h-screen text-center flex flex-col items-center justify-center space-y-4 -mt-24'>
                    <AiFillCheckCircle className='text-green-500 text-9xl' />
                    <h1 className='text-black text-4xl md:text-5xl font-bold md:pb-4 lg:pb-0 xl:pb-4 lg:py-2'>Email verified successfully</h1>
                </div>
                :
                <div className='h-screen text-center flex flex-col items-center justify-center space-y-4 -mt-24'>
                    <AiFillExclamationCircle className='text-orange-400 text-9xl' />
                    <h1 className='text-black text-4xl md:text-5xl font-bold md:pb-4 lg:pb-0 xl:pb-4 lg:py-2'>Email verifying...</h1>
                </div>)}
        </>
    )
}

export default Verificaiton
'use client'
import React, { useEffect, useState } from 'react'
import { AiFillCheckCircle, AiFillExclamationCircle } from 'react-icons/ai';
import { useSearchParams, useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';

const VerifyUser = () => {

    const [verified, setVerified] = useState(false)
    const token = useSearchParams().get('token')
    const router = useRouter()

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/verify?token=${token}`)
                const data = await response.json()
                if (response.status === 200) {
                    toast.success(data.message)
                    setVerified(true)
                    setTimeout(() => {
                        router.push('/sign-in')
                    }, 3000)
                }
            } catch (error) {
                toast.error(error.message)
            }
        }
        verifyUser()
    }, [])

    return (
        <>
            <Toaster />
            {(verified ?
                <div className={`h-screen font-roboto text-center flex flex-col items-center justify-center space-y-4 -mt-24`}>
                    <AiFillCheckCircle className='text-green-500 text-9xl' />
                    <h1 className='text-black text-4xl md:text-5xl font-bold md:pb-4 lg:pb-0 xl:pb-4 lg:py-2'>Email verified successfully</h1>
                </div>
                :
                <div className={`h-screen font-roboto text-center flex flex-col items-center justify-center space-y-4 -mt-24`}>
                    <AiFillExclamationCircle className='text-orange-400 text-9xl' />
                    <h1 className='text-black text-4xl md:text-5xl font-bold md:pb-4 lg:pb-0 xl:pb-4 lg:py-2'>Email verifying...</h1>
                </div>)}
        </>
    )
}

export default VerifyUser

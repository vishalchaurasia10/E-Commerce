'use client'
import React, { useEffect, useState } from 'react'
import { AiFillExclamationCircle } from 'react-icons/ai';
import { useSearchParams, useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';

const ResetPassword = () => {

    const [verified, setVerified] = useState(false)
    const [credentials, setCredentials] = useState({ password: '', confirmPassword: '' })
    const [loading, setLoading] = useState(false)
    const token = useSearchParams().get('token')
    const router = useRouter()

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const handleSend = async () => {
        if (credentials.password === '' || credentials.confirmPassword === '') {
            toast.error('Please fill all the details')
            return
        } else if (credentials.password !== credentials.confirmPassword) {
            toast.error('Password does not match')
            return
        } else if (credentials.password.length < 8) {
            toast.error('Password must be at least 8 characters')
            return
        }
        setLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/update-password-with-reset-token/${token}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ newPassword: credentials.password })
            })
            const data = await response.json()
            if (response.status === 200) {
                toast.success(data.message)
                router.push('/sign-in')
            } else {
                toast.error(data.error)
            }
        } catch (error) {
            toast.error(error.message)
        }
        setLoading(false)
    }

    useEffect(() => {
        const verifyResetToken = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/verify-reset-token/${token}`)
                const data = await response.json()
                if (response.status === 200) {
                    toast.success(data.message)
                    setVerified(true)
                } else {
                    toast.error(data.error)
                }
            } catch (error) {
                toast.error(error.message)
            }
        }
        verifyResetToken()
    }, [])

    return (
        <>
            <Toaster />
            {(verified ?
                <div className="login md:w-1/2 px-3 py-5 mx-auto flex flex-col space-y-4 items-center justify-center">
                    <h1 className={`font-bebas_neue text-6xl`} >RESET PASSWORD</h1>
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
                    <button onClick={handleSend} className={`font-roboto w-full flex items-center justify-center py-2 bg-[#2C3E50] text-white`}>
                        {loading && <span className="loading mr-2 loading-spinner loading-md"></span>}
                        <span>Reset Password</span>
                    </button>
                </div>
                :
                <div className={`h-screen font-roboto text-center flex flex-col items-center justify-center space-y-4 -mt-24`}>
                    <AiFillExclamationCircle className='text-orange-400 text-9xl' />
                    <h1 className='text-black text-4xl md:text-5xl font-bold md:pb-4 lg:pb-0 xl:pb-4 lg:py-2'>Verifying Reset Token...</h1>
                </div>)}
        </>
    )
}

export default ResetPassword

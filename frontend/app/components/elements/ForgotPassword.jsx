'use client'
import React, { useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'

const ForgotPassword = () => {
    const [credentials, setCredentials] = useState({ email: '' })
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    const handleSend = async () => {
        if (credentials.email === '') {
            toast.error('Please fill all the details')
            return
        }
        try {
            setLoading(true)
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/send-reset-password-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: credentials.email })
            })
            const data = await response.json()
            if (response.status === 200) {
                toast.success(data.message)
            } else {
                toast.error(data.error)
            }
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Toaster />
            <div className="login md:w-1/2 px-3 py-5 mx-auto flex flex-col space-y-4 items-center justify-center">
                <h1 className={`font-bebas_neue text-6xl`} >SEND RESET PASSWORD LINK</h1>
                <input
                    className='w-full outline-none border border-[#4D7E86] px-4 py-2'
                    onChange={(e) => handleChange(e)}
                    value={credentials.email}
                    type="email"
                    name='email'
                    id='email'
                    placeholder='Email' />
                <button onClick={handleSend} className={`font-roboto w-full flex items-center justify-center py-2 bg-[#2C3E50] text-white`}>
                    {loading && <span className="loading mr-2 loading-spinner loading-md"></span>}
                    <span>Send Reset Link</span>
                </button>
            </div>
        </>
    )
}

export default ForgotPassword

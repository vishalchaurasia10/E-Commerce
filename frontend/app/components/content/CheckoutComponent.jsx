'use client'
import { roboto } from '@/app/utils/fonts'
import React, { useContext, useState } from 'react'
import authContext from '@/app/context/Auth/authContext'
import CartContext from '@/app/context/Cart/cartContext'
import { toast, Toaster } from 'react-hot-toast'

const CheckoutComponent = () => {

    const { user } = useContext(authContext)
    const { cart } = useContext(CartContext)
    const [localState, setLocalState] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        address: '',
        apartment: '',
        city: '',
        state: '',
        pinCode: '',
    })

    const autofill = () => {
        if (!user) {
            toast.error('Please login first')
            return
        }

        setLocalState({
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            phoneNumber: user?.phoneNumber || '',
            email: user?.email || '',
            address: user?.address || '',
            apartment: user?.apartment || '',
            city: user?.city || '',
            state: user?.state || '',
            pinCode: user?.pinCode || '',
        })
    }

    const checkoutHandler = async () => {
        try {
            const cartData = cart.map(item => ({
                productId: item.product._id,
                color: item.color,
                size: item.size,
                quantity: item.quantity,
            }));
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cart: cartData }),
            });
            if (res.ok) {
                const data = await res.json();
                console.log(data); // Log the response data
            } else {
                toast.error('Something went wrong');
            }
        } catch (err) {
            toast.error(err.message);
            console.log(err);
        }
    }

    return (
        <>
            <Toaster />
            <div className="checkoutWrapper flex flex-col items-center space-y-5 justify-center w-full px-2 md:px-20 lg:px-60">
                <div className="customerInfo w-full">
                    <h1 className={`${roboto.className} uppercase font-bold text-3xl text-[#4D7E86] pt-10 pb-5`}>Customer Information</h1>
                    <div className='flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 w-full'>
                        <input
                            className='lg:w-1/2 bg-[#F5F5F5] p-3 border border-black rounded-md outline-none'
                            placeholder='Email Address'
                            value={localState.email}
                            type="email"
                            name="email"
                            id="email" />
                        <input
                            className='lg:w-1/2 bg-[#F5F5F5] p-3 border border-black rounded-md outline-none'
                            placeholder='Phone Number'
                            value={localState.phoneNumber}
                            type="text"
                            name='phoneNumber'
                            id='phoneNumber' />
                    </div>
                </div>
                <div className="shippingInfo flex flex-col space-y-4 w-full">
                    <h1 className={`${roboto.className} uppercase font-bold text-3xl text-[#4D7E86] pt-6 pb-2`}>Shipping Address</h1>
                    <div className='flex space-x-4 w-full'>
                        <input
                            className='w-1/2 bg-[#F5F5F5] p-3 border border-black rounded-md outline-none'
                            placeholder='First Name'
                            value={localState.firstName}
                            type="text"
                            name='firstName'
                            id='firstName' />
                        <input
                            className='w-1/2 bg-[#F5F5F5] p-3 border border-black rounded-md outline-none'
                            placeholder='Last Name'
                            value={localState.lastName}
                            type="text"
                            name='lastName'
                            id='lastName' />
                    </div>
                    <div className='flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 w-full'>
                        <input
                            className='lg:w-1/2 bg-[#F5F5F5] p-3 border border-black rounded-md outline-none'
                            placeholder='Address'
                            value={localState.address}
                            type="text"
                            name='address'
                            id='address' />
                        <input
                            className='lg:w-1/2 bg-[#F5F5F5] p-3 border border-black rounded-md outline-none'
                            placeholder='Apartment, suite, etc. (optional)'
                            value={localState.apartment}
                            type="text"
                            name='apartment'
                            id='apartment' />
                    </div>
                    <div className='flex space-x-4 w-full'>
                        <input
                            className='w-1/2 bg-[#F5F5F5] p-3 border border-black rounded-md outline-none'
                            placeholder='City'
                            value={localState.city}
                            type="text"
                            name='city'
                            id='city' />
                        <input
                            className='w-1/2 bg-[#F5F5F5] p-3 border border-black rounded-md outline-none'
                            placeholder='State'
                            value={localState.state}
                            type="text"
                            name='state'
                            id='state' />
                        <input
                            className='w-1/2 bg-[#F5F5F5] p-3 border border-black rounded-md outline-none'
                            placeholder='Pin Code'
                            value={localState.pinCode}
                            type="text"
                            name='pinCode'
                            id='pinCode' />
                    </div>
                </div>
                <div className="buttons w-full flex space-x-2">
                    <button onClick={checkoutHandler} className={`px-10 py-2 bg-[#2C3E50] text-white flex items-center`}>Pay Now</button>
                    <button onClick={autofill} className={`px-10 py-2 bg-[#2C3E50] text-white flex items-center`}>Autofill</button>
                </div>
            </div>
        </>
    )
}

export default CheckoutComponent

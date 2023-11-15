'use client'
import { roboto } from '@/app/utils/fonts'
import React, { useContext, useEffect, useState } from 'react'
import authContext from '@/app/context/Auth/authContext'
import CartContext from '@/app/context/Cart/cartContext'
import { toast, Toaster } from 'react-hot-toast'
import Script from 'next/script'
import { useRouter } from 'next/navigation'

const CheckoutComponent = () => {

    const { user } = useContext(authContext)
    const { cart, clearCart } = useContext(CartContext)
    const router = useRouter()
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

    const onChangeHandler = (e) => {
        setLocalState({
            ...localState,
            [e.target.name]: e.target.value
        })
    }

    const checkoutHandler = async () => {
        if (!user) {
            toast.error('Please login first')
            return
        }
        if (cart.length === 0) {
            toast.error('Please add items to cart')
            return
        }
        if (!localState.firstName || !localState.lastName || !localState.phoneNumber || !localState.email || !localState.address || !localState.city || !localState.state || !localState.pinCode) {
            toast.error('Please fill all the fields')
            return
        }
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
                const orderData = await res.json();
                const options = {
                    "key": process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
                    "amount": orderData.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                    "currency": "INR",
                    "name": "Forever Trendin",
                    "description": "Test Transaction",
                    "image": "https://img1.wsimg.com/isteam/ip/f32f6f8b-4f61-4964-b9ab-cdadde45b2da/full%20logo.png/:/rs=w:200,h:200,cg:true,m/cr=w:200,h:200/qt=q:95",
                    "order_id": orderData.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                    "handler": async function (response) {
                        try {
                            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/callback`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    userId: user._id,
                                    cart: cartData,
                                    firstName: localState.firstName,
                                    lastName: localState.lastName,
                                    email: localState.email,
                                    paidAmount: orderData.amount,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_signature: response.razorpay_signature,
                                    address: `${localState.address}, ${localState.apartment}`,
                                    city: localState.city,
                                    state: localState.state,
                                    pinCode: localState.pinCode,
                                    phoneNumber: localState.phoneNumber,
                                }),
                            });
                            const data = await res.json();
                            if (data.status === 'Success') {
                                toast.success('Payment Successful')
                                clearCart()
                                router.push('/myorders')
                            } else {
                                toast.error('Something went wrong')
                            }
                        } catch (error) {
                            toast.error(error.message);
                            console.log(error.message)
                        }
                    },
                    "prefill": {
                        "name": user?.firstName + ' ' + user?.lastName,
                        "email": user?.email,
                        "contact": user?.phoneNumber
                    },
                    "notes": {
                        "address": user?.address + ' ' + user?.apartment + ' ' + user?.city + ' ' + user?.state + ' ' + user?.pinCode
                    },
                    "theme": {
                        "color": "#4D7E86"
                    }
                };
                const razor = new Razorpay(options);
                razor.on('payment.failed', function (response) {
                    alert(response.error.code);
                    alert(response.error.description);
                    alert(response.error.source);
                    alert(response.error.step);
                    alert(response.error.reason);
                    alert(response.error.metadata.order_id);
                    alert(response.error.metadata.payment_id);
                });
                razor.open();
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
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <div className="checkoutWrapper flex flex-col items-center space-y-5 justify-center w-full px-2 md:px-20 lg:px-60">
                <div className="customerInfo w-full">
                    <h1 className={`${roboto.className} uppercase font-bold text-3xl text-[#4D7E86] pt-10 pb-5`}>Customer Information</h1>
                    <div className='flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 w-full'>
                        <input
                            className='lg:w-1/2 bg-[#F5F5F5] p-3 border border-black rounded-md outline-none'
                            placeholder='Email Address'
                            value={localState.email}
                            onChange={onChangeHandler}
                            type="email"
                            name="email"
                            id="email" />
                        <input
                            className='lg:w-1/2 bg-[#F5F5F5] p-3 border border-black rounded-md outline-none'
                            placeholder='Phone Number'
                            value={localState.phoneNumber}
                            onChange={onChangeHandler}
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
                            onChange={onChangeHandler}
                            type="text"
                            name='firstName'
                            id='firstName' />
                        <input
                            className='w-1/2 bg-[#F5F5F5] p-3 border border-black rounded-md outline-none'
                            placeholder='Last Name'
                            value={localState.lastName}
                            onChange={onChangeHandler}
                            type="text"
                            name='lastName'
                            id='lastName' />
                    </div>
                    <div className='flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 w-full'>
                        <input
                            className='lg:w-1/2 bg-[#F5F5F5] p-3 border border-black rounded-md outline-none'
                            placeholder='Address'
                            value={localState.address}
                            onChange={onChangeHandler}
                            type="text"
                            name='address'
                            id='address' />
                        <input
                            className='lg:w-1/2 bg-[#F5F5F5] p-3 border border-black rounded-md outline-none'
                            placeholder='Apartment, suite, etc. (optional)'
                            value={localState.apartment}
                            onChange={onChangeHandler}
                            type="text"
                            name='apartment'
                            id='apartment' />
                    </div>
                    <div className='flex space-x-4 w-full'>
                        <input
                            className='w-1/2 bg-[#F5F5F5] p-3 border border-black rounded-md outline-none'
                            placeholder='City'
                            value={localState.city}
                            onChange={onChangeHandler}
                            type="text"
                            name='city'
                            id='city' />
                        <input
                            className='w-1/2 bg-[#F5F5F5] p-3 border border-black rounded-md outline-none'
                            placeholder='State'
                            value={localState.state}
                            onChange={onChangeHandler}
                            type="text"
                            name='state'
                            id='state' />
                        <input
                            className='w-1/2 bg-[#F5F5F5] p-3 border border-black rounded-md outline-none'
                            placeholder='Pin Code'
                            value={localState.pinCode}
                            onChange={onChangeHandler}
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

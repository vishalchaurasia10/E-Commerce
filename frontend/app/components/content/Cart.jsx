'use client'
import { bebas_neue, roboto } from '@/app/layout'
import React, { useContext, useEffect, useState } from 'react'
import CartContext from '@/app/context/Cart/cartContext'
import authContext from '@/app/context/Auth/authContext'
import Link from 'next/link'
import CartProducts from '../elements/CartProducts'
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast'

const Cart = () => {
    const { cart, discount, setDiscount } = useContext(CartContext)
    const { user } = useContext(authContext)
    const [loading, setLoading] = useState(true);
    const [promoCode, setPromoCode] = useState('')
    const [shippingPrice, setShippingPrice] = useState(0)

    const calculateTotalAmount = (cart) => {
        let totalAmount = 0;

        for (const item of cart) {
            const productPrice = item?.product?.price; // Assuming 'price' is the product's price property
            const quantity = item?.quantity;
            totalAmount += productPrice * quantity;
        }

        return totalAmount;
    };

    const getShippingPrice = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shipping/`)
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            setShippingPrice(data.price)
        } catch (err) {
            console.log(err)
            toast.error(err.message)
        }
    }

    const calculateDiscount = async () => {
        if (promoCode === '') return setDiscount({
            amount: 0,
            code: ''
        })
        if (!user) return toast.error('Please login to apply promo code')
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promocodes/calculate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    promoCode: promoCode,
                    cart: cart,
                    userId: user._id
                })
            })
            const data = await response.json()
            if (data.error) {
                toast.error(data.error)
                setDiscount({
                    amount: 0,
                    code: ''
                })
                return
            }
            toast.success(data.message)
            setDiscount({
                amount: data.discount,
                code: promoCode
            })
        } catch (error) {
            console.log(error.message)
            toast.error(error.message)
        }
    }

    const checkValidity = () => {
        if (!promoCode) {
            toast.error('Please enter a promo code')
            return
        }
        calculateDiscount()
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        getShippingPrice()
        calculateDiscount()
    }, [cart])

    return (
        <>
            <Toaster />
            {loading && (
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="h-screen fixed top-0 left-0 w-full z-50 bg-white flex items-center justify-center space-x-4"
                    >
                        <span className="loading loading-spinner loading-lg"></span>
                        <p className="font-bold text-xl">Loading...</p>
                    </motion.div>
                </AnimatePresence>
            )}
            {cart.length > 0 ?
                <div className="cartWrapper py-10">
                    <h1 className={`${bebas_neue.className} text-center text-5xl pb-7 lg:pb-10`}>My Cart</h1>
                    <div className="mainCart flex flex-col lg:flex-row lg:space-x-8 px-3 lg:px-40">
                        <div className="cartItems space-y-4 lg:w-3/4">
                            {
                                cart.map((item, index) => {
                                    return (
                                        <CartProducts key={index} item={item} />
                                    )
                                })
                            }
                        </div>
                        <div className='promoWrapper lg:w-[30%]'>
                            <div className={`billing px-6 py-5 pb-8 border-2 border-[rgba(207,207,207,0.25)] sticky top-24 ${roboto.className}`}>
                                <div className='mb-5'>
                                    <h1 className='font-bold text-lg mb-3'>Apply Promo Code</h1>
                                    <div className="promo flex relative">
                                        <input
                                            className='bg-[#F5F5F5] w-full pl-5 py-2 placeholder:text-black outline-none placeholder:text-sm'
                                            type="text"
                                            value={promoCode}
                                            name='promoCode'
                                            onChange={(e) => setPromoCode(e.target.value)}
                                            id='promoCode'
                                            placeholder='Apply Promo Code' />
                                        <button onClick={checkValidity} className='bg-[#4D7E86] absolute right-0 px-4 py-2 text-white'>Apply</button>
                                    </div>
                                </div>
                                <div className="amount space-y-1 mb-5">
                                    <h2 className='font-bold text-lg mb-2'>The Total Amount Of</h2>
                                    <div className='flex items-center justify-between'>
                                        <p>Temporary Amount:</p>
                                        <p>₹{calculateTotalAmount(cart)}</p>
                                    </div>
                                    <div className='flex items-center justify-between'>
                                        <p>Shipping: </p>
                                        <p>₹{shippingPrice}</p>
                                    </div>
                                    <div className='flex items-center justify-between'>
                                        <p>Discount: </p>
                                        <p>-₹{(discount.amount).toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="divider bg-[#4D7E86] h-[0.1rem]"></div>
                                <div className="totalAmount flex items-center justify-between mb-3">
                                    <p className='font-bold text-base'>Total Amount (incl VAT):</p>
                                    <p className='font-bold text-base'>₹{calculateTotalAmount(cart) + shippingPrice - (discount.amount).toFixed(2)}</p>
                                </div>
                                <div className="buttons flex flex-col space-y-3">
                                    <Link href='/checkout'>
                                        <button className='w-full bg-[#2C3E50] text-white py-2'>Checkout</button>
                                    </Link>
                                    <Link href='/collection'>
                                        <button className='w-full bg-[#4D7E86] text-white py-2'>Add More Product</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <div className=' flex flex-col items-center justify-center space-y-8 py-10 w-full' >
                    <p className={`message ${bebas_neue.className} text-5xl md:text-6xl`}>
                        Your Cart Is Empty
                    </p>
                    <button className='bg-[#2C3E50] py-2 px-6 text-white'>
                        <Link href='/collection'>
                            Shop Now
                        </Link>
                    </button>
                </div>
            }
        </>
    )
}

export default Cart

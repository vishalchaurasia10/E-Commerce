'use client'
import React, { useContext } from 'react'
import CartContext from '@/app/context/Cart/cartContext'
import Image from 'next/image'
import { FaCircleCheck } from "react-icons/fa6";

const CartNotification = () => {
    const { cartNotification } = useContext(CartContext)

    return (
        <>
            <div className={`notification ${cartNotification.visible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'} duration-300 transition-all fixed right-0 md:right-8 top-20 z-50 bg-white p-4 w-80 md:w-[22rem] space-y-4 shadow-2xl shadow-black border border-gray-300`}>
                <div className='flex space-x-4'>
                    <div className="image w-1/3 flex items-center justify-center">
                        <Image className='' src={cartNotification.message.imageLink} alt="cart" width={80} height={80} />
                    </div>
                    <div className="message w-3/4 font-roboto space-y-1">
                        <h3 className='font-bold'>{cartNotification.message.title}</h3>
                        <p className='text-sm'>Price: ₹{cartNotification.message.price}</p>
                        <p className='text-sm'>Quantity: {cartNotification.message.quantity}</p>
                    </div>
                </div>
                <div className="flex justify-end space-x-2 font-roboto text-sm items-center">
                    <span>Item Added To Cart</span>
                    <FaCircleCheck className='text-[#4D7E86] text-lg' />
                </div>
            </div>
        </>
    )
}

export default CartNotification

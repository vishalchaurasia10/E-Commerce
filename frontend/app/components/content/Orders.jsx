import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { FaCircleCheck, FaCirclePlus, FaClock } from "react-icons/fa6";

export function formatDate(inputDate) {
    const date = new Date(inputDate);

    const optionsDate = {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    };

    const optionsTime = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    };

    const formattedDate = new Intl.DateTimeFormat('en-US', optionsDate).format(date);
    const formattedTime = new Intl.DateTimeFormat('en-US', optionsTime).format(date);

    return `${formattedDate} | ${formattedTime.toLowerCase()}`;
}

const Orders = ({ user, setShowSidebar, showSidebar }) => {

    const [orders, setOrders] = useState([])

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                if (!user) return toast.error('Please sign in to view your orders')
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId: user._id })
                })
                const data = await response.json()
                setOrders(data)
                console.log(data)
            } catch (error) {
                toast.error(error.message)
                console.log(error.message)
            }
        }

        fetchOrders()
    }, [])

    return (
        <>
            <Toaster />
            <div className='h-full py-6 lg:py-10 px-3 lg:px-5 border border-[#4D7E86]'>
                <div className="hamburger pb-3 lg:hidden">
                    <svg onClick={() => setShowSidebar(!showSidebar)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block relative bg-white z-30 w-8 h-8 stroke-current lg:hidden"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </div>
                <div className="orderDetails mb-8">
                    <div className='flex items-center space-x-2 mb-6'>
                        <h1 className='font-bold text-2xl'>My Orders</h1>
                    </div>
                    {
                        orders.length > 0 ?
                            <>
                                {orders.map(order => {
                                    return (
                                        <React.Fragment key={order._id}>
                                            <div className="card lg:card-side bg-base-100 shadow-xl my-4 z-0">
                                                <div className="card-body">
                                                    <p><span className='font-bold'>OrderedAt:</span> {formatDate(order.createdAt)}</p>
                                                    <p className='flex items-center'>
                                                        <span className='font-bold'>Status: &nbsp;</span>
                                                        <span className='flex items-center space-x-1'>
                                                            {order.status === 'confirmed' && <FaClock className='text-orange-400' />}
                                                            {order.status === 'delivered' && <FaCircleCheck className='text-green-400' />}
                                                            {order.status === 'cancelled' && <FaCirclePlus className='text-red-500 rotate-45 text-lg' />}
                                                            <span>
                                                                {order.status}
                                                            </span>
                                                        </span>
                                                    </p>
                                                    <p><span className='font-bold'>OrderId:</span> {order.orderId}</p>
                                                    <p><span className='font-bold'>Shipping Address:</span> {order.address}</p>
                                                    <p><span className='font-bold'>Phone:</span> {order.phoneNumber}</p>
                                                    <Link href={`/myorders/${order._id}`}>
                                                        <button className='btn btn-neutral w-fit px-6'>
                                                            View
                                                        </button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    )
                                })}
                            </> :
                            <div>
                                <p className='text-center text-xl font-bold w-full my-5'>No orders found</p>
                            </div>
                    }
                </div>
            </div >
        </>
    )
}

export default Orders

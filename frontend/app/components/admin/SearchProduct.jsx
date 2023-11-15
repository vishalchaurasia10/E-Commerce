'use client'
import { bebas_neue, roboto } from '@/app/utils/fonts'
import React, { useEffect, useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { formatDate } from '../content/Orders'
import Image from 'next/image'

const SearchForProduct = () => {
    const [order, setOrder] = useState(null)
    const [orderId, setOrderId] = useState('')
    const [loading, setLoading] = useState(false)
    const [products, setProducts] = useState([]);

    const handleChange = (e) => {
        setOrderId(e.target.value)
    }

    const getOrder = async (orderId) => {
        try {
            setLoading(true)
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`)
            const data = await res.json()
            setOrder(data)
            if (data.error) throw new Error(data.error)
        } catch (err) {
            console.log(err)
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    const getProducts = async () => {
        const productDetails = order.products.map((product) => ({
            id: product._id,
            color: product.color,
            size: product.size,
        }));

        const uniqueProducts = [];
        const productSet = new Set();

        for (const details of productDetails) {
            const { id, color, size } = details;
            const productKey = `${id}-${color}-${size}`;

            try {
                if (productSet.has(productKey)) continue; // Skip if combination already added

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
                const data = await response.json();

                productSet.add(productKey);
                uniqueProducts.push(data);
            } catch (error) {
                console.log(error);
            }
        }

        setProducts(uniqueProducts);
    };

    useEffect(() => {
        if (order) {
            getProducts()
        }
    }, [order])

    return (
        <>
            <Toaster />
            <div className={`relative w-full flex items-center justify-center bg-[#607c84] mb-20`}>
                <div className="uploadContent relative z-20 w-full lg:mx-40 flex items-center justify-center space-x-8">
                    <div className='uploadForm w-full lg:w-1/2 mx-2 bg-[rgba(255,255,255,0.1)] text-white flex flex-col lg:flex-row space-y-8 lg:space-y-0 rounded-xl p-4 md:p-8 backdrop-blur-2xl shadow-2xl border-[rgba(255,255,255,0.1)]'>
                        <div className='uploadForm w-full bg-[rgba(255,255,255,0.1)] text-white flex flex-col rounded-xl space-y-8 p-8 backdrop-blur-2xl shadow-2xl border-[rgba(255,255,255,0.1)]'>
                            <h1 className={`${bebas_neue.className} font-bold text-6xl`}>Enter OrderID</h1>
                            <input
                                required
                                type='text'
                                placeholder='Order ID'
                                name='orderId'
                                id='orderId'
                                onChange={handleChange}
                                value={orderId}
                                className='outline-none placeholder:text-white bg-transparent border-b p-2 border-[rgba(255,255,255,0.5)]'
                            />
                            <button onClick={() => { if (orderId.trim().length > 0) getOrder(orderId) }} className="btn btn-active">Search</button>
                        </div>
                    </div>
                </div>
            </div>
            {loading ?
                <div className="w-full min-h-screen -mt-20 my-10 flex items-center justify-center">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
                :
                <div className={`profileWrapper ${roboto.className} bg-white flex lg:space-x-4 px-2 pt-4 lg:pt-0 lg:px-40`}>
                    <div className="profileContent mx-auto lg:w-3/4">
                        {products.length > 0 && order &&
                            <div className='h-full py-6 lg:py-10 px-3 lg:px-5 border border-[#4D7E86]'>
                                <div className="orderDetails mb-8">
                                    <div className='flex items-center space-x-2 mb-6'>
                                        <h1 className='font-bold text-2xl'>OrderId : {order.orderId}</h1>
                                    </div>
                                    <div className="description flex flex-col space-y-1 pb-10">
                                        <p className='text-sm'><span className='font-bold'>OrderedAt:</span> {formatDate(order.createdAt)}</p>
                                        <p><span className='font-bold'>Name:</span> {order.name}</p>
                                        <p><span className='font-bold'>Email:</span> {order.email}</p>
                                        <p><span className='font-bold'>Phone:</span> {order.phoneNumber}</p>
                                        <p><span className='font-bold'>Shipping Address:</span> {order.address}, {order.city}, {order.state}, {order.pinCode}</p>
                                        <p><span className='font-bold'>Amount Paid:</span> ₹{order.paidAmount / 100}</p>
                                    </div>
                                    {
                                        products.length > 0 && products.map((product, index) => {
                                            return (
                                                <React.Fragment key={index}>
                                                    <div className={`cartProduct ${roboto.className} flex flex-col md:flex-row`}>
                                                        <div className="image mb-4 lg:mb-0 md:mr-3 lg:mr-6 md:w-[35%]">
                                                            <Image className='rounded-lg w-full' src={`http://localhost:8000/uploads/products/${product?.imageId[0]}`} alt={product.title} width={200} height={200} />
                                                        </div>
                                                        <div className="details space-y-1 lg:mr-6 md:mr-3 md:w-[75%]">
                                                            <h1 className='font-bold text-2xl pb-1'>{product?.title}</h1>
                                                            <p className='font-bold lg:font-medium text-lg'>Price: ₹ {product?.price}</p>
                                                            <p className='font-bold lg:font-medium text-lg'>Size: {order.products[index]?.size}</p>
                                                            <div className='flex space-x-2 items-center'>
                                                                <p className='font-bold lg:font-medium text-lg'>Color:</p>
                                                                <button
                                                                    className={`rounded-full w-6 h-6 lg:mr-2 border border-black}`}
                                                                    style={{ backgroundColor: `#${order.products[index]?.color}` }}
                                                                ></button>
                                                            </div>
                                                        </div>
                                                        <div className="buttons border border-black flex items-center h-fit px-2 w-fit mt-5 lg:mt-0 lg:w-[15%]">
                                                            <p className='font-bold lg:font-medium text-lg whitespace-nowrap'>Quantity: {order.products[index]?.quantity}</p>
                                                        </div>
                                                    </div>
                                                    <div className="divider bg-[#4D7E86] h-[0.05rem]"></div>
                                                </React.Fragment>
                                            )
                                        })

                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>}
        </>
    )
}

export default SearchForProduct

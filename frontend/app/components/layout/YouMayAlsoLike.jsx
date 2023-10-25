'use client'
import React, { useContext, useEffect } from 'react'
import ProductContext from '@/app/context/Products/productContext'
import { bebas_neue, roboto } from '@/app/utils/fonts'
import Link from 'next/link'

const YouMayAlsoLike = () => {
    const { products, getAllProducts } = useContext(ProductContext)
    useEffect(() => {
        if (products.length === 0) {
            getAllProducts()
        }
    }, [])

    return (
        <>
            <div className='overflow-x-hidden lg:w-3/4 mx-auto px-2 py-5 lg:py-10'>
                <h2 className={`${bebas_neue.className} text-6xl w-full text-center py-4 `}>You may also like</h2>
                <div className="carousel carousel-end w-screen space-x-4 py-5">
                    {products.map((product, index) => (
                        <div
                            key={product._id}
                            id={`slide${index + 1}`}
                            className={`carousel-item w-60`}
                        >
                            <div className='flex flex-col space-y-1 border border-gray-400 border-opacity-25 shadow-lg shadow-gray-400'>
                                <img src={`http://localhost:8000/uploads/products/${product.imageId[0]}`} className="w-full h-full object-cover" alt={`Slide ${index + 1}`} />
                                <h3 className={`${roboto.className} px-4 pt-2 text-black font-medium`}>{product.title}</h3>
                                <p className={`${roboto.className} px-4 pb-3 text-black`}>₹{product.price}</p>
                            </div>
                        </div>
                    ))}
                    {products.map((product, index) => (
                        <div
                            key={product._id}
                            id={`slide${index + 1}`}
                            className={`carousel-item w-60`}
                        >
                            <div className='flex flex-col space-y-1 border border-gray-400 border-opacity-25 shadow-lg shadow-gray-400'>
                                <img src={`http://localhost:8000/uploads/products/${product.imageId[0]}`} className="w-full h-full object-cover" alt={`Slide ${index + 1}`} />
                                <h3 className={`${roboto.className} px-4 pt-2 text-black font-medium`}>{product.title}</h3>
                                <p className={`${roboto.className} px-4 pb-3 text-black`}>₹{product.price}</p>
                            </div>
                        </div>
                    ))}
                    {products.map((product, index) => (
                        <div
                            key={product._id}
                            id={`slide${index + 1}`}
                            className={`carousel-item w-60`}
                        >
                            <div className='flex flex-col space-y-1 border border-gray-400 border-opacity-25 shadow-lg shadow-gray-400'>
                                <img src={`http://localhost:8000/uploads/products/${product.imageId[0]}`} className="w-full h-full object-cover" alt={`Slide ${index + 1}`} />
                                <h3 className={`${roboto.className} px-4 pt-2 text-black font-medium`}>{product.title}</h3>
                                <p className={`${roboto.className} px-4 pb-3 text-black`}>₹{product.price}</p>
                            </div>
                        </div>
                    ))}
                    {products.map((product, index) => (
                        <div
                            key={product._id}
                            id={`slide${index + 1}`}
                            className={`carousel-item w-60`}
                        >
                            <div className='flex flex-col space-y-1 border border-gray-400 border-opacity-25 shadow-lg shadow-gray-400'>
                                <img src={`http://localhost:8000/uploads/products/${product.imageId[0]}`} className="w-full h-full object-cover" alt={`Slide ${index + 1}`} />
                                <h3 className={`${roboto.className} px-4 pt-2 text-black font-medium`}>{product.title}</h3>
                                <p className={`${roboto.className} px-4 pb-3 text-black`}>₹{product.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="button flex items-center justify-center py-5">
                    <button className='bg-[#2C3E50] py-2 px-8 text-white'>
                        <Link href='/collection'>
                            View All
                        </Link>
                    </button>
                </div>
            </div>
        </>
    )
}

export default YouMayAlsoLike

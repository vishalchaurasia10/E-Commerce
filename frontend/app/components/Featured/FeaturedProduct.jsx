'use client'
import { bebas_neue, roboto } from '@/app/utils/fonts'
import React, { useContext, useEffect } from 'react'
import FeaturedContext from '@/app/context/FeaturedProducts/featuredContext'
import Link from 'next/link'

const FeaturedProduct = () => {

    const { featuredProducts, getFeaturedProducts } = useContext(FeaturedContext)

    useEffect(() => {
        getFeaturedProducts()
        // eslint-disable-next-line
    }, [])

    return (
        <>
            <div className='overflow-x-hidden lg:w-3/4 mx-auto py-5 lg:py-10'>
                <h2 className={`${bebas_neue.className} text-6xl w-full text-center py-4 `}>Featured Product</h2>
                <div className="carousel carousel-end w-screen space-x-4 py-5">
                    {featuredProducts.map((product, index) => (
                        <Link href={`/collection/${product._id}`} key={product._id}>
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
                        </Link>
                    ))}
                </div>
                <div className="button flex items-center justify-center py-5">
                    <button className='bg-[#2C3E50] py-2 px-8 text-white'>View All</button>
                </div>
            </div>
        </>
    )
}

export default FeaturedProduct

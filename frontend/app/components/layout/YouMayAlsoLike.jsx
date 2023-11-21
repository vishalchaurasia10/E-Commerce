'use client'
import React, { useContext, useEffect } from 'react'
import ProductContext from '@/app/context/Products/productContext'
import { bebas_neue } from '@/app/layout'
import Link from 'next/link'
import ProductCard from './ProductCard'

const YouMayAlsoLike = () => {
    const { products, getAllProducts, loading } = useContext(ProductContext)
    useEffect(() => {
        if (products.length === 0) {
            getAllProducts()
        }
    }, [])

    return (
        <>
            <div className='overflow-x-hidden lg:w-3/4 mx-auto px-2 py-5 lg:py-10'>
                <h2 className={`${bebas_neue.className} text-6xl w-full text-center py-4 `}>You may also like</h2>
                {loading ?
                    <div className="w-full my-20 flex items-center justify-center">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                    :
                    <div className="carousel carousel-end w-full space-x-4 py-5">
                        {products.length > 0 && products.map((product, index) => (
                            <Link href={`/collection/${product._id}`} key={product._id}>
                                <ProductCard product={product} index={index} />
                            </Link>
                        ))}
                    </div>
                }
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

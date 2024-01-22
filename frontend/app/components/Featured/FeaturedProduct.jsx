'use client'
import React, { useContext, useEffect, useState } from 'react'
import FeaturedContext from '@/app/context/FeaturedProducts/featuredContext'
import Link from 'next/link'
import ProductCard from '../layout/ProductCard'

const FeaturedProduct = () => {

    const { getFeaturedProducts, loading } = useContext(FeaturedContext)
    const [featuredProducts, setFeaturedProducts] = useState([])

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            const data = await getFeaturedProducts(1)
            console.log(data)
            setFeaturedProducts(data.featuredProducts)
        }
        fetchFeaturedProducts()
    }, [])

    return (
        <>
            <div className='overflow-x-hidden lg:w-3/4 mx-auto py-5 lg:py-10'>
                <h2 className={`font-bebas_neue text-6xl w-full text-center py-4 `}>Featured Product</h2>
                {loading ?
                    <div className="w-full my-10 flex items-center justify-center">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                    :
                    <div className="carousel carousel-end w-full space-x-4 py-5">
                        {featuredProducts && featuredProducts.map((product, index) => (
                            <Link href={`/collection/${product._id}`} key={product._id}>
                                <ProductCard product={product} index={index} />
                            </Link>
                        ))}
                    </div>}
                <div className="button flex items-center justify-center py-5">
                    <Link href={`/featured`}>
                        <button className='bg-[#2C3E50] py-2 px-8 text-white'>View All</button>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default FeaturedProduct

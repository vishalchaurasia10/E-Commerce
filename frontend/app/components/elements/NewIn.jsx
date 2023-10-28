'use client'
import { bebas_neue, roboto } from '@/app/utils/fonts'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import ProductCard from '../layout/ProductCard'

const NewIn = ({ type }) => {

    const [products, setProducts] = useState([])

    useEffect(() => {
        const fetchProducts = async () => {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/products/type/${type}`
            const res = await fetch(url)
            const data = await res.json()
            if (res.status == 200)
                setProducts(data.products)
        }
        fetchProducts()
    }, [])

    useEffect(() => {
        console.log(products)
    }, [products])

    return (
        <>
            <div className='overflow-x-hidden lg:w-3/4 mx-auto py-5 lg:py-10'>
                <h2 className={`${bebas_neue.className} text-6xl w-full text-center py-4 `}>New In</h2>
                <div className="carousel carousel-end w-screen space-x-4 py-5">
                    {products.length > 0 && products.map((product, index) => (
                        <Link href={`/collection/${product._id}`} key={product._id}>
                            <ProductCard product={product} index={index} />
                        </Link>
                    ))}
                </div>
                <div className="button flex items-center justify-center py-5">
                    <button className='bg-[#2C3E50] py-2 px-8 text-white'>
                        <Link href={`/collection?type=${type}`}>
                            View All
                        </Link>
                    </button>
                </div>
            </div>
        </>
    )
}

export default NewIn

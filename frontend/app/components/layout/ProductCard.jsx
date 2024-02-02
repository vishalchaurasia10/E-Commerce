'use client'
import React, { useContext, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import CartContext from '@/app/context/Cart/cartContext'

const ProductCard = ({ product, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const { addToCart } = useContext(CartContext)
    const truncateStyle = {
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        WebkitLineClamp: 2, // Number of lines to show
    };

    const handleAddToCart = (product,selectedSize,quantity,selectedColor) => {
        console.log(product,selectedSize,quantity,selectedColor)
        addToCart(product, selectedSize, quantity, selectedColor)
    }

    return (
        <div
            key={product._id}
            id={`slide${index + 1}`}
            className={`carousel-item w-60`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className='flex flex-col w-full space-y-1 border border-gray-400 border-opacity-25 shadow-lg shadow-gray-400 relative'>
                <div className="image relative">
                    <Link href={`/collection/${product._id}`} key={product._id}>
                        <Image width={500} height={500} src={`${product.imageId[0]}`} className="w-full h-[16.5rem] object-cover z-10" alt={`Slide ${index + 1}`} loading='lazy' />
                    </Link>
                    <button className={`${isHovered ? 'translate-y-0' : 'translate-y-[2.8rem]'} absolute z-20 bottom-0 p-2 font-roboto w-full bg-[#4D7E86] text-white duration-300 transform transition-all`} onClick={() => handleAddToCart(product, product.size[0], 1, product.color.split(',')[0])}>
                        Add To Cart +
                    </button>
                </div>
                <Link href={`/collection/${product._id}`} key={product._id}>
                    <h3 className={`font-roboto px-4 pt-1 h-14 text-black bg-white font-bold z-30 relative`} style={truncateStyle}>{product.title}</h3>
                    <p className={`font-roboto px-4 pb-3 text-black bg-white z-30 relative`}>₹{product.price}</p>
                </Link>
            </div>
        </div>
    )
}

export default ProductCard
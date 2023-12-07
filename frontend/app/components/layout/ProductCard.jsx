import { roboto } from '@/app/layout'
import React from 'react'

const ProductCard = ({ product, index }) => {
    const truncateStyle = {
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        WebkitLineClamp: 2, // Number of lines to show
    };

    return (
        <div
            key={product._id}
            id={`slide${index + 1}`}
            className={`carousel-item w-60`}
        >
            <div className='flex flex-col w-full space-y-1 border border-gray-400 border-opacity-25 shadow-lg shadow-gray-400'>
                <img src={`${product.imageId[0]}`} className="w-full h-[16.5rem] object-cover" alt={`Slide ${index + 1}`} loading='lazy' />
                <h3 className={`${roboto.className} px-4 pt-2 h-14 text-black font-bold`} style={truncateStyle}>{product.title}</h3>
                <p className={`${roboto.className} px-4 pb-3 text-black`}>₹{product.price}</p>
            </div>
        </div>
    )
}

export default ProductCard
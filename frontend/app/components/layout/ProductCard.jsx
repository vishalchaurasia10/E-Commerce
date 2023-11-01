import { roboto } from '@/app/utils/fonts'
import React from 'react'

const ProductCard = ({ product, index }) => {
    return (
        <div
            key={product._id}
            id={`slide${index + 1}`}
            className={`carousel-item w-60`}
        >
            <div className='flex flex-col space-y-1 border border-gray-400 border-opacity-25 shadow-lg shadow-gray-400'>
                <img src={`http://localhost:8000/uploads/products/${product.imageId[0]}`} className="w-full h-[16.5rem] object-cover" alt={`Slide ${index + 1}`} />
                <h3 className={`${roboto.className} px-4 pt-2 text-black font-medium`}>{product.title}</h3>
                <p className={`${roboto.className} px-4 pb-3 text-black`}>₹{product.price}</p>
            </div>
        </div>
    )
}

export default ProductCard

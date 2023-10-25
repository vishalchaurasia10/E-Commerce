'use client'
import React, { useContext } from 'react'
import ProductContext from '@/app/context/Products/productContext'
import { bebas_neue, roboto } from '@/app/utils/fonts'

const Products = ({ localData }) => {
    const { products } = useContext(ProductContext)
    return (
        <>
            <div className=''>
                <h2 className={`text-lg ${roboto.className} w-full py-4 `}>{localData.length} Products</h2>
                <div className="flex flex-wrap py-5">
                    {localData.length > 0 ?
                        localData.map((product, index) => (
                            <div
                                key={product._id}
                                id={`slide${index + 1}`}
                                className={`w-72 h-[27rem] mr-4 mb-3`}
                            >
                                <div className='flex h-full flex-col space-y-1 border border-gray-400 border-opacity-25 shadow-lg shadow-gray-400'>
                                    <img src={`http://localhost:8000/uploads/products/${product.imageId[0]}`} className="w-full object-cover" alt={`Slide ${index + 1}`} />
                                    <h3 className={`${roboto.className} px-4 pt-2 text-black font-bold`}>{product.title}</h3>
                                    <p className={`${roboto.className} px-4 pb-3 text-black`}>₹{product.price}</p>
                                </div>
                            </div>
                        )) :
                        <div className='w-full'>
                            <h1 className='w-full text-center text-4xl font-bold'>No Products Found!</h1>
                        </div>
                    }
                </div>
                {/* <div className="button flex items-center justify-center py-5">
                    <button className='bg-[#2C3E50] py-2 px-8 text-white'>View All</button>
                </div> */}
            </div>
        </>
    )
}

export default Products

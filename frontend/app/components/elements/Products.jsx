'use client'
import React, { useContext } from 'react'
import ProductContext from '@/app/context/Products/productContext'
import { roboto } from '@/app/utils/fonts'
import Link from 'next/link'

const Products = ({ localData }) => {
    const { loading } = useContext(ProductContext)

    const truncateStyle = {
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        WebkitLineClamp: 2, // Number of lines to show
    };

    return (
        <>
            <div className=''>
                <h2 className={`text-lg ${roboto.className} w-full pt-4 lg:pt-0 lg:py-4 text-center lg:text-start `}>{(localData && localData.length) || 0} Products</h2>
                {loading ?
                    <div className="w-full my-20 flex items-center justify-center">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                    :
                    <div className="flex flex-wrap py-5 flex-col lg:flex-row items-center">
                        {localData && localData.length > 0 ?
                            localData.map((product, index) => (
                                <Link href={`/collection/${product._id}`} key={product._id}>
                                    <div
                                        key={product._id}
                                        id={`slide${index + 1}`}
                                        className={`w-72 h-[27rem] mr-4 mb-3`}
                                    >
                                        <div className='flex h-full flex-col space-y-1 border border-gray-400 border-opacity-25 shadow-lg shadow-gray-400'>
                                            <img src={`http://localhost:8000/uploads/products/${product.imageId[0]}`} className="w-full h-[20rem] object-cover" alt={`Slide ${index + 1}`} />
                                            <h3 className={`${roboto.className} px-4 pt-2 h-14 text-black font-bold`} style={truncateStyle}>{product.title}</h3>
                                            <p className={`${roboto.className} px-4 pb-3 text-black`}>₹{product.price}</p>
                                        </div>
                                    </div>
                                </Link>
                            )) :
                            <div className='w-full'>
                                <h1 className='w-full text-center text-4xl font-bold'>No Products Found!</h1>
                            </div>
                        }
                    </div>
                }
            </div>
        </>
    )
}

export default Products

'use client'
import { bebas_neue, jost, roboto } from '@/app/utils/fonts'
import React from 'react'
import { FiMinus, FiPlus } from 'react-icons/fi'

const ProductContent = ({ product }) => {
    return (
        <>
            <div className='flex flex-col space-y-3'>
                <p className={`${jost.className} pt-4 lg:pt-0`}>Forever Trendin</p>
                <h1 className={`${bebas_neue.className} text-5xl`}>{product.title}</h1>
                <p className={`${roboto.className} font-bold text-xl`}>₹ {product.price}</p>
                <div className="size space-y-2">
                    <p className={`${roboto.className} text-lg font-bold`}>Size</p>
                    <div className="buttons flex flex-wrap">
                        {
                            product.size.map((size, index) => (
                                <button className='border mr-4 mb-3 border-black px-4 py-1' key={index}>{size}</button>
                            ))
                        }
                    </div>
                </div>
                <div className="color">
                    <div className={`${roboto.className} text-lg font-bold`}>Color</div>
                    <div className={`border border-black rounded-full w-6 h-6`}></div>
                </div>
                <div className="quantity space-y-2">
                    <p className={`${roboto.className} text-lg font-bold`}>Quantity</p>
                    <div className="buttons border border-black w-fit flex items-center px-2">
                        <FiMinus className='cursor-pointer' />
                        <button className='px-3 py-1'>1</button>
                        <FiPlus className='cursor-pointer' />
                    </div>
                </div>
                <div className="buttons flex flex-col space-y-3">
                    <button className='bg-[#2C3E50] text-white py-3'>Add To Cart</button>
                    <button className='bg-[#4D7E86] text-white py-3'>Buy It Now</button>
                </div>
                <div className="otherDetails">
                    <ul className='list-disc pl-6 space-y-2 py-3'>
                        {
                            product.otherDetails.map((detail, index) => (
                                <li key={index}>{detail}</li>
                            ))
                        }
                    </ul>
                </div>
                <div className="description">
                    <p className={`${bebas_neue.className} text-3xl`}>Product Description</p>
                    <div className="line bg-black h-[0.1rem] mb-3"></div>
                    <p>{product.description}</p>
                </div>
            </div >
        </>
    )
}

export default ProductContent

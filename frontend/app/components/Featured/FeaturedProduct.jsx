import { bebas_neue } from '@/app/utils/fonts'
import React from 'react'
import Card from '../elements/Card'
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs'

const FeaturedProduct = () => {
    const details = [
        {
            url: '/assets/featured/featured01.svg',
            title: 'Slay Bear Lavender Oversized Back Print T-shirt',
            price: 549.00
        },
        {
            url: '/assets/featured/featured02.svg',
            title: 'Cosmic Dude Alien Space Adventure Oversized T-shirt',
            price: 549.00
        },
        {
            url: '/assets/featured/featured01.svg',
            title: 'Slay Bear Lavender Oversized Back Print T-shirt',
            price: 549.00
        },
        {
            url: '/assets/featured/featured02.svg',
            title: 'Cosmic Dude Alien Space Adventure Oversized T-shirt',
            price: 549.00
        },
    ]
    return (
        <div className='w-full flex flex-col items-center justify-center py-10 px-20'>
            <h1 className={`${bebas_neue.className} text-6xl py-10`}>Featured Products</h1>
            <div className="control flex items-center justify-end w-full space-x-2">
                <BsArrowLeft className='text-4xl rounded-full border border-black p-1' />
                <BsArrowRight className='text-4xl rounded-full border border-black p-1' />
            </div>
            <div className="slider flex items-center justify-center space-x-4 py-8">
                {details.map((detail, index) => {
                    return (
                        <Card detail={detail} index={index} />
                    )
                })}
            </div>
            <button className='bg-[#2C3E50] text-white py-2 px-4 my-2'>
                View All
            </button>
        </div>
    )
}

export default FeaturedProduct

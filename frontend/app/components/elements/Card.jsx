import { roboto } from '@/app/utils/fonts'
import Image from 'next/image'
import React from 'react'

const Card = ({ detail, index }) => {
    return (
        <div key={index} className='card shadow-md shadow-gray-400 overflow-hidden'>
            <Image className='bg-[#f0f5f6] min-w-max' src={detail.url} width={300} height={300} />
            <div className="details p-5 bg-white">
                <p className={`${roboto.className} font-bold text-lg`}>{detail.title}</p>
                <p>₹{detail.price}</p>
            </div>
        </div>
    )
}

export default Card

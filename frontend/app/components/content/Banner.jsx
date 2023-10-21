import Image from 'next/image'
import React from 'react'

const Banner = ({ url }) => {
    return (
        <div className='w-full'>
            <Image className='w-full' src={`/assets/${url}`} alt="banner" width={1920} height={500} />
        </div>
    )
}

export default Banner

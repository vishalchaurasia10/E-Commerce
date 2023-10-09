import { bebas_neue } from '@/app/utils/fonts'
import Image from 'next/image'
import React from 'react'

const Team = () => {
    return (
        <div className='teams py-10 flex-col space-y-5'>
            <div className="team flex flex-col lg:flex-row items-center justify-center lg:space-x-4 mx-2 lg:mx-40 bg-[#4D7E86] text-white">
                <Image className='lg:w-1/2' src='/assets/teams/team.svg' alt="team" width={500} height={500} />
                <div className="description lg:w-1/2 flex flex-col items-center justify-center space-y-4 py-10 lg:py-0 px-10 lg:px-20">
                    <h1 className={`${bebas_neue.className} text-6xl`}>Our team</h1>
                    <p className='text-center'>
                        The two people who were passionate about their work started designing new designs for t-shirts and bringing their designs live through this store. We welcome you to our Clothing and Apparel Store which contains Graphics T-shirts with Organic 100% cotton products.
                    </p>
                </div>
            </div>
            <div className="style flex flex-col lg:flex-row items-center justify-center lg:space-x-4 mx-2 lg:mx-40 bg-[#4D7E86] text-white">
                <Image className='lg:w-1/2 order-1 lg:order-2' src='/assets/teams/style.svg' alt="team" width={500} height={500} />
                <div className="description order-2 lg:order-1 lg:w-1/2 flex flex-col items-center justify-center space-y-4 py-10 lg:py-0 px-10 lg:px-20">
                    <h1 className={`${bebas_neue.className} text-6xl`}>Our Style</h1>
                    <p className='text-center'>
                        We love experimenting with our designs in evergreen t-shirts, oversized t-shirts, crop tops, and hoodies. As our trend keeps updating, we add more categories to our shop like t-shirt dresses, crop hoodies, and more coming up soon.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Team
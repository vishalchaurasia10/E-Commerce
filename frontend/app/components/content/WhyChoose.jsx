import { bebas_neue, roboto } from '@/app/layout'
import { whyChooseUsData } from '@/app/utils/constants'
import React from 'react'

const WhyChoose = () => {
    return (
        <div className='py-10 px-5'>
            <h1 className={`${bebas_neue.className} text-6xl w-full text-center py-5 lg:py-10`}>Why Choose Forever Trending ?</h1>
            <div className='flex flex-col md:flex-row justify-center items-center md:items-stretch space-y-4 md:space-y-0 md:space-x-4'>
                {whyChooseUsData.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className={`md:w-80 flex-col flex border border-gray-400 border-opacity-25 shadow-lg shadow-gray-400`}
                        >
                            <div className=' flex flex-col items-center justify-center'>
                                <img src={item.path} className="w-full h-full object-cover" alt={`Slide ${index + 1}`} />
                                <div className="detail py-5 space-y-1">
                                    <p className={`${roboto.className} px-5 text-black text-base`}>{item.description}</p>
                                    <p className={`${roboto.className} px-5 font-bold text-black text-base`}>{item.code}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default WhyChoose

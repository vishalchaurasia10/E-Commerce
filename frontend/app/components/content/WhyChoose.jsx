import { whyChooseUsData } from '@/app/utils/constants'
import React from 'react'
import Image from 'next/image'

const WhyChoose = () => {
    return (
        <div className='py-10 px-5'>
            <h1 className={`font-bebas_neue text-6xl w-full text-center py-5 lg:py-10`}>Why Choose Forever Trendin ?</h1>
            <div className='flex flex-col md:flex-row justify-center items-center md:items-stretch space-y-4 md:space-y-0 md:space-x-4'>
                {whyChooseUsData.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className={`md:w-80 flex-col flex border border-gray-400 border-opacity-25 shadow-lg shadow-gray-400`}
                        >
                            <div className=' flex flex-col items-center justify-center'>
                                <Image width={500} height={500} src={item.path} className="w-full h-full object-cover" alt={`Slide ${index + 1}`} />
                                <div className="detail py-5 space-y-1">
                                    <p className={`font-roboto px-5 text-black text-base text-justify`} dangerouslySetInnerHTML={{ __html: item.description }} />
                                    {item.code && <p className={`font-roboto px-5 font-bold text-black text-base`} dangerouslySetInnerHTML={{ __html: item.code }} />}
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
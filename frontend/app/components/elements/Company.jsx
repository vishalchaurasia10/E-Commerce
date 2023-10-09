import { companyUrls } from '@/app/utils/constants'
import Image from 'next/image'
import React from 'react'

const Company = () => {
    return (
        <div className='flex flex-wrap items-center justify-evenly md:space-x-4 px-2 lg:px-10 xl:px-40 py-10'>
            {
                companyUrls.map((url, index) => (
                    <div key={index}>
                        <Image className='w-40 lg:w-60 pb-4 mr-1 md:mr-0' src={url.path} alt={index} width={200} height={200} />
                    </div>
                ))
            }

        </div>
    )
}

export default Company

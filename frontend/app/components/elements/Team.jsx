import { teamData } from '@/app/utils/constants'
import Image from 'next/image'
import React from 'react'

const Team = () => {
    return (
        <div className='teams py-10 flex-col space-y-5'>
            <div className="team flex flex-col md:flex-row items-center justify-center md:space-x-2 lg:space-x-4 mx-2 md:mx-5 xl:mx-40 bg-[#4D7E86] text-white">
                <div className="md:w-1/2">
                    <Image src='/assets/teams/team.svg' alt="team" width={500} height={500} className="w-full h-full object-cover" />
                </div>
                <div className="description md:w-1/2 flex flex-col items-center justify-center space-y-4 py-10 md:py-0 px-10 lg:px-20">
                    <h1 className={`font-bebas_neue text-6xl`}>{teamData[0].heading}</h1>
                    <p className='text-justify'>
                        {teamData[0].description}
                    </p>
                </div>
            </div>
            <div className="team flex flex-col md:flex-row items-center justify-center md:space-x-2 lg:space-x-4 mx-2 md:mx-5 xl:mx-40 bg-[#4D7E86] text-white">
                <div className="md:w-1/2 order-1 md:order-2">
                    <Image src='/assets/teams/style.svg' alt="team" width={500} height={500} className="w-full h-full object-cover" loading='lazy' />
                </div>
                <div className="description order-2 md:order-1 md:w-1/2 flex flex-col items-center justify-center space-y-4 py-10 md:py-0 px-10 lg:px-20">
                    <h1 className={`font-bebas_neue text-6xl`}>{teamData[1].heading}</h1>
                    <p className='text-justify'>
                        {teamData[1].description}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Team

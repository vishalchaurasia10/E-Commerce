import { bebas_neue } from '@/app/utils/fonts'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaFacebook, FaInstagram, FaPinterest, FaTwitter } from 'react-icons/fa'

const Footer = () => {
    return (
        <div>
            <h1 className={`${bebas_neue.className} py-10 text-5xl lg:text-6xl text-center`}>Follow Us @forevertrendin</h1>
            <div className="images flex flex-wrap">
                {[1, 2, 3, 4, 5].map((item, index) => (
                    <img key={index} className={`${item === 5 ? 'hidden md:block' : ''} w-1/2 md:w-1/5`} src={`/assets/footer/${item}.png`} alt="" />
                ))}
            </div>
            <div className="links px-4 lg:px-20 flex flex-col lg:flex-row lg:items-center justify-center lg:space-x-10 space-y-4 lg:space-y-0 py-5">
                <Link href='/'>
                    <Image className='h-16 w-16' src="/assets/icon.svg" alt="logo" width={100} height={100} />
                </Link>
                <ul className='flex flex-col lg:flex-row lg:list-disc lg:space-x-8 space-y-2 lg:space-y-0  font-bold lg:font-medium'>
                    <li>Home</li>
                    <li>Collection</li>
                    <li>Terms And Conditions</li>
                    <li>Shipping and Tracking</li>
                    <li>
                        <Link href='/aboutus'>
                            About Us
                        </Link>
                    </li>
                </ul>
                <div className="icons flex lg:items-center lg:justify-center space-x-2 text-[#528289]">
                    <FaFacebook className='text-lg' />
                    <FaInstagram className='text-lg' />
                    <FaPinterest className='text-lg' />
                    <FaTwitter className='text-lg' />
                </div>
            </div>
            <div className="copyright bg-[#528289] w-full py-1 text-sm text-white text-center">
                COPYRIGHT © 2023 FOREVER TRENDIN - ALL RIGHTS RESERVED.
            </div>
        </div>
    )
}

export default Footer

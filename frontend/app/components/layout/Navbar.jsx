import { navbarData } from '@/app/utils/constants'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { BiSolidUser } from 'react-icons/bi'
import { PiShoppingCart } from 'react-icons/pi'
import { LuSearch } from 'react-icons/lu';

const Navbar = () => {
    return (
        <nav className='flex items-center justify-center w-full px-40 py-2'>
            <div className="left w-1/3 flex items-center justify-start space-x-8">
                {navbarData.map((item, index) => {
                    return (
                        <>
                            <Link key={index} href={item.path}>
                                {item.title}
                            </Link>
                        </>
                    )
                })}
            </div>
            <div className="center w-1/3 flex items-center justify-center">
                <Image className='h-14 w-14' src="/assets/icon.svg" alt="logo" width={100} height={100} />
            </div>
            <div className="right w-1/3 flex items-center justify-end space-x-6">
                <div className="input flex items-center justify-center">
                    <LuSearch className='text-2xl relative left-5 bottom-1' />
                    <input className='outline-none border-b-2 border-black placeholder:text-sm placeholder:text-black pl-7 pb-2' type="text" placeholder='Search' />
                </div>
                <BiSolidUser className='text-2xl font-bold' />
                <PiShoppingCart className='text-2xl' />
            </div>
        </nav>
    )
}

export default Navbar

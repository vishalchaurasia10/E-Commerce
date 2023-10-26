import { navbarData } from '@/app/utils/constants'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { BiSolidUser } from 'react-icons/bi'
import { PiShoppingCart } from 'react-icons/pi'
import { LuSearch } from 'react-icons/lu';
import { roboto } from '@/app/utils/fonts'

const Navbar = () => {

    return (
        <nav className='flex sticky top-0 bg-white z-50 left-0 items-center justify-center w-full lg:px-10 xl:px-20 px-4 py-2'>
            <div className="left w-1/3 hidden lg:flex items-center justify-start space-x-8">
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
            <div className="center w-1/4 lg:w-1/3 flex items-center justify-start lg:justify-center">
                <Link href='/'>
                    <Image className='h-14 w-14' src="/assets/icon.svg" alt="logo" width={100} height={100} />
                </Link>
            </div>
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle hidden" />
            <div className="right w-3/4 lg:w-1/3 flex items-center justify-end space-x-2 md:space-x-4 lg:space-x-6">
                <div className="flex items-center justify-center">
                    <LuSearch className='text-2xl relative left-5 bottom-1' />
                    <input className='outline-none w-32 md:w-auto border-b-2 border-black placeholder:text-sm placeholder:text-black pl-7 pb-2' type="text" placeholder='Search' />
                </div>
                <div className=' flex items-center space-x-2 xl:space-x-4'>
                    <Link href='/sign-in'>
                        <button className='px-3 py-1 bg-[#2C3E50] text-white whitespace-nowrap'>Sign In</button>
                    </Link>
                    {/* <BiSolidUser className='text-2xl font-bold' /> */}
                    <PiShoppingCart className='text-2xl' />
                </div>
                <label htmlFor="my-drawer-4" >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current lg:hidden"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </label>
            </div>
            <div className="drawer-side lg:hidden">
                <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu p-4 w-60 min-h-full bg-base-200 space-y-3 text-base-content px-8 py-10">
                    {navbarData.map((item, index) => {
                        return (
                            <>
                                <Link className={`${roboto.className} text-xl font-bold`} key={index} href={item.path}>
                                    {item.title}
                                </Link>
                            </>
                        )
                    })}
                </ul>
            </div>
        </nav>
    )
}

export default Navbar

'use client'
import { navbarData } from '@/app/utils/constants'
import Image from 'next/image'
import Link from 'next/link'
import React, { useContext, useState } from 'react'
import { PiShoppingCart } from 'react-icons/pi'
import { LuSearch } from 'react-icons/lu';
import { roboto } from '@/app/utils/fonts'
import authContext from '@/app/context/Auth/authContext'
import { FaUser } from 'react-icons/fa'
import CartContext from '@/app/context/Cart/cartContext'
import { AiOutlineArrowRight } from 'react-icons/ai'
import { useRouter, usePathname } from 'next/navigation'
import { ImCancelCircle } from 'react-icons/im'
import SearchContext from '@/app/context/search/searchContext'
import { toast, Toaster } from 'react-hot-toast'

const Navbar = () => {

    const { user } = useContext(authContext)
    const { cartCount } = useContext(CartContext)
    const { searchQuery, setSearchQuery } = useContext(SearchContext)
    const [showInput, setShowInput] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const handleSearchOpen = () => {
        setShowInput(true);
    };

    const handleSearchClose = () => {
        setShowInput(false);
        setSearchQuery('');
    };

    const handleSearch = () => {
        const searchInput = document.querySelector('input[name="searchQuery"]').value;
        if (searchInput === '' || searchInput.trim().length === 0) {
            toast.error('Please enter a valid search query');
        }
        setSearchQuery(searchInput);
        if (pathname === '/collection') {
            // Use smooth scrolling to scroll to the 'products' div
            const productsDiv = document.getElementById('products');
            if (productsDiv) {
                productsDiv.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            router.push(`/collection`);
        }
    };

    return (
        <>
            <Toaster />
            <nav className='flex sticky top-0 bg-white z-50 left-0 items-center justify-center w-full lg:px-10 xl:px-20 px-4 py-2'>
                <div className="left w-1/3 hidden lg:flex items-center justify-start space-x-8">
                    {navbarData.map((item, index) => {
                        return (
                            <React.Fragment key={index}>
                                <Link href={item.path}>
                                    {item.title}
                                </Link>
                            </React.Fragment>
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
                        {showInput ? (
                            <div className="relative flex items-center">
                                <input
                                    className="outline-none w-32 md:w-auto border-b-2 border-black placeholder:text-sm placeholder:text-black pl-2 pb-2"
                                    type="text"
                                    placeholder="Search"
                                    name='searchQuery'
                                />
                                <button className="absolute right-0 flex items-center space-x-1">
                                    <ImCancelCircle onClick={handleSearchClose} className='text-xl bottom-5 hover:scale-110 transition-all duration-300 bg-white' />
                                    <AiOutlineArrowRight onClick={handleSearch} className='text-2xl bottom-5 hover:scale-110 transition-all duration-300 bg-white' />
                                </button>
                            </div>
                        ) : (
                            <button onClick={handleSearchOpen} className="search-icon">
                                <LuSearch className="text-2xl" />
                            </button>
                        )}
                    </div>
                    <div className=' flex items-center space-x-2 xl:space-x-4'>
                        {user && user._id ?
                            <Link href='/profile'>
                                {user?.profileImageId ?
                                    <img className='rounded-full w-8 h-8' src={`${process.env.NEXT_PUBLIC_API_IMAGE_URL}/uploads/profiles/${user.profileImageId}`} alt="profileImage" height={200} width={200} loading='lazy' />
                                    :
                                    <FaUser className='border-2 border-[#4D7E86] text-[#4D7E86] rounded-full p-[0.15rem] text-3xl font-bold' />
                                }
                            </Link>
                            :
                            <Link href='/sign-in'>
                                <button className='px-3 py-1 bg-[#2C3E50] text-white whitespace-nowrap'>Sign In</button>
                            </Link>
                        }
                        <Link href='/cart' className='indicator'>
                            {cartCount > 0 && <span className="indicator-item badge badge-secondary bg-[#4D7E86] text-white border border-[#4D7E86]">{cartCount}</span>}
                            <PiShoppingCart className='text-2xl' />
                        </Link>
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
                                <React.Fragment key={index}>
                                    <Link className={`${roboto.className} text-xl font-bold`} href={item.path}>
                                        {item.title}
                                    </Link>
                                </React.Fragment>
                            )
                        })}
                    </ul>
                </div>
            </nav>
        </>
    )
}

export default Navbar

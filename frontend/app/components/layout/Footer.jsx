import { footerSocialLinks } from '@/app/utils/constants'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
    const footerLinks = [
        {
            title: 'Home',
            link: '/'
        },
        {
            title: 'Collection',
            link: '/collection'
        },
        {
            title: 'Terms And Conditions',
            link: '/termsandcondition'
        },
        {
            title: 'Shipping and Tracking',
            link: '/trackorder'
        },
        {
            title: 'About Us',
            link: '/aboutus'
        },
    ]
    return (
        <div>
            <h1 className={`font-bebas_neue py-10 text-5xl lg:text-6xl text-center`}>Follow Us @forevertrendin</h1>
            <div className="images flex flex-wrap">
                {[1, 2, 3, 4, 5].map((item, index) => (
                    <img
                        key={index}
                        className={`${item === 5 ? 'hidden md:block' : ''} ${item === 2 ? 'bg-[#C9F7FF]' : ''} w-1/2 md:w-1/5 h-[22rem] object-cover`}
                        src={`/assets/footer/${item}.png`}
                        alt={`image${index}`} />
                ))}
            </div>
            <div className="links px-4 lg:px-20 flex items-center lg:justify-center lg:space-x-12 space-y-4 lg:space-y-0 py-5">
                <Link className='order-2 lg:order-1 w-[40%] lg:w-auto flex items-center justify-center' href='/'>
                    <Image className='h-16 w-16' src="/assets/icon.svg" alt="logo" width={100} height={100} />
                </Link>
                <div className="linkWrapper w-[60%] lg:w-auto order-1 lg:order-2 flex flex-col space-y-4 lg:space-y-0 lg:space-x-12 lg:flex-row lg:items-center justify-center">
                    <ul className='flex flex-col lg:flex-row lg:list-disc lg:space-x-8 space-y-2 lg:space-y-0  font-bold lg:font-medium'>
                        {
                            footerLinks.map((item, index) => (
                                <li key={index}>
                                    <Link href={item.link}>
                                        {item.title}
                                    </Link>
                                </li>
                            ))
                        }
                    </ul>
                    <div className="icons flex lg:items-center lg:justify-center space-x-2 text-[#528289]">
                        {
                            footerSocialLinks.map((item, index) => {
                                return (
                                    <Link key={index} target='_blank' href={item.link}>
                                        {item.icon}
                                    </Link>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            <div className="copyright font-roboto tracking-wider bg-[#528289] w-full py-1 text-sm text-white text-center">
                COPYRIGHT © {new Date().getFullYear()} FOREVER TRENDIN - ALL RIGHTS RESERVED.
            </div>
        </div>
    )
}

export default Footer

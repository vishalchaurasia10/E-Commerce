import React from 'react'
import Banner from '../components/content/Banner'
import Team from '../components/elements/Team'
import WhyChoose from '../components/content/WhyChoose'

export const metadata = {
    metadataBase: new URL('https://forever-trendin.vercel.app/'),
    title: 'About Us | Forever Trendin',
    description: 'We are here to give you an awesome feeling with our designs and clothing style. Clothing and Apparel Store that wants you to try something new and evergreen. Find exclusive designs on our clothing online shop.',
    themeColor: '#4e7f88',
    alternates: {
        canonical: 'https://forever-trendin.vercel.app/',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Forever TrendIn',
        description: 'TWe are here to give you an awesome feeling with our designs and clothing style. Clothing and Apparel Store that wants you to try something new and evergreen. Find exclusive designs on our clothing online shop.',
        site: '@ForeverTrendin',
        creator: '@forevertrendin',
        images: ['https://img1.wsimg.com/isteam/stock/2751'],
    },
    verification: {
        google: 'bCk4fM26lCFui0qVponCBR4EnBU6FNoUGWI8QIeaeXs',
    },
    openGraph: {
        url: 'https://forever-trendin.vercel.app/',
        title: 'Forever TrendIn',
        description: 'We are here to give you an awesome feeling with our designs and clothing style. Clothing and Apparel Store that wants you to try something new and evergreen. Find exclusive designs on our clothing online shop.',
        images: [
            {
                url: 'https://img1.wsimg.com/isteam/stock/2751',
                width: 800,
                height: 600,
                alt: 'Forever TrendIn',
            },
        ],
        site_name: 'Forever TrendIn',
        type: 'website',
        locale: 'en_IN',
    },
}

const page = () => {
    return (
        <>
            <Banner url='bannerAboutus.png' />
            <Team />
            <WhyChoose />
        </>
    )
}

export default page

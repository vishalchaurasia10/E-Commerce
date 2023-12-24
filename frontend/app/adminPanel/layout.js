// import { bebas_neue } from 'next/font/google'

export const metadata = {
    metadataBase: new URL('https://forever-trendin.vercel.app/'),
    title: 'Admin Panel | Forever Trendin',
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

// export const bebas_neue = Bebas_Neue({
//     weight: ['400'],
//     subsets: ['latin'],
// })

export default function MyOrdersLayout({ children }) {
    return (
        <div>
            {children}
        </div>
    )
}
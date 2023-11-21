// import { bebas_neue } from 'next/font/google'

export const metadata = {
    title: 'Admin Panel | Forever Trendin',
    description: 'Forever Trendin is a fashion store that sells the latest fashion trends.',
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
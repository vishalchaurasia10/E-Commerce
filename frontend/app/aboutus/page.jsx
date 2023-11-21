import React from 'react'
import Banner from '../components/content/Banner'
import Team from '../components/elements/Team'
import WhyChoose from '../components/content/WhyChoose'

export const metadata = {
    title: 'About Us | Forever Trendin',
    description: 'Forever Trendin is a fashion store that sells the latest fashion trends.',
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

import React from 'react'
import Banner from '../components/content/Banner'
import Team from '../components/elements/Team'
import WhyChoose from '../components/content/WhyChoose'

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

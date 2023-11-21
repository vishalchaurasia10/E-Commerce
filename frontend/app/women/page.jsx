import React from 'react'
import Banner from '../components/content/Banner'
import Grid from '../components/elements/Grid'
import { womenData } from '../utils/constants'
import NewIn from '../components/elements/NewIn'

export const metadata = {
    title: 'Shop Women | Forever Trendin',
    description: 'Forever Trendin is a fashion store that sells the latest fashion trends.',
}

const page = () => {
    return (
        <>
            <Banner url='bannerWomen.png' />
            <Grid initialUrl='/assets/women/' data={womenData} />
            <NewIn type='women' />
        </>
    )
}

export default page

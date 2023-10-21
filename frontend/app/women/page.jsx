import React from 'react'
import Banner from '../components/content/Banner'
import Grid from '../components/elements/Grid'
import { womenData } from '../utils/constants'

const page = () => {
    return (
        <>
            <Banner url='bannerWomen.png' />
            <Grid initialUrl='/assets/women/' data={womenData} />
        </>
    )
}

export default page

import React from 'react'
import Banner from '../components/content/Banner'
import Grid from '../components/elements/Grid'
import { menData } from '../utils/constants'

const page = () => {
    return (
        <>
            <Banner url='bannerMen.png' />
            <Grid initialUrl='/assets/men/' data={menData} />
        </>
    )
}

export default page

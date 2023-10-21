import React from 'react'
import Banner from '../components/content/Banner'
import Grid from '../components/elements/Grid'
import { themesData } from '../utils/constants'

const page = () => {
    return (
        <>
            <Banner url='bannerTheme.png' />
            <Grid initialUrl='/assets/theme/' data={themesData} />
        </>
    )
}

export default page

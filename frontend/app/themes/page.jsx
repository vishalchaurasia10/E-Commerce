import React from 'react'
import Banner from '../components/content/Banner'
import Grid from '../components/elements/Grid'
import { themesData } from '../utils/constants'
import NewIn from '../components/elements/NewIn'

export const metadata = {
    title: 'Shop Themes | Forever Trendin',
    description: 'Forever Trendin is a fashion store that sells the latest fashion trends.',
  }

const page = () => {
    return (
        <>
            <Banner url='bannerTheme.png' />
            <Grid initialUrl='/assets/theme/' data={themesData} />
            <NewIn type='themes' />
        </>
    )
}

export default page

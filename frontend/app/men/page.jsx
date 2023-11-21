import React from 'react'
import Banner from '../components/content/Banner'
import Grid from '../components/elements/Grid'
import { menData } from '../utils/constants'
import NewIn from '../components/elements/NewIn'

export const metadata = {
    title: 'Shop Men | Forever Trendin',
    description: 'Forever Trendin is a fashion store that sells the latest fashion trends.',
  }

const page = () => {
    return (
        <>
            <Banner url='bannerMen.png' />
            <Grid initialUrl='/assets/men/' data={menData} />
            <NewIn type='men' />
        </>
    )
}

export default page

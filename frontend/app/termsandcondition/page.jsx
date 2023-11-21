import React from 'react'
import Accordian from '../components/layout/Accordian'
import WhyChoose from '../components/content/WhyChoose'

export const metadata = {
    title: 'Terms And Conditions | Forever Trendin',
    description: 'Forever Trendin is a fashion store that sells the latest fashion trends.',
  }

const page = () => {
    return (
        <>
            <Accordian />
            <WhyChoose />
        </>
    )
}

export default page

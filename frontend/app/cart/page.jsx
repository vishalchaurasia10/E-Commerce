import React from 'react'
import Cart from '../components/content/Cart'
import YouMayAlsoLike from '../components/layout/YouMayAlsoLike'

export const metadata = {
    title: 'Cart | Forever Trendin',
    description: 'Forever Trendin is a fashion store that sells the latest fashion trends.',
  }

const page = () => {
    return (
        <>
            <Cart />
            <YouMayAlsoLike />
        </>
    )
}

export default page

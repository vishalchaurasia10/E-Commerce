'use client'
import React, { useContext, useEffect, useState } from 'react'
import Banner from '../components/content/Banner'
import Filter from '../components/elements/Filter'
import Products from '../components/elements/Products'
import ProductContext from '../context/Products/productContext'

const page = () => {

    const { products, getAllProducts } = useContext(ProductContext)
    const [localProductsData, setLocalProductsData] = useState([])

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getAllProducts()
            setLocalProductsData(data)
        }
        fetchProducts()
    }, [])

    useEffect(() => {
        console.log(localProductsData)
    }, [localProductsData])

    return (
        <>
            <Banner url='bannerCollection.png' />
            <div className="collection flex py-5 lg:py-10">
                <div className=" w-[18%]">
                    <Filter localData={localProductsData} setLocalData={setLocalProductsData} />
                </div>
                <div className='w-[82%]'>
                <Products localData={localProductsData} />
                </div>
            </div>
        </>
    )
}

export default page

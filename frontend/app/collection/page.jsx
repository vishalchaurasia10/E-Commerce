'use client'
import React, { useContext, useEffect, useState } from 'react'
import Banner from '../components/content/Banner'
import Filter from '../components/elements/Filter'
import Products from '../components/elements/Products'
import ProductContext from '../context/Products/productContext'
import { getAllCategories } from '@/app/utils/apiFunctions/categoryFunctions'
import { useSearchParams } from 'next/navigation'

const page = () => {

    const { products, getAllProducts } = useContext(ProductContext)
    const [localProductsData, setLocalProductsData] = useState([])
    const [categories, setCategories] = useState([])
    const searchParams = useSearchParams()
    const categoryId = searchParams.get('categoryId')
    const type = searchParams.get('type')
    console.log(type)

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getAllProducts()
            setLocalProductsData(data)
            if (categoryId) {
                filterProducts(categoryId)
            }
        }
        fetchProducts()
    }, [])

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await getAllCategories()
            setCategories(data.categories)
        }
        fetchCategories()
    }, [])

    const filterProducts = (categoryId) => {
        const filteredProducts = products.filter((product) => product.category === categoryId);
        setLocalProductsData(filteredProducts); // Update the products state with filtered products
    };

    const getCategoriesFromType = (type) => {
        return categories.filter((category) => category.type === type)
    }

    useEffect(() => {
        if (type) {
            filterProductsByType(type)
        }
    }, [categories])

    const filterProductsByType = (type) => {
        const categories = getCategoriesFromType(type);
        const categoryIds = categories.map((category) => category._id); // Extract category IDs

        const filteredProducts = products.filter((product) => categoryIds.includes(product.category));
        setLocalProductsData(filteredProducts); // Update the products state with filtered products
    };

    return (
        <>
            <Banner url='bannerCollection.png' />
            <div className="collection flex py-5 lg:py-10">
                <div className=" w-[18%]">
                    <Filter
                        setLocalData={setLocalProductsData}
                        filterProducts={filterProducts}
                        filterProductsByType={filterProductsByType}
                        getCategoriesFromType={getCategoriesFromType}
                        categories={categories}
                    />
                </div>
                <div className='w-[82%]'>
                    <Products localData={localProductsData} />
                </div>
            </div>
        </>
    )
}

export default page

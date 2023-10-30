'use client'
import React, { useContext, useEffect, useState } from 'react'
import Banner from '../components/content/Banner'
import Filter from '../components/elements/Filter'
import Products from '../components/elements/Products'
import ProductContext from '../context/Products/productContext'
import { getAllCategories } from '@/app/utils/apiFunctions/categoryFunctions'
import { useSearchParams } from 'next/navigation'
import SearchContext from '../context/search/searchContext'

const page = () => {

    const { products, getAllProducts, searchProducts, searchProductsByType, searchProductsByCategory } = useContext(ProductContext)
    const [localProductsData, setLocalProductsData] = useState([])
    const [categories, setCategories] = useState([])
    const searchParams = useSearchParams()
    const categoryId = searchParams.get('categoryId')
    const type = searchParams.get('type')
    const { searchQuery } = useContext(SearchContext)

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getAllProducts()
            setLocalProductsData(data)
        }
        fetchProducts()
    }, [])

    useEffect(() => {
        const searchByCategory = async () => {
            const data = await searchProductsByCategory(categoryId)
            setLocalProductsData(data)
        }
        if (categoryId) {
            searchByCategory(categoryId)
        }
    }, [categoryId])

    useEffect(() => {
        const searchByType = async () => {
            const data = await searchProductsByType(type)
            setLocalProductsData(data.products)
        }
        if (type) {
            searchByType(type)
        }
    }, [type])

    useEffect(() => {
        if (searchQuery.trim().length === 0 && !categoryId && !type)
            setLocalProductsData(products)
    }, [products])

    useEffect(() => {
        const getSearchedProducts = async () => {
            const data = await searchProducts(searchQuery)
            setLocalProductsData(data)
        }
        if (searchQuery && searchQuery.trim().length > 0) {
            getSearchedProducts()
        } else {
            setLocalProductsData(products)
        }
    }, [searchQuery])

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

    const filterProductsByType = (type) => {
        const categories = getCategoriesFromType(type);
        const categoryIds = categories.map((category) => category._id); // Extract category IDs

        const filteredProducts = products.filter((product) => categoryIds.includes(product.category));
        setLocalProductsData(filteredProducts); // Update the products state with filtered products
    };

    return (
        <>
            <Banner url='bannerCollection.png' />
            <div id='products' className="collection flex flex-col lg:flex-row py-5 lg:py-10">
                <div className=" lg:w-[18%]">
                    <Filter
                        setLocalData={setLocalProductsData}
                        filterProducts={filterProducts}
                        filterProductsByType={filterProductsByType}
                        getCategoriesFromType={getCategoriesFromType}
                        categories={categories}
                    />
                </div>
                <div className='lg:w-[82%]'>
                    <Products localData={localProductsData} />
                </div>
            </div>
        </>
    )
}

export default page

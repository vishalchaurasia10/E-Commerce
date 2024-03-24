'use client'
import React, { useContext, useEffect, useState } from 'react'
import Banner from '../components/content/Banner'
import Filter from '../components/elements/Filter'
import Products from '../components/elements/Products'
import ProductContext from '../context/Products/productContext'
import { getAllCategoriesWithoutPagination } from '@/app/utils/apiFunctions/categoryFunctions'
import { useSearchParams } from 'next/navigation'
import SearchContext from '../context/search/searchContext'

const page = () => {

    const { searchProductsByPriceRange, searchProducts, searchProductsByType, searchProductsByCategory, getProductsWithPagination } = useContext(ProductContext)
    const [localProductsData, setLocalProductsData] = useState([])
    const [categories, setCategories] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [type, setType] = useState(null)
    const [categoryId, setCategoryId] = useState(null)
    const searchParams = useSearchParams()
    const paramCategoryId = searchParams.get('categoryId')
    const paramType = searchParams.get('type')
    const { searchQuery } = useContext(SearchContext)
    const [priceRange, setPriceRange] = useState({ min: 0, max: 0 })

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getProductsWithPagination(currentPage)
            if (data) {
                setLocalProductsData(data.products)
                setTotalPages(data.totalPages)
                setCurrentPage(data.currentPage)
            }
        }
        const searchByCategory = async () => {
            const data = await searchProductsByCategory(categoryId, currentPage)
            setLocalProductsData(data.products)
            setCurrentPage(data.currentPage)
            setTotalPages(data.totalPages)
        }
        const searchByType = async () => {
            const data = await searchProductsByType(type, currentPage)
            if (data) {
                setLocalProductsData(data.products)
                setCurrentPage(data.currentPage)
                setTotalPages(data.totalPages)
            }

        }
        const searchByRange = async () => {
            document.getElementById('category').checked = false
            console.log('searching by range')
            const data = await searchProductsByPriceRange(priceRange.min, priceRange.max, currentPage)
            setLocalProductsData(data.products)
            setCurrentPage(data.currentPage)
            setTotalPages(data.totalPages)
        }
        const getSearchedProducts = async () => {
            const data = await searchProducts(searchQuery)
            setLocalProductsData(data)
        }
        if (searchQuery && searchQuery.trim().length > 0) {
            getSearchedProducts()
        } else if (categoryId) {
            searchByCategory(categoryId, currentPage)
        } else if (type) {
            searchByType(type, currentPage)
        } else if (paramCategoryId) {
            searchByCategory(paramCategoryId, currentPage)
        } else if (paramType) {
            searchByType(paramType, currentPage)
        } else if (priceRange.min > 0 && priceRange.max > 0) {
            searchByRange()
        } else {
            fetchProducts()
        }
    }, [currentPage, categoryId, type, searchQuery])

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await getAllCategoriesWithoutPagination(currentPage)
            setCategories(data.categories)
        }
        fetchCategories()
    }, [])

    useEffect(() => {
        if (paramCategoryId) {
            setCategoryId(paramCategoryId)
        }
        if (paramType) {
            setType(paramType)
        }
    }, [paramCategoryId, paramType])

    const filterProducts = async (categoryId) => {
        setCategoryId(categoryId)
        const filteredProducts = await searchProductsByCategory(categoryId, currentPage)
        setLocalProductsData(filteredProducts.products); // Update the products state with filtered products
        setCurrentPage(filteredProducts.currentPage)
        setTotalPages(filteredProducts.totalPages)
    };

    const getCategoriesFromType = (type) => {
        if (categories && categories.length > 0)
            return categories.filter((category) => category.type === type)
    }

    const getAllProducts = async (currentPage) => {
        const data = await getProductsWithPagination(currentPage)
        if (data) {
            setLocalProductsData(data.products)
            setTotalPages(data.totalPages)
            setCurrentPage(data.currentPage)
        }
    }

    const filterProductsByType = async (type) => {
        setType(type)
        const filteredProducts = await searchProductsByType(type, currentPage)
        setLocalProductsData(filteredProducts.products); // Update the products state with filtered products
        setCurrentPage(filteredProducts.currentPage)
        setTotalPages(filteredProducts.totalPages)
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleSearchPriceRange = async (min, max) => {
        if (min === 0 && max === 0) {
            return
        }
        const data = await searchProductsByPriceRange(min, max, currentPage)
        setLocalProductsData(data.products)
        setCurrentPage(data.currentPage)
        setTotalPages(data.totalPages)
    }

    return (
        <>
            <Banner url='bannerCollection.png' />
            <div id='products' className="collection flex flex-col lg:flex-row py-5 lg:py-10">
                <div className=" lg:w-[18%]">
                    <Filter
                        getAllProducts={getAllProducts}
                        setLocalData={setLocalProductsData}
                        filterProducts={filterProducts}
                        filterProductsByType={filterProductsByType}
                        getCategoriesFromType={getCategoriesFromType}
                        categories={categories}
                        setPriceRange={setPriceRange}
                        priceRange={priceRange}
                        handleSearchPriceRange={handleSearchPriceRange}
                        setType={setType}
                        setCategoryId={setCategoryId}
                    />
                </div>
                <div className='lg:w-[82%] min-h-[35rem]'>
                    <Products localData={localProductsData} />
                </div>
            </div>
            <div className="join w-full flex justify-center mb-10">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="join-item btn">
                    «
                </button>
                <button className="join-item btn font-roboto">Page {currentPage}</button>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="join-item btn">
                    »
                </button>
            </div>
        </>
    )
}

export default page

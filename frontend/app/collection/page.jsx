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

    const { products, searchProducts, searchProductsByType, searchProductsByCategory, getProductsWithPagination } = useContext(ProductContext)
    const [localProductsData, setLocalProductsData] = useState([])
    const [categories, setCategories] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const searchParams = useSearchParams()
    const categoryId = searchParams.get('categoryId')
    const type = searchParams.get('type')
    const { searchQuery } = useContext(SearchContext)

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getProductsWithPagination(currentPage)
            setLocalProductsData(data.products)
            setTotalPages(data.totalPages)
        }
        const searchByCategory = async () => {
            const data = await searchProductsByCategory(categoryId)
            setLocalProductsData(data)
        }
        const searchByType = async () => {
            const data = await searchProductsByType(type)
            setLocalProductsData(data.products)
        }
        const getSearchedProducts = async () => {
            const data = await searchProducts(searchQuery)
            setLocalProductsData(data)
        }
        if (searchQuery && searchQuery.trim().length > 0) {
            getSearchedProducts()
        } else if (categoryId) {
            searchByCategory(categoryId)
        } else if (type) {
            searchByType(type)
        } else {
            fetchProducts()
        }
    }, [currentPage, categoryId, type, searchQuery])

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

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
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
                <div className='lg:w-[82%] min-h-[35rem]'>
                    <Products localData={localProductsData} />
                </div>
            </div>
            <div className="join w-full flex justify-center mb-10">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1} className="join-item btn">
                    Prev
                </button>
                <button onClick={() => setCurrentPage(1)} className="join-item btn">1</button>
                {totalPages > 1 && <button onClick={() => setCurrentPage(2)} className="join-item btn">2</button>}
                {totalPages > 1 && <button className="join-item btn btn-disabled">...</button>}
                {totalPages > 2 && <button onClick={() => setCurrentPage(totalPages - 1)} className="join-item btn">{totalPages - 1}</button>}
                {totalPages > 2 && <button onClick={() => setCurrentPage(totalPages)} className="join-item btn">{totalPages}</button>}
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="join-item btn">Next</button>
            </div>
        </>
    )
}

export default page

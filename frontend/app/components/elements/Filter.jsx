'use client'
import React, { useContext, useEffect, useState } from 'react'
import ProductContext from '@/app/context/Products/productContext'
import { getAllCategories } from '@/app/utils/apiFunctions/categoryFunctions'
import { roboto } from '@/app/utils/fonts'

const Filter = ({ localData, setLocalData }) => {
    const { products, setProducts } = useContext(ProductContext)
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null);

    const types = ['men', 'women', 'themes']

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await getAllCategories()
            setCategories(data.categories)
        }
        fetchCategories()
    }, [])

    const getCategoriesFromType = (type) => {
        return categories.filter((category) => category.type === type)
    }

    const filterProducts = (category) => {
        setSelectedCategory(category._id); // Set the selected category ID
        const filteredProducts = products.filter((product) => product.category === category._id);
        setLocalData(filteredProducts); // Update the products state with filtered products
    };

    const filterProductsByType = (type) => {
        const categories = getCategoriesFromType(type);
        const categoryIds = categories.map((category) => category._id); // Extract category IDs

        const filteredProducts = products.filter((product) => categoryIds.includes(product.category));
        setLocalData(filteredProducts); // Update the products state with filtered products
    };



    return (
        <>
            <div className="filter sticky top-24  left-4 border-2 border-gray-400 border-opacity-25 ml-4 mr-8 mt-4">
                <div className="collapse collapse-arrow">
                    <input type="checkbox" />
                    <div className="collapse-title text-lg font-medium">
                        Availability
                    </div>
                    <div className="collapse-content flex items-center space-x-2">
                        <input className='checkbox checkbox-[#607c84]' type="checkbox" name="stock" id="stock" />
                        <label className='text-lg' htmlFor="stock">In Stock</label>
                    </div>
                </div>
                <div className="divider mt-0 mb-0"></div>
                <div className="collapse collapse-arrow">
                    <input type="checkbox" />
                    <div className="collapse-title text-lg font-medium">
                        Price
                    </div>
                    <div className="collapse-content flex items-center space-x-2">
                        <input className='w-20 h-10 px-3 border-2 border-[#4D7E86]' type="number" name="min" id="min" />
                        <input className='w-20 h-10 px-3 border-2 border-[#4D7E86]' type="number" name="max" id="max" />
                    </div>
                </div>
                <div className="divider mt-0 mb-0"></div>
                <div className="collapse collapse-arrow">
                    <input type="checkbox" />
                    <div className="collapse-title text-lg font-medium">
                        Category
                    </div>
                    <div className="collapse-content flex flex-col">
                        <div>
                            <div onClick={() => setLocalData(products)} className="types flex space-x-4 py-1">
                                <h3 className={`${roboto.className} font-extrabold capitalize`}>All</h3>
                                <input className='radio h-4 w-4 ml-2 mt-2' type="radio" name="category" id="category" />
                            </div>
                            {
                                types.map((type, index) => {
                                    return (
                                        <div onClick={() => filterProductsByType(type)} key={index} className="types flex space-x-4 py-1">
                                            <h3 className={`${roboto.className} font-extrabold capitalize`}>{type}</h3>
                                            <input className='radio h-4 w-4 ml-2 mt-2' type="radio" name="category" id="category" />
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div>
                            {
                                types.map((type, index) => {
                                    return (
                                        <div key={index} className="types flex flex-col">
                                            <h3 className={`${roboto.className} font-extrabold capitalize`}>{type}</h3>
                                            {
                                                getCategoriesFromType(type).map((category) => (
                                                    <ul onClick={() => filterProducts(category)} className='list-disc pl-8 cursor-pointer' key={category._id}>
                                                        <li className='' htmlFor={category.title}>{category.title}
                                                            <input className='radio h-4 w-4 ml-2 mt-2' type="radio" name="category" id="category" />
                                                        </li>

                                                    </ul>
                                                ))
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Filter

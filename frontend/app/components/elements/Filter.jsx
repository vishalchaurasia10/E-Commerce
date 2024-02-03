'use client'
import React, { useContext } from 'react'
import ProductContext from '@/app/context/Products/productContext'

const Filter = ({ setType, setCategoryId, setPriceRange, priceRange, handleSearchPriceRange, filterProducts, filterProductsByType, getCategoriesFromType, getAllProducts }) => {
    const { products } = useContext(ProductContext)
    const types = ['men', 'women', 'themes']

    const handlePriceChange = (e) => {
        setPriceRange({ ...priceRange, [e.target.name]: e.target.value })
    }

    const handlePriceRangeClick = () => {
        handleSearchPriceRange(priceRange.min, priceRange.max)
        //remove the input values of type, category and search
        document.getElementById('category').checked = false
        setType(null)
        setCategoryId(null)
    }


    return (
        <>
            <div className="filter sticky top-24  left-4 border-2 border-gray-400 border-opacity-25 ml-4 mr-8 mt-4">
                {/* <div className="collapse collapse-arrow">
                    <input type="checkbox" />
                    <div className="collapse-title text-lg font-medium">
                        Availability
                    </div>
                    <div className="collapse-content flex items-center space-x-2">
                        <input className='checkbox checkbox-[#607c84]' type="checkbox" name="stock" id="stock" />
                        <label className='text-lg' htmlFor="stock">In Stock</label>
                    </div>
                </div>
                <div className="divider mt-0 mb-0"></div> */}
                <div className="collapse collapse-arrow">
                    <input type="checkbox" />
                    <div className="collapse-title text-lg font-medium">
                        Price
                    </div>
                    <div className="collapse-content space-y-2">
                        <div className="priceRange flex space-x-2">
                            <input
                                onChange={handlePriceChange}
                                className='w-20 h-10 px-3 border-2 border-[#4D7E86] outline-none'
                                placeholder='Min'
                                value={priceRange.min > 0 ? priceRange.min : ''}
                                type="number"
                                name="min"
                                id="min" />
                            <input
                                onChange={handlePriceChange}
                                className='w-20 h-10 px-3 border-2 border-[#4D7E86] outline-none'
                                placeholder='Max'
                                value={priceRange.max > 0 ? priceRange.max : ''}
                                type="number"
                                name="max"
                                id="max" />
                        </div>
                        <div className="buttons flex space-x-1">
                            <button onClick={handlePriceRangeClick} className='bg-[#2C3E50] py-2 px-8 text-white'>Apply</button>
                            <button onClick={() => { setPriceRange({ min: 0, max: 0 }); getAllProducts() }} className='bg-[#2C3E50] py-2 px-4 text-white'>Clear</button>
                        </div>
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
                            <div onClick={getAllProducts} className="types flex space-x-4 py-1">
                                <h3 className={`font-roboto font-extrabold capitalize`}>All</h3>
                                <input className='radio h-4 w-4 ml-2 mt-2' type="radio" name="category" id="category" />
                            </div>
                            {
                                types.map((type, index) => {
                                    return (
                                        <div onClick={() => filterProductsByType(type)} key={index} className="types flex space-x-4 py-1">
                                            <h3 className={`font-roboto font-extrabold capitalize`}>{type}</h3>
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
                                            <h3 className={`font-roboto font-extrabold capitalize`}>{type}</h3>
                                            {
                                                getCategoriesFromType(type) && getCategoriesFromType(type).map((category) => (
                                                    <ul onClick={() => filterProducts(category._id)} className='list-disc pl-8 cursor-pointer' key={category._id}>
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

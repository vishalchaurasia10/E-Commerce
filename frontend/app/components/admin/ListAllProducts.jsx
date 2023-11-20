'use client'
import { roboto } from '@/app/utils/fonts'
import React, { useEffect, useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { FaPen, FaTrash } from 'react-icons/fa'
import { FaCircleExclamation } from 'react-icons/fa6'

const ListAllProducts = ({ categoryOption }) => {
    const [localData, setLocalData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [totalPages, setTotalPages] = useState(0)
    const [deleteId, setDeleteId] = useState('')
    const [updateId, setUpdateId] = useState('')
    const [updateFields, setUpdateFields] = useState({
        title: '',
        category: '',
        price: '',
        featured: false,
        size: [],
        color: '',
        description: '',
        otherDetails: []
    })
    const sizes = ['Small', 'Medium', 'Large', 'XL', 'XXL'];

    const handleUpdateChange = (e) => {
        setUpdateFields({ ...updateFields, [e.target.name]: e.target.value })
    }

    const handleRadioChange = (e) => {
        setUpdateFields({
            ...updateFields,
            [e.target.name]: e.target.value === 'true' // Convert the string value to a boolean
        });
    }

    const handleSizeClick = (size) => {
        const updatedSizes = [...updateFields.size];

        if (updatedSizes.includes(size)) {
            // Remove the size if it's already selected
            updatedSizes.splice(updatedSizes.indexOf(size), 1);
        } else {
            // Add the size if it's not selected
            updatedSizes.push(size);
        }

        setUpdateFields({
            ...updateFields,
            size: updatedSizes,
        });
    };

    const getProductsWithPagination = async (page) => {
        try {
            setLoading(true)
            const url = `${process.env.NEXT_PUBLIC_API_URL}/products/page?page=${page}`
            const response = await fetch(url)
            const data = await response.json()
            setLocalData(data.products)
            setTotalPages(data.totalPages)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    useEffect(() => {
        getProductsWithPagination(currentPage)
    }, [currentPage])

    const truncateStyle = {
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        WebkitLineClamp: 2, // Number of lines to show
    };

    const handleDelete = async () => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/products/${deleteId}`
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await response.json()
            if (response.status === 200) {
                toast.success(data.message)
                setDeleteId('')
                getProductsWithPagination(currentPage)
            } else {
                toast.error(data.error)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    const handleUpdate = async () => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/products/${updateId}`
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateFields)
            })
            const data = await response.json()
            if (response.status === 200) {
                toast.success(data.message)
                setUpdateId('')
                getProductsWithPagination(currentPage)
            } else {
                toast.error(data.error)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    return (
        <>
            <Toaster />
            <div id='products' className="collection flex flex-col lg:flex-row py-5 lg:py-10">
                <div className=' min-h-[35rem]'>
                    <div className=''>
                        <h2 className={`text-lg ${roboto.className} w-full pt-4 lg:pt-0 lg:py-4 text-center text-xl font-bold`}>{(localData && localData.length) || 0} Products</h2>
                        {loading ?
                            <div className="w-full my-20 flex items-center justify-center">
                                <span className="loading loading-spinner loading-lg"></span>
                            </div>
                            :
                            <div className="flex flex-wrap justify-center py-5 flex-col lg:flex-row items-center">
                                {localData && localData.length > 0 ?
                                    localData.map((product, index) => (
                                        <React.Fragment key={product._id}>
                                            <div
                                                key={product._id}
                                                id={`slide${index + 1}`}
                                                className={`w-72 h-[27rem] mr-4 mb-3`}
                                            >
                                                <div className='relative flex h-full flex-col space-y-1 border border-gray-400 border-opacity-25 shadow-lg shadow-gray-400'>
                                                    <img src={`${process.env.NEXT_PUBLIC_API_IMAGE_URL}/uploads/products/${product.imageId[0]}`} className="w-full h-[20rem] object-cover" alt={`Slide ${index + 1}`} />
                                                    <h3 className={`${roboto.className} px-4 pt-2 h-14 text-black font-bold`} style={truncateStyle}>{product.title}</h3>
                                                    <p className={`${roboto.className} px-4 pb-3 text-black`}>₹{product.price}</p>
                                                    <FaPen
                                                        title='Update'
                                                        onClick={() => {
                                                            setUpdateId(product._id);
                                                            setUpdateFields({
                                                                title: product.title,
                                                                category: product.category,
                                                                price: product.price,
                                                                featured: product.featured,
                                                                size: product.size,
                                                                color: product.color,
                                                                description: product.description,
                                                                otherDetails: product.otherDetails
                                                            })
                                                            document.getElementById('updateModal').showModal()
                                                        }}
                                                        className="text-3xl text-gray-600 bg-white p-[0.38rem] rounded-md absolute right-10 top-2 hover:scale-110 transition-all duration-300 cursor-pointer" />
                                                    <FaTrash
                                                        onClick={() => {
                                                            setDeleteId(product._id);
                                                            document.getElementById('deleteModal').showModal()
                                                        }}
                                                        title='Delete'
                                                        className="text-3xl text-gray-600 bg-white p-[0.38rem] rounded-md absolute right-1 top-2 hover:scale-110 transition-all duration-300 cursor-pointer" />
                                                </div>
                                            </div>
                                            <dialog id="deleteModal" className="modal">
                                                <div className="modal-box">
                                                    <h3 className="font-bold text-lg flex items-center">
                                                        <FaCircleExclamation className="inline-block mr-2 text-2xl text-red-500" />
                                                        <span className='text-xl'>
                                                            Delete Product
                                                        </span>
                                                    </h3>
                                                    <p className="py-4">Are you sure, you want to delete this product?</p>
                                                    <div className="modal-action">
                                                        <form className='space-x-2' method="dialog">
                                                            <button onClick={handleDelete} className="btn btn-neutral">Delete</button>
                                                            <button onClick={() => setDeleteId('')} className="btn">Close</button>
                                                        </form>
                                                    </div>
                                                </div>
                                            </dialog>
                                            <dialog id="updateModal" className="modal">
                                                <div className="modal-box">
                                                    <h3 className="font-bold text-lg flex items-center">
                                                        <FaCircleExclamation className="inline-block mr-2 text-2xl text-yellow-500" />
                                                        <span className='text-xl'>
                                                            Update Product
                                                        </span>
                                                    </h3>
                                                    <div className="inputs flex flex-col pt-3 space-y-1">
                                                        <input
                                                            required
                                                            type="text"
                                                            placeholder='Enter Product Title'
                                                            name='title'
                                                            id='title'
                                                            onChange={handleUpdateChange}
                                                            value={updateFields.title}
                                                            className='outline-none bg-transparent border p-2 border-gray-500 rounded-lg'
                                                        />
                                                        <select
                                                            name='category'
                                                            id='category'
                                                            onChange={handleUpdateChange}
                                                            value={updateFields.category}
                                                            className="outline-none bg-transparent border p-2 border-gray-500 rounded-lg">
                                                            <option disabled value=''>Select the category</option>
                                                            {categoryOption.map((category) => {
                                                                return (
                                                                    <option className='text-black' key={category._id} value={category._id}>
                                                                        <span>{category.type} : </span>
                                                                        <span>{category.title}</span>
                                                                    </option>
                                                                )
                                                            })}
                                                        </select>
                                                        <div className="featured">
                                                            <div className="form-control">
                                                                <label className="label cursor-pointer">
                                                                    <span className="label-text">Featured Product</span>
                                                                    <input
                                                                        type="radio"
                                                                        name="featured"
                                                                        value='true'
                                                                        onChange={handleRadioChange}
                                                                        className="radio checked:bg-[#607c84]"
                                                                        checked={updateFields.featured === true} />
                                                                </label>
                                                            </div>
                                                            <div className="form-control">
                                                                <label className="label cursor-pointer">
                                                                    <span className="label-text">Not a Featured a Product</span>
                                                                    <input
                                                                        type="radio"
                                                                        name="featured"
                                                                        value='false'
                                                                        className="radio checked:bg-[#607c84]"
                                                                        onChange={handleRadioChange}
                                                                        checked={updateFields.featured === false} />
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="priceColor flex flex-wrap w-full">
                                                            <input
                                                                required
                                                                type="number"
                                                                placeholder='Enter Price'
                                                                name='price'
                                                                id='price'
                                                                onChange={handleUpdateChange}
                                                                value={updateFields.price}
                                                                className='outline-none bg-transparent border p-2 m-2 border-gray-500 rounded-lg'
                                                            />
                                                            <input
                                                                required
                                                                type="text"
                                                                placeholder='Enter Product Color'
                                                                name='color'
                                                                id='color'
                                                                onChange={handleUpdateChange}
                                                                value={updateFields.color}
                                                                className='outline-none bg-transparent border p-2 m-2 border-gray-500 rounded-lg'
                                                            />
                                                        </div>
                                                        <textarea
                                                            required
                                                            placeholder='Enter Product Description'
                                                            name='description'
                                                            id='description'
                                                            onChange={handleUpdateChange}
                                                            value={updateFields.description}
                                                            rows={3}
                                                            cols={10}
                                                            className='outline-none bg-transparent border p-2 border-gray-500 rounded-lg'
                                                        />
                                                        <div className="size flex flex-wrap items-center">
                                                            {sizes.map((size) => (
                                                                <button
                                                                    key={size}
                                                                    className={`btn rounded-3xl mr-4 mb-2 ${updateFields.size.includes(size) ? 'btn-neutral' : ' btn-active'}`}
                                                                    onClick={() => handleSizeClick(size)}
                                                                >
                                                                    {size}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="modal-action">
                                                        <form className='space-x-2' method="dialog">
                                                            <button onClick={handleUpdate} className="btn btn-neutral">Update</button>
                                                            <button onClick={() => setUpdateId('')} className="btn">Close</button>
                                                        </form>
                                                    </div>
                                                </div>
                                            </dialog>
                                        </React.Fragment>
                                    )) :
                                    <div className='w-full'>
                                        <h1 className='w-full text-center text-4xl font-bold'>No Products Found!</h1>
                                    </div>
                                }
                            </div>
                        }
                    </div>
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

export default ListAllProducts
'use client'
import { roboto } from '@/app/utils/fonts'
import React, { useEffect, useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { FaPen, FaTrash } from 'react-icons/fa'
import { FaCircleExclamation } from 'react-icons/fa6'

const ListAllProducts = () => {
    const [localData, setLocalData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [totalPages, setTotalPages] = useState(0)
    const [deleteId, setDeleteId] = useState('')

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
                                                    <img src={`http://localhost:8000/uploads/products/${product.imageId[0]}`} className="w-full h-[20rem] object-cover" alt={`Slide ${index + 1}`} />
                                                    <h3 className={`${roboto.className} px-4 pt-2 h-14 text-black font-bold`} style={truncateStyle}>{product.title}</h3>
                                                    <p className={`${roboto.className} px-4 pb-3 text-black`}>₹{product.price}</p>
                                                    <FaPen
                                                        title='Update'
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

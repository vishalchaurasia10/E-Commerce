'use client'
import { roboto } from '@/app/layout'
import React, { useEffect, useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { FaPen, FaTrash } from 'react-icons/fa'
import { FaCircleExclamation } from 'react-icons/fa6'
import { formatDate } from '../content/Orders'

const ListAllPromoCodes = () => {
    const [localData, setLocalData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [totalPages, setTotalPages] = useState(0)
    const [deleteId, setDeleteId] = useState('')
    const [updateId, setUpdateId] = useState('')
    const [updateFields, setUpdateFields] = useState({
        code: '',
        discountPercent: '',
        discountAmount: '',
        expiryDate: '',
        minimumAmount: '',
        maximumDiscount: '',
        times: ''
    })

    const handleUpdateChange = (e) => {
        setUpdateFields({ ...updateFields, [e.target.name]: e.target.value })
    }

    const getPromoCodesWithPagination = async (page) => {
        try {
            setLoading(true)
            const url = `${process.env.NEXT_PUBLIC_API_URL}/promocodes/page?page=${page}`
            const response = await fetch(url)
            const data = await response.json()
            setLocalData(data.promoCodes)
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
        getPromoCodesWithPagination(currentPage)
    }, [currentPage])

    const handleDelete = async () => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/promocodes/${deleteId}`
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
                getPromoCodesWithPagination(currentPage)
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
            const url = `${process.env.NEXT_PUBLIC_API_URL}/promocodes/${updateId}`
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
                setUpdateFields({
                    code: '',
                    discountPercent: '',
                    discountAmount: '',
                    expiryDate: '',
                    minimumAmount: '',
                    maximumDiscount: '',
                    times: ''
                })
                getPromoCodesWithPagination(currentPage)
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
            <div id='products' className="collection flex flex-col justify-center lg:flex-row py-5 lg:py-10">
                <div className=' min-h-[35rem]'>
                    <div className=''>
                        <h2 className={`text-lg ${roboto.className} text-white w-full pt-4 lg:pt-0 lg:py-4 text-center text-xl font-bold`}>{(localData && localData.length) || 0} PromoCodes</h2>
                        {loading ?
                            <div className="w-full my-20 flex items-center justify-center">
                                <span className="loading loading-spinner loading-lg"></span>
                            </div>
                            :
                            <div className="flex flex-wrap justify-center py-5 flex-col lg:flex-row items-center">
                                {localData && localData.length > 0 ?
                                    localData.map((promoCode, index) => (
                                        <React.Fragment key={promoCode?._id}>
                                            <div
                                                key={promoCode?._id}
                                                id={`slide${index + 1}`}
                                                className={`relative h-[27rem] mr-4 mb-3`}
                                            >
                                                <div className="card card-side bg-base-200 shadow-xl">
                                                    <div className="card-body">
                                                        <h2 className="card-title"><span>Code: </span><span className='underline'>{promoCode?.code}</span></h2>
                                                        {promoCode?.discountPercent ?
                                                            <p><span className='font-bold'>DiscountPercent : </span>{promoCode?.discountPercent}</p> :
                                                            <p><span className='font-bold'>DiscountAmount : </span>{promoCode?.discountAmount}</p>
                                                        }
                                                        <p><span className='font-bold'>Expiry Date: </span>{formatDate(promoCode?.expiryDate)}</p>
                                                        <p><span className='font-bold'>MinimumAmount: </span>{promoCode?.minimumAmount}</p>
                                                        <p><span className='font-bold'>MaximumDiscount: </span>{promoCode?.maximumDiscount}</p>
                                                        <p>No of times this code is applicable: <span className='font-bold'>{promoCode?.times}</span></p>
                                                    </div>
                                                </div>
                                                <FaPen
                                                    title='Update'
                                                    onClick={() => {
                                                        setUpdateId(promoCode?._id);
                                                        setUpdateFields({
                                                            code: promoCode?.code,
                                                            discountPercent: promoCode?.discountPercent,
                                                            discountAmount: promoCode?.discountAmount,
                                                            expiryDate: promoCode?.expiryDate,
                                                            minimumAmount: promoCode?.minimumAmount,
                                                            maximumDiscount: promoCode?.maximumDiscount,
                                                            times: promoCode?.times
                                                        })
                                                        document.getElementById('updateModal').showModal()
                                                    }}
                                                    className="text-3xl text-gray-600 bg-white p-[0.38rem] rounded-md absolute right-11 top-2 hover:scale-110 transition-all duration-300 cursor-pointer" />
                                                <FaTrash
                                                    onClick={() => {
                                                        setDeleteId(promoCode?._id);
                                                        document.getElementById('deleteModal').showModal()
                                                    }}
                                                    title='Delete'
                                                    className="text-3xl text-gray-600 bg-white p-[0.38rem] rounded-md absolute right-2 top-2 hover:scale-110 transition-all duration-300 cursor-pointer" />
                                            </div>
                                            <dialog id="deleteModal" className="modal">
                                                <div className="modal-box">
                                                    <h3 className="font-bold text-lg flex items-center">
                                                        <FaCircleExclamation className="inline-block mr-2 text-2xl text-red-500" />
                                                        <span className='text-xl'>
                                                            Delete PromoCode
                                                        </span>
                                                    </h3>
                                                    <p className="py-4">Are you sure, you want to delete this promoCode?</p>
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
                                                            Update PromoCode
                                                        </span>
                                                    </h3>
                                                    <div className="inputs flex flex-col pt-3 space-y-1">
                                                        <input
                                                            required
                                                            type='text'
                                                            placeholder='Enter PromoCode'
                                                            name='code'
                                                            id='code'
                                                            value={updateFields.code}
                                                            onChange={handleUpdateChange}
                                                            className='outline-none bg-transparent border p-2 border-gray-500 rounded-lg'
                                                        />
                                                        <input
                                                            required
                                                            type='number'
                                                            placeholder='Enter Discount Percent(Leave it blank if you want to enter discount amount)'
                                                            name='discountPercent'
                                                            id='discountPercent'
                                                            value={updateFields.discountPercent}
                                                            onChange={handleUpdateChange}
                                                            className='outline-none bg-transparent border p-2 border-gray-500 rounded-lg'
                                                        />
                                                        <input
                                                            required
                                                            type='number'
                                                            placeholder='Enter Discount Amount(Leave it blank if you want to enter discount percent)'
                                                            name='discountAmount'
                                                            id='discountAmount'
                                                            value={updateFields.discountAmount}
                                                            onChange={handleUpdateChange}
                                                            className='outline-none bg-transparent border p-2 border-gray-500 rounded-lg'
                                                        />
                                                        <input
                                                            required
                                                            type='date'
                                                            placeholder='Enter Expiry Date'
                                                            name='expiryDate'
                                                            id='expiryDate'
                                                            value={updateFields.expiryDate}
                                                            onChange={handleUpdateChange}
                                                            className='outline-none bg-transparent border p-2 border-gray-500 rounded-lg'
                                                        />
                                                        <input
                                                            required
                                                            type='number'
                                                            placeholder='Enter Minimum Amount'
                                                            name='minimumAmount'
                                                            id='minimumAmount'
                                                            value={updateFields.minimumAmount}
                                                            onChange={handleUpdateChange}
                                                            className='outline-none bg-transparent border p-2 border-gray-500 rounded-lg'
                                                        />
                                                        <input
                                                            required
                                                            type='number'
                                                            placeholder='Enter Maximum Discount'
                                                            name='maximumDiscount'
                                                            id='maximumDiscount'
                                                            value={updateFields.maximumDiscount}
                                                            onChange={handleUpdateChange}
                                                            className='outline-none bg-transparent border p-2 border-gray-500 rounded-lg'
                                                        />
                                                        <input
                                                            required
                                                            type='text'
                                                            placeholder='Enter number of times the promo code can be used(for unlimited type multiple otherwise type number)'
                                                            name='times'
                                                            id='times'
                                                            value={updateFields.times}
                                                            onChange={handleUpdateChange}
                                                            className='outline-none bg-transparent border p-2 border-gray-500 rounded-lg'
                                                        />
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
                                        <h1 className='w-full text-center text-4xl font-bold text-white'>No PromoCodes Found!</h1>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
            <div className="join mx-auto flex justify-center my-10 bg-white w-fit">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="join-item btn">
                    «
                </button>
                <button className="join-item btn">Page {currentPage}</button>
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

export default ListAllPromoCodes


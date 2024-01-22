'use client'
import React, { useEffect, useState } from 'react'
import { getAllCategories, getCategoryByType } from '@/app/utils/apiFunctions/categoryFunctions'
import { toast, Toaster } from 'react-hot-toast'
import Image from 'next/image'
import Link from 'next/link'

const page = () => {
    const [loading, setLoading] = useState(false)
    const [totalPages, setTotalPages] = useState(0)
    const [categoryType, setCategoryType] = useState('all')
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(1)
    const types = ['all', 'men', 'women', 'themes']

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    useEffect(() => {
        setLoading(true)
        if (categoryType === 'all') {
            getAllCategories(page).then(res => {
                setCategories(res.categories);
                setTotalPages(Math.ceil(res.count / 12))
                setLoading(false)
            }).catch(err => {
                toast.error(err.message);
                console.log(err);
                setLoading(false)
            });
        } else {
            getCategoryByType(categoryType, page).then(res => {
                setCategories(res.categories);
                setTotalPages(Math.ceil(res.count / 12))
                setLoading(false)
            }).catch(err => {
                toast.error(err.message);
                console.log(err);
                setLoading(false)
            });
        }
    }, [categoryType, page]);

    const handleCategoryTypeChange = (e) => {
        setCategoryType(e.target.value)
    }

    return (
        <>
            <Toaster />
            <h1 className='font-bebas_neue text-4xl text-center lg:text-6xl pt-5 mb-5'>Categories</h1>
            <div className="mainContainer min-h-[35rem] flex flex-col lg:flex-row lg:space-x-4 bg-white justify-center px-10">
                <div className="filter lg:w-[18%] border-2 border-gray-400 my-2 p-4 h-fit lg:sticky lg:top-20">
                    {
                        types.map((type, index) => {
                            return (
                                <div onClick={handleCategoryTypeChange} key={index} className="types flex space-x-4 py-1">
                                    <h3 className={`font-roboto font-extrabold capitalize`}>{type}</h3>
                                    <input className='radio h-4 w-4 ml-2 mt-2' type="radio" name="categoryType" id="categoryType" value={type} />
                                </div>
                            )
                        })
                    }
                </div>
                {
                    loading ?
                        <div className="w-full flex justify-center my-10 items-start">
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>
                        :
                        <div className="showCategories lg:w-[82%] flex flex-col flex-wrap bg-white">
                            <div className="categories flex px-10 flex-wrap">
                                {categories && categories.length > 0 && categories.map((category, index) => (
                                    <Link key={category._id} href={`/collection?categoryId=${category._id}`}>
                                        <div className="carousel-item m-2 w-60">
                                            <div
                                                id={`slide${index + 1}`}
                                                className={`carousel-item w-60`}
                                            >
                                                <div className='relative w-full flex flex-col border border-gray-400 border-opacity-25 shadow-lg shadow-gray-400'>
                                                    <Image height={500} width={500} src={`${category.coverImageId}`} className="w-full h-[18rem] object-cover" alt={`Slide ${index + 1}`} />
                                                    <h3 className={`text-black pl-4 pt-3`}><span className='font-bold'>Title: </span>{category.title}</h3>
                                                    <h3 className={`text-black pl-4 pb-3`}><span className='font-bold'>Type: </span> {category.type}</h3>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <div className="join w-full flex justify-center my-10">
                                <button
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 1}
                                    className="join-item btn">
                                    «
                                </button>
                                <button className="join-item btn">Page {page}</button>
                                <button
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page >= totalPages}
                                    className="join-item btn">
                                    »
                                </button>
                            </div>
                        </div>
                }
            </div>
        </>
    )
}

export default page

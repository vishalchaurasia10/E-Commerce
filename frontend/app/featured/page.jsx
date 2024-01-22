'use client'
import React, { useContext, useEffect, useState } from 'react'
import FeaturedContext from '../context/FeaturedProducts/featuredContext'
import Image from 'next/image'
import Link from 'next/link'

const page = () => {

    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [localData, setLocalData] = useState([])
    const { getFeaturedProducts, loading } = useContext(FeaturedContext)

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            const data = await getFeaturedProducts(currentPage)
            setLocalData(data.featuredProducts)
            setTotalPages(data.totalPages)
        }
        fetchFeaturedProducts()
    }, [currentPage])

    const truncateStyle = {
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        WebkitLineClamp: 2, // Number of lines to show
    };

    return (
        <>
            <h1 className='font-bebas_neue text-4xl text-center lg:text-6xl pt-5'>Featured Products</h1>
            <div id='products' className="collection lg:px-20 flex flex-col justify-center py-5 lg:py-5">
                <div className=' min-h-[35rem]'>
                    {loading ?
                        <div className="w-full my-20 flex items-center justify-center">
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>
                        :
                        <div className="flex flex-wrap px-5 py-5 flex-col lg:flex-row items-center">
                            {localData && localData.length > 0 ?
                                localData.map((product, index) => (
                                    <Link href={`/collection/${product._id}`} key={product._id}>
                                        <div
                                            key={product._id}
                                            id={`slide${index + 1}`}
                                            className={`w-72 h-[27rem] mr-4 mb-3`}
                                        >
                                            <div className='relative flex h-full flex-col space-y-1 border border-gray-400 border-opacity-25 shadow-lg shadow-gray-400'>
                                                <Image height={500} width={500} src={`${product.imageId[0]}`} className="w-full h-[20rem] object-cover" alt={`Slide ${index + 1}`} />
                                                <h3 className={`font-roboto px-4 pt-2 h-14 text-black font-bold`} style={truncateStyle}>{product.title}</h3>
                                                <p className={`font-roboto px-4 pb-3 text-black`}>₹{product.price}</p>
                                            </div>
                                        </div>
                                    </Link>
                                )) :
                                <div className='w-full'>
                                    <h1 className='w-full text-center text-4xl font-bold'>No Products Found!</h1>
                                </div>
                            }
                        </div>
                    }
                </div>
                <div className="join w-full flex justify-center mb-5">
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
            </div >
        </>
    )
}

export default page

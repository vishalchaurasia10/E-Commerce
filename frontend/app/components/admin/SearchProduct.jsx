'use client'
import { bebas_neue } from '@/app/utils/fonts'
import React, { useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import PreviewImages from '../layout/PreviewImages'
import ProductContent from '../content/ProductContent'

const SearchForProduct = () => {
    const [productId, setProductId] = useState('')
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setProductId(e.target.value)
    }

    const getProduct = async (productId) => {
        try {
            setLoading(true)
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`)
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            setData(data)
        } catch (err) {
            console.log(err)
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Toaster />
            <div className={`relative w-full flex items-center justify-center bg-[#607c84] mb-20`}>
                <div className="uploadContent relative z-20 w-full lg:mx-40 flex items-center justify-center space-x-8">
                    <div className='uploadForm w-full lg:w-1/2 mx-2 bg-[rgba(255,255,255,0.1)] text-white flex flex-col lg:flex-row space-y-8 lg:space-y-0 rounded-xl p-4 md:p-8 backdrop-blur-2xl shadow-2xl border-[rgba(255,255,255,0.1)]'>
                        <div className='uploadForm w-full bg-[rgba(255,255,255,0.1)] text-white flex flex-col rounded-xl space-y-8 p-8 backdrop-blur-2xl shadow-2xl border-[rgba(255,255,255,0.1)]'>
                            <h1 className={`${bebas_neue.className} font-bold text-6xl`}>Enter ProductID</h1>
                            <input
                                required
                                type='text'
                                placeholder='Product ID'
                                name='productId'
                                id='productId'
                                onChange={handleChange}
                                value={productId}
                                className='outline-none placeholder:text-white bg-transparent border-b p-2 border-[rgba(255,255,255,0.5)]'
                            />
                            <button onClick={() => getProduct(productId)} className="btn btn-active">Search</button>
                        </div>
                    </div>
                </div>
            </div>
            {loading ?
                <div className="w-full my-20 flex items-center justify-center">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
                :
                data && !data.error && <div className="productWrapper flex flex-col lg:flex-row px-4 lg:px-40 lg:space-x-5 py-2 bg-white py-20">
                    <div className="images lg:w-[38%]">
                        <PreviewImages imageId={data?.imageId} />
                    </div>
                    <div className="content lg:w-[60%]">
                        <ProductContent product={data} />
                    </div>
                </div>
            }
        </>
    )
}

export default SearchForProduct

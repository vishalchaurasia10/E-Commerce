'use client'
import ProductContent from '@/app/components/content/ProductContent'
import PreviewImages from '@/app/components/layout/PreviewImages'
import YouMayAlsoLike from '@/app/components/layout/YouMayAlsoLike'
import React, { useEffect, useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'

const page = ({ params }) => {

    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getProduct = async () => {
            try {
                setLoading(true)
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${params.productId}`)
                const data = await res.json()
                setProduct(data)
                if (data.error) throw new Error(data.error)
            } catch (err) {
                console.log(err)
                toast.error(err.message)
            } finally {
                setLoading(false)
            }
        }
        getProduct()
    }, [])

    return (
        <>
            <Toaster />
            {loading ?
                <div className="w-full my-20 flex items-center justify-center">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
                :
                product && !product.error && <div className="productWrapper flex flex-col lg:flex-row px-4 lg:px-40 lg:space-x-5 py-2">
                    <div className="images lg:w-[38%]">
                        <PreviewImages imageId={product?.imageId} />
                    </div>
                    <div className="content lg:w-[60%]">
                        <ProductContent product={product} />
                    </div>
                </div>
            }
            <YouMayAlsoLike />
        </>
    )
}

export default page

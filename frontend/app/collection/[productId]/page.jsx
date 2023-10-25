'use client'
import ProductContent from '@/app/components/content/ProductContent'
import Loading from '@/app/components/layout/Loading'
import PreviewImages from '@/app/components/layout/PreviewImages'
import YouMayAlsoLike from '@/app/components/layout/YouMayAlsoLike'
import React, { useEffect, useState } from 'react'

const page = ({ params }) => {

    const [product, setProduct] = useState(null)

    useEffect(() => {
        const getProduct = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${params.productId}`)
            const data = await res.json()
            setProduct(data)
        }
        getProduct()
    }, [])

    useEffect(() => {
        console.log(product)
    }, [product])

    return (
        <>
            {product ?
                <div className="productWrapper flex flex-col lg:flex-row px-4 lg:px-40 lg:space-x-5 py-2">
                    <div className="images lg:w-[38%]">
                        <PreviewImages imageId={product?.imageId} />
                    </div>
                    <div className="content lg:w-[60%]">
                        <ProductContent product={product} />
                    </div>
                </div> :
                <Loading />
            }
            <YouMayAlsoLike />
        </>
    )
}

export default page

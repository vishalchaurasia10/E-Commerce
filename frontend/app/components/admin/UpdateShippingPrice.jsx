'use client'
import React, { useEffect, useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'

const UpdateShippingPrice = () => {
    const [price, setPrice] = useState('')
    const [showPrice, setShowPrice] = useState(0)

    const handleUpdatePrice = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shipping/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ price })
            })
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            setShowPrice(data.price)
            setPrice('')
            toast.success("Price updated successfully")
        } catch (err) {
            console.log(err)
            toast.error(err.message)
        }
    }

    const getShippingPrice = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shipping/`)
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            setShowPrice(data.price)
        } catch (err) {
            console.log(err)
            toast.error(err.message)
        }
    }

    useEffect(() => {
        getShippingPrice()
    }, [])

    return (
        <>
            <Toaster />
            <div className={`relative w-full flex items-center justify-center bg-[#607c84] mb-20`}>
                <div className="uploadContent relative z-20 w-full lg:mx-40 flex items-center justify-center space-x-8">
                    <div className='uploadForm w-full lg:w-1/2 mx-2 bg-[rgba(255,255,255,0.1)] text-white flex flex-col lg:flex-row space-y-8 lg:space-y-0 rounded-xl p-4 md:p-8 backdrop-blur-2xl shadow-2xl border-[rgba(255,255,255,0.1)]'>
                        <div className='uploadForm w-full bg-[rgba(255,255,255,0.1)] text-white flex flex-col rounded-xl space-y-8 p-8 backdrop-blur-2xl shadow-2xl border-[rgba(255,255,255,0.1)]'>
                            <h1 className={`font-bebas_neue text-6xl`}>Update Shipping Price</h1>
                            <p>Current shipping price is <span className='font-bold text-lg underline'>{showPrice}</span></p>
                            <input
                                required
                                type='number'
                                placeholder='Enter new shipping price'
                                name='price'
                                id='price'
                                onChange={(e) => setPrice(e.target.value)}
                                value={price}
                                className='outline-none placeholder:text-white bg-transparent border-b p-2 border-[rgba(255,255,255,0.5)]'
                            />
                            <button onClick={handleUpdatePrice} className="btn btn-active">Update</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UpdateShippingPrice

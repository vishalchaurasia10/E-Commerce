'use client'
import { bebas_neue } from '@/app/utils/fonts'
import React, { useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'

const UploadPromoCode = () => {
    const [promoCode, setPromoCode] = useState({
        code: '',
        discountPercent: '',
        discountAmount: '',
        expiryDate: '',
        minimumAmount: '',
        maximumDiscount: '',
        times: ''
    })

    const handleChange = (e) => {
        setPromoCode({ ...promoCode, [e.target.name]: e.target.value })
    }

    const checkValidity = () => {
        if (promoCode.code === '') {
            toast.error('Please enter a valid PromoCode')
            return false
        }
        if (promoCode.discountPercent === '' && promoCode.discountAmount === '') {
            toast.error('Please enter a valid discount')
            return false
        }
        if (promoCode.expiryDate === '') {
            toast.error('Please enter a valid expiry date')
            return false
        }
        if (promoCode.minimumAmount === '') {
            toast.error('Please enter a valid minimum amount')
            return false
        }
        if (promoCode.maximumDiscount === '') {
            toast.error('Please enter a valid maximum discount')
            return false
        }
        if (promoCode.times === '') {
            toast.error('Please enter a valid number of times the promo code can be used')
            return false
        }
        uploadPromoCode()
    }

    const uploadPromoCode = async () => {
        try {
            console.log(promoCode)
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/promoCodes/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(promoCode),
            })
            const data = await res.json()
            if (data.error) throw new Error(data.error)
            toast.success('PromoCode uploaded successfully')
            setPromoCode({
                code: '',
                discountPercent: '',
                discountAmount: '',
                expiryDate: '',
                minimumAmount: '',
                maximumDiscount: '',
                times: ''
            })
        } catch (err) {
            console.log(err)
            toast.error(err.message)
        }
    }

    return (
        <>
            <Toaster />
            <div className={`relative w-full flex items-center justify-center bg-[#607c84] mb-20`}>
                <div className="uploadPromoCode relative z-20 w-full lg:mx-40 flex items-center justify-center space-x-8">
                    <div className='uploadForm w-full lg:w-3/4 mx-2 bg-[rgba(255,255,255,0.1)] text-white flex flex-col lg:flex-row space-y-8 lg:space-y-0 rounded-xl p-4 md:p-8 backdrop-blur-2xl shadow-2xl border-[rgba(255,255,255,0.1)]'>
                        <div className='uploadForm w-full bg-[rgba(255,255,255,0.1)] text-white flex flex-col rounded-xl space-y-8 p-8 backdrop-blur-2xl shadow-2xl border-[rgba(255,255,255,0.1)]'>
                            <h1 className={`${bebas_neue.className} font-bold text-6xl`}>Enter PromoCode Details</h1>
                            <input
                                required
                                type='text'
                                placeholder='Enter PromoCode'
                                name='code'
                                id='code'
                                onChange={handleChange}
                                value={promoCode.code}
                                className='outline-none placeholder:text-white bg-transparent border-b p-2 border-[rgba(255,255,255,0.5)]'
                            />
                            <input
                                required
                                type='number'
                                placeholder='Enter Discount Percent(Leave it blank if you want to enter discount amount)'
                                name='discountPercent'
                                id='discountPercent'
                                onChange={handleChange}
                                value={promoCode.discountPercent}
                                className='outline-none placeholder:text-white bg-transparent border-b p-2 border-[rgba(255,255,255,0.5)]'
                            />
                            <input
                                required
                                type='number'
                                placeholder='Enter Discount Amount(Leave it blank if you want to enter discount percent)'
                                name='discountAmount'
                                id='discountAmount'
                                onChange={handleChange}
                                value={promoCode.discountAmount}
                                className='outline-none placeholder:text-white bg-transparent border-b p-2 border-[rgba(255,255,255,0.5)]'
                            />
                            <input
                                required
                                type='date'
                                placeholder='Enter Expiry Date'
                                name='expiryDate'
                                id='expiryDate'
                                onChange={handleChange}
                                value={promoCode.expiryDate}
                                className='outline-none placeholder:text-white bg-transparent border-b p-2 border-[rgba(255,255,255,0.5)]'
                            />
                            <input
                                required
                                type='text'
                                placeholder='Enter number of times the promo code can be used(for unlimited type multiple otherwise type number)'
                                name='times'
                                id='times'
                                onChange={handleChange}
                                value={promoCode.times}
                                className='outline-none placeholder:text-white bg-transparent border-b p-2 border-[rgba(255,255,255,0.5)]'
                            />
                            <input
                                required
                                type='number'
                                placeholder='Enter Minimum Amount'
                                name='minimumAmount'
                                id='minimumAmount'
                                onChange={handleChange}
                                value={promoCode.minimumAmount}
                                className='outline-none placeholder:text-white bg-transparent border-b p-2 border-[rgba(255,255,255,0.5)]'
                            />
                            <input
                                required
                                type='number'
                                placeholder='Enter Maximum Discount'
                                name='maximumDiscount'
                                id='maximumDiscount'
                                onChange={handleChange}
                                value={promoCode.maximumDiscount}
                                className='outline-none placeholder:text-white bg-transparent border-b p-2 border-[rgba(255,255,255,0.5)]'
                            />
                            <button onClick={checkValidity} className="btn btn-active">Add PromoCode</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UploadPromoCode

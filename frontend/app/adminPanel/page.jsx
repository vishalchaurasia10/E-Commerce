'use client'
import React, { useState } from 'react'
import UploadCategory from '../components/admin/UploadCategory'
import UploadProduct from '../components/admin/UploadProduct';
import SearchForProduct from '../components/admin/SearchProduct';
import UploadPromoCode from '../components/admin/UploadPromoCode';
import UpdateShippingPrice from '../components/admin/UpdateShippingPrice';
import { toast, Toaster } from 'react-hot-toast';

const page = () => {

    const [activeTab, setActiveTab] = useState('category');
    const [secretKey, setSecretKey] = useState('')
    const [loggedIn, setLoggedIn] = useState(false)

    const tabOptions = [
        { key: 'category', label: 'Upload Category' },
        { key: 'products', label: 'Upload Products' },
        { key: 'promoCode', label: 'Upload PromoCode' },
        { key: 'search', label: 'Search Product' },
        { key: 'shippingPrice', label: 'Update Shipping Price' }
    ];

    const handleLogin = () => {
        if (secretKey === '') {
            toast.error('Please Enter the secret Key')
            return
        }
        if (secretKey === process.env.NEXT_PUBLIC_SECRET_KEY) {
            setLoggedIn(true)
            toast.success('Logged In Successfully')
        }
        else {
            toast.error('Invalid secret key')
        }
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'category':
                return <UploadCategory />;
            case 'products':
                return <UploadProduct />;
            case 'promoCode':
                return <UploadPromoCode />;
            case 'search':
                return <SearchForProduct />;
            case 'shippingPrice':
                return <UpdateShippingPrice />;
            default:
                return null;
        }
    }

    return (
        <>
            <Toaster />
            <div className={`"wrapper bg-[#607c84] min-h-screen ${!loggedIn ? 'flex items-center justify-center' : ''}"`}>
                {!loggedIn ?
                    <div className={`relative w-full flex items-center justify-center bg-[#607c84] mb-20`}>
                        <div className="uploadContent relative z-20 w-full lg:mx-40 flex items-center justify-center space-x-8">
                            <div className='uploadForm w-full lg:w-1/2 mx-2 bg-[rgba(255,255,255,0.1)] text-white flex flex-col lg:flex-row space-y-8 lg:space-y-0 rounded-xl p-4 md:p-8 backdrop-blur-2xl shadow-2xl border-[rgba(255,255,255,0.1)]'>
                                <div className='uploadForm w-full bg-[rgba(255,255,255,0.1)] text-white flex flex-col rounded-xl space-y-8 p-8 backdrop-blur-2xl shadow-2xl border-[rgba(255,255,255,0.1)]'>
                                    <h1 className={`font-bebas_neue font-bold text-6xl`}>Enter Admin Key</h1>
                                    <input
                                        required
                                        type='text'
                                        placeholder='Admin Secret Key'
                                        name='secretKey'
                                        id='secretKey'
                                        onChange={(e) => setSecretKey(e.target.value)}
                                        value={secretKey}
                                        className='outline-none placeholder:text-white bg-transparent border-b p-2 border-[rgba(255,255,255,0.5)]'
                                    />
                                    <button onClick={handleLogin} className="btn btn-active">Login</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <>
                        <div className="tabs py-10 px-3 lg:px-40 flex flex-wrap items-center justify-stretch md:justify-center">
                            {tabOptions.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`btn btn-active mr-4 mb-2`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                        <div className="pt-12 md:pt-4 pb-14">
                            {renderTabContent()}
                        </div>
                    </>
                }
            </div>
        </>
    )
}

export default page

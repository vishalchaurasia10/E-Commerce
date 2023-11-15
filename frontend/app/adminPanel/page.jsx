'use client'
import React, { useState } from 'react'
import UploadCategory from '../components/admin/UploadCategory'
import UploadProduct from '../components/admin/UploadProduct';
import SearchForProduct from '../components/admin/SearchProduct';
import UploadPromoCode from '../components/admin/UploadPromoCode';

const page = () => {

    const [activeTab, setActiveTab] = useState('category');

    const tabOptions = [
        { key: 'category', label: 'Upload Category' },
        { key: 'products', label: 'Upload Products' },
        { key: 'promoCode', label: 'Upload PromoCode' },
        { key: 'search', label: 'Search Product' },
    ];

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
            default:
                return null;
        }
    }

    return (
        <>
            <div className="wrapper bg-[#607c84] min-h-screen">
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
                <div className="tab-content pt-12 md:pt-4 pb-14">
                    {renderTabContent()}
                </div>
            </div>
        </>
    )
}

export default page

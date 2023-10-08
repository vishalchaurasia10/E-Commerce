import { bebas_neue } from '@/app/utils/fonts';
import Link from 'next/link';
import React from 'react';

const Category = () => {

    return (
        <div className="wrapper">
            <div className="categoriesThumbnail flex items-center justify-center w-full space-x-4 px-20">
                <Link className='w-1/2' href='/women'>
                    <div className={`bg-[url('/assets/pageLinks/shopWomen.png')] bg-cover bg-center pagesThumbnail relative w-full h-[45rem]`}>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-opacity-30 to-black" />
                        <h3 className={`${bebas_neue.className} text-white bottom-10 text-6xl left-48 absolute`}>Shop Women</h3>
                    </div>
                </Link>
                <Link className='w-1/2' href='/men'>
                    <div className={`bg-[url('/assets/pageLinks/shopmen.png')] bg-cover bg-center pagesThumbnail relative w-full h-[45rem]`}>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-opacity-30 to-black" />
                        <h3 className={`${bebas_neue.className} text-white bottom-10 text-6xl left-60 absolute`}>Shop men</h3>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Category;

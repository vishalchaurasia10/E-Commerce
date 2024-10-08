'use client'
import { getAllCategories } from '@/app/utils/apiFunctions/categoryFunctions';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const Carousel = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        getAllCategories(1).then(res => {
            setCategories(res.categories);
        }).catch(err => {
            console.log(err);
        });
    }, []);

    return (
        <>
            <div className='overflow-x-hidden'>
                <h2 className={`font-bebas_neue text-6xl w-full text-center py-5 lg:py-10`}>Category</h2>
                <div className="carousel carousel-end w-screen space-x-4 py-5">
                    {categories && categories.length > 0 && categories.map((category, index) => (
                        <Link
                            href={`/collection?categoryId=${category._id}`}
                            className={`carousel-item w-60`}
                            key={category._id}>
                            <div
                                key={category._id}
                                id={`slide${index + 1}`}
                                className={`carousel-item w-60 h-[22rem]`}
                            >
                                <div className='flex flex-col w-full items-center justify-center border border-gray-400 border-opacity-25 shadow-lg shadow-gray-400 overflow-hidden'>
                                    <Image width={500} height={500} src={`${category.coverImageId}`} className="w-full h-[18rem] object-cover" alt={`Slide ${index + 1}`} loading='lazy' />
                                    <h3 className={`font-bebas_neue py-5 text-black text-2xl text-center`}>{category.title}</h3>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="button flex items-center justify-center py-5">
                    <Link href={`/categories`}>
                        <button className='bg-[#2C3E50] py-2 px-8 text-white'>View All</button>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Carousel;

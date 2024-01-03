'use client'
import { getCategories } from '@/app/utils/apiFunctions/categoryFunctions';
import { bebas_neue } from '@/app/layout';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const Category = () => {

    const [themeCategories, setThemeCategories] = useState([])

    useEffect(() => {
        getCategories("type", 'themes').then(res => {
            setThemeCategories(res.categories)
        }).catch(err => {
            console.log(err)
        })
    }, [])

    return (
        <div className="wrapper flex flex-col space-y-4">
            <div className="categoriesThumbnail flex flex-col lg:flex-row items-center justify-center w-full lg:space-x-4 lg:px-0">
                <Link className='w-full lg:w-1/2' href='/women'>
                    <div className="pagesThumbnail justify-center flex relative overflow-hidden">
                        <Image
                            className="h-full w-full transition-all duration-300 hover:scale-105"
                            src='/assets/pageLinks/shopWomen.png'
                            height={500}
                            width={500}
                            alt="shopwomen"
                        />
                        <div className="absolute inset-0 top-1/2 bg-gradient-to-b from-transparent via-opacity-30 to-black" />
                        <h3 className={`${bebas_neue.className} text-white bottom-10 text-6xl absolute`}>Shop women</h3>
                    </div>
                </Link>
                <Link className='w-full lg:w-1/2' href='/men'>
                    <div className="pagesThumbnail justify-center flex relative overflow-hidden">
                        <Image
                            className="h-full w-full transition-all duration-300 hover:scale-105"
                            src='/assets/pageLinks/shopMen.png'
                            height={500}
                            width={500}
                            alt="shopmen"
                        />
                        <div className="absolute inset-0 top-1/2 bg-gradient-to-b from-transparent via-opacity-30 to-black" />
                        <h3 className={`${bebas_neue.className} text-white bottom-10 text-6xl absolute`}>Shop men</h3>
                    </div>
                </Link>
            </div>
            <div className="themeCategories flex flex-col justify-center items-center lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
                <div className="first lg:w-1/2 flex space-x-4">
                    {themeCategories && themeCategories.length > 0 && themeCategories.slice(0, 2).map((category, index) => (
                        <Link className="w-full" key={index} href={`/collection?categoryId=${category._id}`}>
                            <div className="pagesThumbnail w-full justify-center flex relative overflow-hidden">
                                <Image
                                    className="h-full w-full transition-all duration-300 hover:scale-105"
                                    src={`${category.coverImageId}`}
                                    height={500}
                                    width={500}
                                    alt="themeImage"
                                    loading='lazy'
                                />
                                <div className="absolute inset-0 top-1/2 bg-gradient-to-b from-transparent via-opacity-30 to-black" />
                                <h3 className={`${bebas_neue.className} text-white bottom-5 lg:bottom-10 text-2xl md:text-4xl absolute`}>{category.title}</h3>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="second lg:w-1/2 flex space-x-4">
                    {themeCategories && themeCategories.length > 0 && themeCategories?.slice(2, 4).map((category, index) => (
                        <Link className="w-full" key={index} href={`/collection?categoryId=${category._id}`}>
                            <div className="bg-cover w-full bg-center pagesThumbnail justify-center flex relative overflow-hidden">
                                <Image
                                    className="h-full w-full transition-all duration-300 hover:scale-105"
                                    src={`${category.coverImageId}`}
                                    height={500}
                                    width={500}
                                    alt="themeImage"
                                    loading='lazy'
                                />
                                <div className="absolute inset-0 top-1/2 bg-gradient-to-b from-transparent via-opacity-30 to-black" />
                                <h3 className={`${bebas_neue.className} text-white bottom-5 lg:bottom-10 text-2xl md:text-4xl absolute`}>{category.title}</h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default Category;

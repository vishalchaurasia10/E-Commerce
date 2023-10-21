import { bebas_neue } from '@/app/utils/fonts';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Grid = ({ initialUrl, data }) => {
    return (
        <>
            <div className="wrapper flex flex-col space-y-4 py-5">
                <div className="themeCategories flex flex-col justify-center items-center lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
                    <div className="first flex space-x-4">
                        {data.slice(0, 3).map((item, index) => (
                            <Link className="w-1/3" key={index} href={`/category/${item.title}`}>
                                <div className="pagesThumbnail justify-center flex relative">
                                    <Image
                                        className="h-full w-full"
                                        src={`${initialUrl}${index + 1}.png`}
                                        height={500}
                                        width={500}
                                        alt="themeImage"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-opacity-30 to-black" />
                                    <h3 className={`${bebas_neue.className} text-center text-white bottom-5 lg:bottom-10 text-2xl md:text-4xl absolute`}>{item.title}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="categoriesThumbnail flex flex-col lg:flex-row items-center justify-center w-full lg:space-x-4 lg:px-0">
                    {data.slice(3).map((item, index) => {
                        return (
                            <Link className='w-full lg:w-1/2' href='/women'>
                                <div className="pagesThumbnail justify-center flex relative">
                                    <img
                                        className="h-full w-full"
                                        src={`/assets/women/${index + 4}.png`}
                                        height={500}
                                        width={500}
                                        alt="shopwomen"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-opacity-30 to-black" />
                                    <h3 className={`${bebas_neue.className} text-center text-white bottom-10 text-6xl absolute`}>{item.title}</h3>
                                </div>
                            </Link>
                        )
                    })}

                </div>
            </div>
        </>
    );
};

export default Grid;

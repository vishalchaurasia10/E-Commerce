'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CarouselBanner = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const urls = ['/men', '/women', '/themes']

    useEffect(() => {
        const intervalId = setInterval(() => {
            // Move to the next image
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000); // Change slide every 5 seconds

        // Cleanup the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [images.length]);

    return (
        <div className='relative w-full h-[10rem] md:h-[25rem] lg:h-[37rem] overflow-hidden'>
            {images.map((imageUrl, index) => (
                <Link href={urls[index]} key={index}>
                    <div
                        key={index}
                        className={`absolute w-full h-full transition-transform transform ${index === currentIndex ? 'translate-x-0' : 'translate-x-full'
                            }`}
                    >
                        <Image src={`/assets/${imageUrl}`} alt={`banner-${index}`} layout="fill" objectFit="cover" />
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default CarouselBanner;

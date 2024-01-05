'use client'
import React, { useState } from 'react';
import ReactImageMagnify from 'react-image-magnify';

const PreviewImages = ({ imageId }) => {
    const [selectedImage, setSelectedImage] = useState(imageId[0]);

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
    };

    return (
        <div className="preview-images flex flex-col space-y-3">
            <div className="magnify-image">
                <ReactImageMagnify
                    {...{
                        smallImage: {
                            alt: 'Product Image',
                            isFluidWidth: true,
                            src: `${selectedImage}`,
                        },
                        largeImage: {
                            src: `${selectedImage}`,
                            width: 1200, // Adjust according to your high-resolution image width
                            height: 1400, // Adjust according to your high-resolution image height
                        },
                        enlargedImageContainerDimensions: {
                            width: '180%', // Adjust as needed
                            height: '100%', // Adjust as needed
                        },
                        enlargedImageContainerStyle: {
                            backgroundColor: 'rgba(255, 255, 255, 1)', // Add your desired background color
                        },
                    }}
                />
            </div>
            <div className="flex w-3/4 space-x-2 overflow-x-auto scrollbar-hidden">
                {imageId.map((imageUrl, index) => (
                    <img
                        className='w-24 h-28 object-cover cursor-pointer'
                        key={index}
                        src={`${imageUrl}`}
                        alt={`Preview ${index + 1}`}
                        onClick={() => handleImageClick(imageUrl)}
                    />
                ))}
            </div>
        </div>
    );
};

export default PreviewImages;

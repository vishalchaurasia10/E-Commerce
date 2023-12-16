'use client'
import React, { useState } from 'react';

const PreviewImages = ({ imageId }) => {
    const [selectedImage, setSelectedImage] = useState(imageId[0]);

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
    };

    return (
        <div className="preview-images flex flex-col space-y-3">
            <div className="large-image">
                <img className='w-[100%]' src={`${selectedImage}`} alt="Large Preview" />
            </div>
            <div className="flex w-3/4 space-x-2 overflow-x-auto scrollbar-hidden">
                {imageId.map((imageUrl, index) => (
                    <img
                        className='w-24 cursor-pointer'
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

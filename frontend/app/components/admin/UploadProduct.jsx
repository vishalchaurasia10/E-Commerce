'use client'
import { getAllCategories } from '@/app/utils/apiFunctions/categoryFunctions'
import { uploadProductDocument, uploadProductImages } from '@/app/utils/apiFunctions/productFunctions'
import { bebas_neue } from '@/app/utils/fonts'
import React, { useEffect, useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { BsFillCloudUploadFill } from 'react-icons/bs'
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa'
import ListAllProducts from './ListAllProducts'

const UploadProduct = () => {
    const [inputFields, setInputFields] = useState([{ id: 1 }]);
    const [categoryOption, setCategoryOption] = useState([]);
    const sizes = ['Small', 'Medium', 'Large', 'XL', 'XXL'];
    const [productDetails, setProductDetails] = useState({
        title: '',
        category: '',
        price: '',
        featured: false,
        size: [],
        color: '',
        description: '',
        otherDetails: []
    })

    const handleChange = (e) => {
        setProductDetails({
            ...productDetails,
            [e.target.name]: e.target.value
        })
    }

    const handleRadioChange = (e) => {
        setProductDetails({
            ...productDetails,
            [e.target.name]: e.target.value === 'true' // Convert the string value to a boolean
        });
    }

    const checkValidity = () => {
        if (document.getElementById('uploadFile').files.length === 0) {
            toast.error('Please select images by clicking on the cloud icon')
        } else if (productDetails.title.length < 3 || productDetails.category === '' || productDetails.price === 0 || productDetails.color === '' || productDetails.size.length === 0 || productDetails.description === '') {
            toast.error('Please fill all the fields')
        } else {
            handleFileUpload()
        }
    }

    const handleChangeForExtraFields = (e, id) => {
        const { name, value } = e.target;
        const updatedFields = [...inputFields];
        const field = updatedFields.find((field) => field.id === id);
        field[name] = value;
        setInputFields(updatedFields);

        // Update otherDetails with the input values
        const updatedOtherDetails = updatedFields.map((field) => field.otherDetails);
        setProductDetails({
            ...productDetails,
            otherDetails: updatedOtherDetails
        })
    };

    const handleAddInput = () => {
        const newId = inputFields.length + 1;
        setInputFields([...inputFields, { id: newId }]);
    };

    const handleRemoveInput = (id) => {
        const updatedFields = inputFields.filter((field) => field.id !== id);
        setInputFields(updatedFields);

        // Update otherDetails after removing an input field
        const updatedOtherDetails = updatedFields.map((field) => field.otherDetails);
        setProductDetails({
            ...productDetails,
            otherDetails: updatedOtherDetails
        })
    };

    const handleSizeClick = (size) => {
        const updatedSizes = [...productDetails.size];

        if (updatedSizes.includes(size)) {
            // Remove the size if it's already selected
            updatedSizes.splice(updatedSizes.indexOf(size), 1);
        } else {
            // Add the size if it's not selected
            updatedSizes.push(size);
        }

        setProductDetails({
            ...productDetails,
            size: updatedSizes,
        });
    };

    const handleFileUpload = async (e) => {
        const fileInput = document.getElementById('uploadFile');
        const files = fileInput.files;
        const fileIds = [];
        for (let i = 0; i < files.length; i++) {
            const response = await uploadProductImages(files[i])
            if (response.status === 'success') {
                fileIds.push(response.fileId)
            } else {
                toast.error(response.message)
                return
            }
        }
        if (fileIds.length !== 0) {
            const result = await uploadProductDocument(productDetails.title, productDetails.category, fileIds, productDetails.price, productDetails.size, productDetails.color, productDetails.description, productDetails.otherDetails, productDetails.featured)
            if (result.status === 'success') {
                toast.success(result.message)
                setProductDetails({
                    title: '',
                    category: '',
                    price: '',
                    size: [],
                    color: '',
                    description: '',
                    otherDetails: []
                })
                setInputFields([{ id: 1 }])
                fileInput.value = ''
            } else {
                toast.error(result.message)
            }
        } else {
            toast.error('Images are not uploaded')
        }
    }

    useEffect(() => {
        const fetchCategories = async () => {
            const categories = await (await getAllCategories()).categories;
            setCategoryOption(categories)
        }
        fetchCategories()
    }, [])

    return (
        <>
            <Toaster />
            <div className={`relative w-full flex items-center justify-center bg-[#607c84] pb-10`}>
                <div className="uploadContent relative z-20 w-full lg:mx-40 flex items-center justify-center space-x-8">
                    <div className='uploadForm w-full mx-2 bg-[rgba(255,255,255,0.1)] text-white flex flex-col lg:flex-row space-y-8 lg:space-y-0 rounded-xl p-4 md:p-8 backdrop-blur-2xl shadow-2xl border-[rgba(255,255,255,0.1)]'>
                        <div className="images flex items-center lg:order-2 lg:ml-8 lg:w-1/2 rounded-xl">
                            <label className='w-full flex justify-center items-center cursor-pointer' htmlFor="uploadFile">
                                <BsFillCloudUploadFill className='text-[14rem] text-[rgba(255,255,255,0.5)]' />
                                <input className="hidden" type="file" name="uploadFile" id="uploadFile" multiple />
                            </label>
                        </div>
                        <div className='uploadForm lg:order-1 lg:w-1/2 bg-[rgba(255,255,255,0.1)] text-white flex flex-col rounded-xl space-y-8 p-8 backdrop-blur-2xl shadow-2xl border-[rgba(255,255,255,0.1)]'>
                            <h1 className={`${bebas_neue.className} font-bold text-6xl`}>Upload Products</h1>
                            <input
                                required
                                type="text"
                                placeholder='Enter Product Title'
                                name='title'
                                id='title'
                                onChange={handleChange}
                                value={productDetails.title}
                                className='outline-none placeholder:text-white bg-transparent border-b p-2 border-[rgba(255,255,255,0.5)]'
                            />
                            <select
                                name='category'
                                id='category'
                                onChange={handleChange}
                                value={productDetails.category}
                                className="p-2 border-b border-[rgba(255,255,255,0.5)] w-full outline-none bg-transparent">
                                <option disabled value=''>Select the category</option>
                                {categoryOption.map((category) => {
                                    return (
                                        <option className='text-black' key={category._id} value={category._id}>
                                            <span>{category.type} : </span>
                                            <span>{category.title}</span>
                                        </option>
                                    )
                                })}
                            </select>
                            <div className="featured">
                                <div className="form-control">
                                    <label className="label cursor-pointer">
                                        <span className="label-text text-white">Featured Product</span>
                                        <input
                                            type="radio"
                                            name="featured"
                                            value='true'
                                            onChange={handleRadioChange}
                                            className="radio checked:bg-[#607c84]"
                                            checked={productDetails.featured === true} />
                                    </label>
                                </div>
                                <div className="form-control">
                                    <label className="label cursor-pointer">
                                        <span className="label-text text-white">Not a Featured a Product</span>
                                        <input
                                            type="radio"
                                            name="featured"
                                            value='false'
                                            className="radio checked:bg-[#607c84]"
                                            onChange={handleRadioChange}
                                            checked={productDetails.featured === false} />
                                    </label>
                                </div>
                            </div>
                            <div className="priceColor flex w-full space-x-4">
                                <input
                                    required
                                    type="number"
                                    placeholder='Enter Price'
                                    name='price'
                                    id='price'
                                    onChange={handleChange}
                                    value={productDetails.price}
                                    className='outline-none w-[30%] placeholder:text-white bg-transparent border-b p-2 border-[rgba(255,255,255,0.5)]'
                                />
                                <input
                                    required
                                    type="text"
                                    placeholder='Enter Product Color'
                                    name='color'
                                    id='color'
                                    onChange={handleChange}
                                    value={productDetails.color}
                                    className='outline-none w-[70%] placeholder:text-white bg-transparent border-b p-2 border-[rgba(255,255,255,0.5)]'
                                />
                            </div>
                            <textarea
                                required
                                placeholder='Enter Product Description'
                                name='description'
                                id='description'
                                onChange={handleChange}
                                value={productDetails.description}
                                rows={3}
                                cols={10}
                                className='outline-none placeholder:text-white bg-transparent border-b p-2 border-[rgba(255,255,255,0.5)]'
                            />
                            <div className="size flex flex-wrap items-center">
                                {sizes.map((size) => (
                                    <button
                                        key={size}
                                        className={`btn rounded-3xl mr-4 mb-2 ${productDetails.size.includes(size) ? 'btn-neutral' : ' btn-active'}`}
                                        onClick={() => handleSizeClick(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                            <div>
                                {inputFields.map((field) => (
                                    <div key={field.id} className="otherDetails flex items-center justify-center space-x-4">
                                        <input
                                            required
                                            type="text"
                                            placeholder='Enter other details'
                                            name='otherDetails'
                                            onChange={(e) => handleChangeForExtraFields(e, field.id)}
                                            value={field.otherDetails || ''} // Use the field's value
                                            className='outline-none w-full placeholder:text-white bg-transparent border-b p-2 border-[rgba(255,255,255,0.5)]'
                                        />
                                        <FaMinusCircle
                                            className='text-3xl cursor-pointer'
                                            onClick={() => handleRemoveInput(field.id)}
                                        />
                                        <FaPlusCircle
                                            className='text-3xl cursor-pointer'
                                            onClick={handleAddInput} />
                                    </div>
                                ))}
                            </div>
                            <button onClick={checkValidity} className="btn btn-active">Upload</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="allProducts bg-white pb-1">
                <ListAllProducts />
            </div>
        </>
    )
}

export default UploadProduct

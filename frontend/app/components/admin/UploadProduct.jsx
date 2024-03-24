'use client'
import { getAllCategoriesWithoutPagination } from '@/app/utils/apiFunctions/categoryFunctions'
import { uploadProductDocument, uploadProductImages } from '@/app/utils/apiFunctions/productFunctions'
import React, { useEffect, useState } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import { BsFillCloudUploadFill } from 'react-icons/bs'
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa'
import ListAllProducts from './ListAllProducts'

const UploadProduct = () => {
    const [inputFields, setInputFields] = useState([{ id: 1 }]);
    const [categoryOption, setCategoryOption] = useState([]);
    const sizes = ['XS', 'Small', 'Medium', 'Large', 'XL', 'XXL'];
    const [categoryTitles, setCategoryTitles] = useState([]);
    const [productDetails, setProductDetails] = useState({
        title: '',
        category: [],
        price: '',
        featured: false,
        size: [],
        color: '',
        description: '',
        otherDetails: []
    })
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'category') {
            const [categoryId, categoryTitle] = value.split(',');
            if (productDetails.category.includes(categoryId)) {
                return;
            }
            setCategoryTitles([...categoryTitles, categoryTitle])
            setProductDetails({
                ...productDetails,
                category: [...productDetails.category, categoryId]
            });
        } else {
            // For other fields, update the state as usual
            setProductDetails({
                ...productDetails,
                [name]: value
            });
        }
    }

    const removeCategory = (id) => {
        const updatedCategories = categoryTitles.filter((category, index) => index !== id);
        const updatedCategoryIds = productDetails.category.filter((categoryId, index) => index !== id);
        setCategoryTitles(updatedCategories);
        setProductDetails({
            ...productDetails,
            category: updatedCategoryIds
        });
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
        } else if (productDetails.title.length < 3 || productDetails.category.length == 0 || productDetails.price === 0 || productDetails.color === '' || productDetails.size.length === 0 || productDetails.description === '') {
            toast.error('Please fill all the fields')
        } else {
            console.log('productDetails', productDetails)
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
        setLoading(true)
        const fileInput = document.getElementById('uploadFile');
        const files = fileInput.files;
        let fileIds = [];
        const response = await uploadProductImages(files)
        if (response.status === 'success') {
            fileIds = response.fileId
        } else {
            toast.error(response.message)
            return
        }
        if (fileIds.length !== 0) {
            console.log('categories:', productDetails.category)
            const result = await uploadProductDocument(productDetails.title, productDetails.category, fileIds, productDetails.price, productDetails.size, productDetails.color, productDetails.description, productDetails.otherDetails, productDetails.featured)
            if (result.status === 'success') {
                toast.success(result.message)
                setProductDetails({
                    title: '',
                    category: [],
                    price: '',
                    size: [],
                    color: '',
                    description: '',
                    otherDetails: []
                })
                setCategoryTitles([])
                setInputFields([{ id: 1 }])
                fileInput.value = ''
            } else {
                toast.error(result.message)
            }
        } else {
            toast.error('Images are not uploaded')
        }
        setLoading(false)
    }

    useEffect(() => {
        const fetchCategories = async () => {
            const categories = await getAllCategoriesWithoutPagination()
            setCategoryOption(categories.categories)
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
                            <h1 className={`font-bebas_neue font-bold text-6xl`}>Upload Products</h1>
                            <input
                                required
                                type="text"
                                placeholder='Enter Product Title'
                                name='title'
                                id='title'
                                onChange={handleChange}
                                className='outline-none placeholder:text-white bg-transparent border-b p-2 border-[rgba(255,255,255,0.5)]'
                            />
                            <select
                                name='category'
                                id='category'
                                onChange={handleChange}
                                className="p-2 border-b border-[rgba(255,255,255,0.5)] w-full outline-none bg-transparent">
                                <option disabled value=''>Select the category</option>
                                {categoryOption.length > 0 && categoryOption.map((category) => {
                                    const valueString = `${category._id},${category.title}`; // Concatenate ID and title
                                    return (
                                        <option className='text-black' key={category._id} value={valueString}>
                                            <span>{category.type} : </span>
                                            <span>{category.title}</span>
                                        </option>
                                    )
                                })}
                            </select>
                            {
                                categoryTitles.length > 0 &&
                                <div className="selectedCategories flex flex-wrap items-center ">
                                    {categoryTitles.map((title, index) => (
                                        <button
                                            key={index}
                                            className={`btn btn-neutral rounded-3xl mr-2 mb-2 `}
                                            onClick={() => removeCategory(index)}
                                            title={`Remove ${title}`}
                                        >
                                            {title}
                                        </button>
                                    ))}
                                </div>
                            }
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
                            <button onClick={checkValidity} className="btn btn-active">
                                {loading && <span className="loading loading-spinner loading-sm"></span>}
                                <span>Upload</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="allProducts bg-white pb-1">
                <ListAllProducts categoryOption={categoryOption} />
            </div>
        </>
    )
}

export default UploadProduct

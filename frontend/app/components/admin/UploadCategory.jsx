'use client'
import { uploadCategoryDocument, uploadCategoryFile } from '@/app/utils/apiFunctions/categoryFunctions'
import { categoryFields } from '@/app/utils/constants'
import { bebas_neue } from '@/app/utils/fonts'
import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { BsFillCloudUploadFill } from 'react-icons/bs'

const UploadCategory = () => {
    const [categoryDetail, setCategoryDetails] = useState({
        title: '',
        type: '',
        coverImageId: ''
    })

    const handleChange = (e) => {
        setCategoryDetails({
            ...categoryDetail,
            [e.target.name]: e.target.value
        })
    }

    const checkValidity = () => {
        if (categoryDetail.title.length < 3 || categoryDetail.type === '') {
            toast.error('Please fill all the fields')
        } else {
            handleFileUpload()
        }
    }

    const handleFileUpload = async (e) => {
        const fileInput = document.getElementById('uploadFile');
        const file = fileInput.files[0];
        const response = await uploadCategoryFile(file)
        if (response.status === 'success') {
            setCategoryDetails({
                ...categoryDetail,
                coverImageId: response.fileId
            })
        } else {
            toast.error(response.message)
            return
        }
        if (response.fileId !== '') {
            const result = await uploadCategoryDocument(categoryDetail.title, response.fileId, categoryDetail.type)
            if (result.status === 'success') {
                toast.success(result.message)
                setCategoryDetails({
                    title: '',
                    type: '',
                    coverImageId: ''
                })
            } else {
                toast.error(result.message)
            }
        } else {
            toast.error('Cover Image is not uploaded')
        }
    }

    return (
        <>
            <Toaster />
            <div className={`relative w-full flex items-center justify-center bg-[#607c84]`}>
                <div className="uploadContent relative z-20 w-full lg:mx-40 flex items-center justify-center space-x-8">
                    <div className='uploadForm w-full mx-2 bg-[rgba(255,255,255,0.1)] text-white flex flex-col lg:flex-row space-y-8 lg:space-y-0 rounded-xl p-4 md:p-8 backdrop-blur-2xl shadow-2xl border-[rgba(255,255,255,0.1)]'>
                        <div className="images flex items-center lg:order-2 lg:ml-8 lg:w-1/2 rounded-xl">
                            <label className='w-full flex justify-center items-center cursor-pointer' htmlFor="uploadFile">
                                <BsFillCloudUploadFill className='text-[14rem] text-[rgba(255,255,255,0.5)]' />
                                <input className="hidden" type="file" name="uploadFile" id="uploadFile" />
                            </label>
                        </div>
                        <div className='uploadForm lg:order-1 lg:w-1/2 bg-[rgba(255,255,255,0.1)] text-white flex flex-col rounded-xl space-y-8 p-8 backdrop-blur-2xl shadow-2xl border-[rgba(255,255,255,0.1)]'>
                            <h1 className={`${bebas_neue.className} font-bold text-6xl`}>Upload Category</h1>
                            {
                                categoryFields.map((field, index) => {
                                    return (
                                        <input
                                            required
                                            key={index}
                                            type={field.type}
                                            placeholder={field.placeholder}
                                            name={field.name}
                                            id={field.name}
                                            onChange={handleChange}
                                            value={categoryDetail[field.name]}
                                            className='outline-none placeholder:text-white bg-transparent border-b p-2 border-[rgba(255,255,255,0.5)]'
                                        />
                                    )
                                })
                            }
                            <button onClick={checkValidity} className="btn btn-active">Upload</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UploadCategory

'use client'
import { getAllCategories, uploadCategoryDocument, uploadCategoryFile, getCategoryByType } from '@/app/utils/apiFunctions/categoryFunctions'
import { categoryFields } from '@/app/utils/constants'
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { BsFillCloudUploadFill } from 'react-icons/bs'
import { FaPen, FaTrash } from 'react-icons/fa'
import { FaCircleExclamation } from 'react-icons/fa6'
import Image from 'next/image'
import { RiLoopRightFill } from 'react-icons/ri'

const UploadCategory = () => {
    const [categoryDetail, setCategoryDetails] = useState({
        title: '',
        type: '',
        coverImageId: ''
    })
    const [selectedFile, setSelectedFile] = useState(null);
    const [categories, setCategories] = useState([]);
    const [deleteId, setDeleteId] = useState('')
    const [updateId, setUpdateId] = useState('')
    const [categoryType, setCategoryType] = useState('all')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [updateFields, setUpdateFields] = useState({
        title: '',
        type: '',
        coverImageId: ''
    })
    const [loading, setLoading] = useState(false)
    const types = ['all', 'men', 'women', 'themes']

    const handleUpdateChange = (e) => {
        setUpdateFields({
            ...updateFields,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        if (categoryType === 'all') {
            getAllCategories(page).then(res => {
                setCategories(res.categories);
                setTotalPages(Math.ceil(res.count / 12))
            }).catch(err => {
                toast.error(err.message);
                console.log(err);
            });
        } else {
            getCategoryByType(categoryType, page).then(res => {
                setCategories(res.categories);
                setTotalPages(Math.ceil(res.count / 12))
            }).catch(err => {
                toast.error(err.message);
                console.log(err);
            });
        }
    }, [categoryType, page]);

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
        if (!file) {
            toast.error('Please upload a file')
            return
        }
        setLoading(true)
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
        setLoading(false)
    }

    const handleDelete = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${deleteId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (response.status === 200) {
                toast.success(data.message);
                getAllCategories().then(res => {
                    setCategories(res.categories);
                }).catch(err => {
                    console.log(err);
                });
            } else {
                toast.error(data.error);
            }
            setDeleteId('')
        } catch (error) {
            toast.error(error.message);
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdate = async () => {
        try {
            setLoading(true)
            const formData = new FormData();
            formData.append('title', updateFields.title);
            formData.append('type', updateFields.type);
            formData.append('coverImage', selectedFile); // Assuming selectedFile is a File object

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${updateId}`, {
                method: 'PUT',
                body: formData,
            });
            const data = await response.json();
            if (response.status === 200) {
                toast.success(data.message);
                getAllCategories().then(res => {
                    setCategories(res.categories);
                }).catch(err => {
                    console.log(err);
                });
            } else {
                toast.error(data.error);
            }
            setUpdateId('')
            setSelectedFile(null)
        } catch (error) {
            toast.error(error.message);
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleImageUpdate = () => {
        const fileInput = document.getElementById('replaceFile');
        fileInput.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                // Update state to show the selected image in the UI
                setUpdateFields({
                    ...updateFields,
                    coverImageId: reader.result,
                });

                // Save the selected file for later use when updating on the backend
                setSelectedFile(file);
            };

            reader.readAsDataURL(file);
        }
    };

    const handleCategoryTypeChange = (e) => {
        setCategoryType(e.target.value)
    }

    const handlePageChange = (newPage) => {
        setPage(newPage)
    }

    return (
        <>
            <Toaster />

            {/* add category */}
            <div className={`relative w-full flex items-center justify-center pb-10 bg-[#607c84]`}>
                <div className="uploadContent relative z-20 w-full lg:mx-40 flex items-center justify-center space-x-8">
                    <div className='uploadForm w-full mx-2 bg-[rgba(255,255,255,0.1)] text-white flex flex-col lg:flex-row space-y-8 lg:space-y-0 rounded-xl p-4 md:p-8 backdrop-blur-2xl shadow-2xl border-[rgba(255,255,255,0.1)]'>
                        <div className="images flex items-center lg:order-2 lg:ml-8 lg:w-1/2 rounded-xl">
                            <label className='w-full flex justify-center items-center cursor-pointer' htmlFor="uploadFile">
                                <BsFillCloudUploadFill className='text-[14rem] text-[rgba(255,255,255,0.5)]' />
                                <input className="hidden" type="file" name="uploadFile" id="uploadFile" />
                            </label>
                        </div>
                        <div className='uploadForm lg:order-1 lg:w-1/2 bg-[rgba(255,255,255,0.1)] text-white flex flex-col rounded-xl space-y-8 p-8 backdrop-blur-2xl shadow-2xl border-[rgba(255,255,255,0.1)]'>
                            <h1 className={`font-bebas_neue text-6xl`}>Upload Category</h1>
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
                            <button onClick={checkValidity} className="btn btn-active">
                                {loading && <span className="loading loading-spinner loading-sm"></span>}
                                <span>
                                    Upload
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <h1 className={`font-bebas_neue pt-20 pb-10 text-center bg-white text-6xl`}>All categories</h1>

            <div className="mainContainer min-h-[35rem] flex flex-col lg:flex-row lg:space-x-4 bg-white justify-center px-10">
                <div className="filter lg:w-[18%] border-2 border-gray-400 my-2 p-4 h-fit lg:sticky lg:top-20">
                    {
                        types.map((type, index) => {
                            return (
                                <div onClick={handleCategoryTypeChange} key={index} className="types flex space-x-4 py-1">
                                    <h3 className={`font-roboto font-extrabold capitalize`}>{type}</h3>
                                    <input className='radio h-4 w-4 ml-2 mt-2' type="radio" name="categoryType" id="categoryType" value={type} />
                                </div>
                            )
                        })
                    }
                </div>

                {/* show categories */}
                <div className="showCategories lg:w-[82%] flex flex-col flex-wrap bg-white">
                    {/* <h2 className='font-roboto block pl-20 text-lg'>Category count: <span className='font-bold'>{count}</span></h2> */}
                    <div className="categories flex px-10 flex-wrap">
                        {categories && categories.length > 0 && categories.map((category, index) => (
                            <React.Fragment key={category._id}>
                                <div className="carousel-item m-2 w-60">
                                    <div
                                        id={`slide${index + 1}`}
                                        className={`carousel-item w-60`}
                                    >
                                        <div className='relative w-full flex flex-col border border-gray-400 border-opacity-25 shadow-lg shadow-gray-400'>
                                            <Image height={500} width={500} src={`${category.coverImageId}`} className="w-full h-[18rem] object-cover" alt={`Slide ${index + 1}`} />
                                            <h3 className={`text-black pl-4 pt-3`}><span className='font-bold'>Title: </span>{category.title}</h3>
                                            <h3 className={`text-black pl-4 pb-3`}><span className='font-bold'>Type: </span> {category.type}</h3>
                                            <FaPen
                                                title='Update'
                                                onClick={() => {
                                                    setUpdateId(category._id);
                                                    setUpdateFields({
                                                        title: category.title,
                                                        type: category.type,
                                                        coverImageId: category.coverImageId
                                                    })
                                                    document.getElementById('updateModal').showModal()
                                                }}
                                                className="text-3xl text-gray-600 bg-white p-[0.38rem] rounded-md absolute right-10 top-2 hover:scale-110 transition-all duration-300 cursor-pointer" />
                                            <FaTrash
                                                onClick={() => {
                                                    setDeleteId(category._id);
                                                    document.getElementById('deleteModal').showModal()
                                                }}
                                                title='Delete'
                                                className="text-3xl text-gray-600 bg-white p-[0.38rem] rounded-md absolute right-1 top-2 hover:scale-110 transition-all duration-300 cursor-pointer" />
                                        </div>
                                    </div>
                                </div>

                                {/* deletemodal */}
                                <dialog id="deleteModal" className="modal">
                                    <div className="modal-box">
                                        <h3 className="font-bold text-lg flex items-center">
                                            <FaCircleExclamation className="inline-block mr-2 text-2xl text-red-500" />
                                            <span className='text-xl'>
                                                Delete Category
                                            </span>
                                        </h3>
                                        <p className="py-4">Are you sure, you want to delete this category?</p>
                                        <div className="modal-action">
                                            <form className='flex space-x-2' method="dialog">
                                                <button onClick={handleDelete} className="btn btn-neutral">
                                                    {loading && <span className="loading loading-spinner loading-sm"></span>}
                                                    <span>Delete</span>
                                                </button>
                                                <button onClick={() => setDeleteId('')} className="btn">Close</button>
                                            </form>
                                        </div>
                                    </div>
                                </dialog>

                                {/* updatemodal */}
                                <dialog id="updateModal" className="modal">
                                    <div className="modal-box">
                                        <h3 className="font-bold text-lg flex items-center">
                                            <FaCircleExclamation className="inline-block mr-2 text-2xl text-yellow-500" />
                                            <span className='text-xl'>
                                                Update Category
                                            </span>
                                        </h3>
                                        <div className="inputs flex flex-col space-y-2 pt-4">
                                            <input
                                                required
                                                type='text'
                                                placeholder='Enter category name'
                                                name='title'
                                                id='title'
                                                value={updateFields.title}
                                                onChange={handleUpdateChange}
                                                className='outline-none placeholder:text-white bg-transparent border p-2 border-gray-500 rounded-lg'
                                            />
                                            <input
                                                required
                                                type='text'
                                                placeholder='Enter category type'
                                                name='type'
                                                id='type'
                                                value={updateFields.type}
                                                onChange={handleUpdateChange}
                                                className='outline-none placeholder:text-white bg-transparent border p-2 border-gray-500 rounded-lg'
                                            />
                                            <input
                                                onChange={(e) => handleFileChange(e)}
                                                type='file'
                                                name='replaceFile'
                                                id='replaceFile'
                                                className='hidden' />
                                            <div className="image relative w-fit">
                                                <RiLoopRightFill
                                                    title='Replace Image'
                                                    onClick={handleImageUpdate}
                                                    className="text-3xl text-gray-600 bg-white p-[0.38rem] rounded-md absolute right-1 top-2 hover:scale-110 transition-all duration-300 cursor-pointer"
                                                />
                                                <Image src={`${updateFields.coverImageId}`} alt={updateFields.title} width={200} height={200} />
                                            </div>
                                        </div>
                                        <div className="modal-action">
                                            <form className='flex space-x-2' method="dialog">
                                                <button onClick={handleUpdate} className="btn btn-neutral">
                                                    {loading && <span className="loading loading-spinner loading-sm"></span>}
                                                    <span>Update</span>
                                                </button>
                                                <button onClick={() => setUpdateId('')} className="btn">Close</button>
                                            </form>
                                        </div>
                                    </div>
                                </dialog>
                            </React.Fragment>
                        ))}
                    </div>
                    <div className="join w-full flex justify-center my-10">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className="join-item btn">
                            «
                        </button>
                        <button className="join-item btn">Page {page}</button>
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page >= totalPages}
                            className="join-item btn">
                            »
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UploadCategory

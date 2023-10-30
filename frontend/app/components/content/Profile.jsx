'use client'
import React, { useContext, useState } from 'react'
import { RiPencilFill } from 'react-icons/ri'
import authContext from '@/app/context/Auth/authContext'

const Profile = ({ user, setShowSidebar, showSidebar }) => {
    const { updateUserDetails, loading } = useContext(authContext)
    const [hasChanged, setHasChanged] = useState(false);
    const [localState, setLocalState] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        phoneNumber: user?.phoneNumber || '',
        email: user?.email || '',
        address: user?.address || '',
        apartment: user?.apartment || '',
        city: user?.city || '',
        state: user?.state || '',
        pinCode: user?.pinCode || '',
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLocalState({ ...localState, [name]: value });
        setHasChanged(true);
    };

    const handleUpdate = () => {
        updateUserDetails(user._id, localState)
        setHasChanged(false);
    }

    return (
        <div className='h-full py-6 lg:py-10 px-3 lg:px-5 border border-[#4D7E86]'>
            <div className="hamburger pb-3 lg:hidden">
                <svg onClick={() => setShowSidebar(!showSidebar)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block relative bg-white z-50 w-8 h-8 stroke-current lg:hidden"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </div>
            <div className="profileDetails mb-8">
                <div className='flex items-center space-x-2 mb-6'>
                    <h1 className='font-bold text-2xl'>Profile Details</h1>
                    <RiPencilFill className='text-2xl' />
                </div>
                <div className="name w-full flex space-x-4 mb-4">
                    <input
                        className='w-1/2 bg-[#F5F5F5] p-3 border border-black rounded-md outline-none'
                        type="text"
                        name='firstName'
                        value={localState.firstName}
                        onChange={handleInputChange}
                        placeholder='First Name' />
                    <input
                        className='w-1/2 bg-[#F5F5F5] p-3 border border-black rounded-md outline-none'
                        type="text"
                        name='lastName'
                        value={localState.lastName}
                        onChange={handleInputChange}
                        placeholder='Last Name' />
                </div>
                <div className="phoneNumber w-full mb-4">
                    <input
                        className='w-full bg-[#F5F5F5] p-3 border border-black rounded-md outline-none'
                        type="text"
                        name='phoneNumber'
                        value={localState.phoneNumber}
                        onChange={handleInputChange}
                        placeholder='Phone Number' />
                </div>
                <div className="email w-full mb-4">
                    <input
                        className='w-full bg-[#F5F5F5] p-3 border border-black rounded-md outline-none'
                        type="email"
                        name='email'
                        value={localState.email}
                        onChange={handleInputChange}
                        placeholder='Email' />
                </div>
            </div>
            <div className="shippingDetails mb-6">
                <div className='flex items-center space-x-2 mb-6'>
                    <h1 className='font-bold text-2xl'>Shipping Details</h1>
                    <RiPencilFill className='text-2xl' />
                </div>
                <div className="name w-full flex space-x-4 mb-4">
                    <input
                        className='w-full bg-[#F5F5F5] p-3 border border-black rounded-md outline-none'
                        type="text"
                        name='address'
                        value={localState.address}
                        onChange={handleInputChange}
                        placeholder='Address' />
                </div>
                <div className="phoneNumber w-full mb-4">
                    <input
                        className='w-full bg-[#F5F5F5] p-3 border border-black rounded-md outline-none'
                        type="text"
                        name='apartment'
                        value={localState.apartment}
                        onChange={handleInputChange}
                        placeholder='Apartment, Suit' />
                </div>
                <div className="location w-full flex space-x-4 mb-4">
                    <input
                        className='w-1/3 bg-[#F5F5F5] p-3 border border-black rounded-md outline-none'
                        type="email"
                        name='city'
                        value={localState.city}
                        onChange={handleInputChange}
                        placeholder='City' />
                    <input
                        className='w-1/3 bg-[#F5F5F5] p-3 border border-black rounded-md outline-none'
                        type="email"
                        name='state'
                        value={localState.state}
                        onChange={handleInputChange}
                        placeholder='State' />
                    <input
                        className='w-1/3 bg-[#F5F5F5] p-3 border border-black rounded-md outline-none'
                        type="emai2"
                        name='pinCode'
                        value={localState.pinCode}
                        onChange={handleInputChange}
                        placeholder='PIN Code' />
                </div>
            </div>
            <button
                onClick={handleUpdate}
                className={`px-10 py-2 bg-[#2C3E50] text-white flex items-center ${hasChanged ? '' : 'cursor-not-allowed'}`}
                disabled={!hasChanged}>
                {loading && <span className="loading -ml-2 mr-1 loading-spinner loading-md"></span>}
                <span>Save</span>
            </button>
        </div>
    )
}

export default Profile

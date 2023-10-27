import { roboto } from '@/app/utils/fonts'
import React from 'react'
import { BsBox } from 'react-icons/bs'
import { FaUser } from 'react-icons/fa'
import { SlLocationPin } from 'react-icons/sl'
import { AiOutlineUser } from 'react-icons/ai'

const ProfileNavigation = () => {
    return (
        <div className={` sticky top-24 h-[82vh] flex flex-col items-center py-10 px-5 border border-[#4D7E86] ${roboto.className}`}>
            <div className="userDetails flex items-center justify-center space-x-4 mb-10">
                <FaUser className='border-2 border-[#4D7E86] text-[#4D7E86] text-8xl p-2 rounded-full' />
                <div className="details">
                    <p className="name font-bold">Anna Smith</p>
                    <p className="email text-sm">Annas123@gmail.com</p>
                    <p className="number text-sm">+911231245645 </p>
                </div>
            </div>
            <div className="profile flex items-center space-x-4 bg-[#F5F5F5] p-3 rounded-md w-full mb-4">
                <AiOutlineUser className='border border-black rounded-full text-xl' />
                <p>My Profile</p>
            </div>
            <div className="orders flex items-center space-x-4 bg-[#F5F5F5] p-3 rounded-md w-full mb-4">
                <BsBox className=' text-xl' />
                <p>My Orders</p>
            </div>
            <div className="track flex items-center space-x-4 bg-[#F5F5F5] p-3 rounded-md w-full mb-4">
                <SlLocationPin className=' text-xl' />
                <p>Track My Order</p>
            </div>
        </div>
    )
}

export default ProfileNavigation

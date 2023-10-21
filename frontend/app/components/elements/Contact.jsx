import { bebas_neue } from '@/app/utils/fonts'
import React from 'react'

const Contact = () => {
    return (
        <div className='w-full lg:w-1/2 mx-auto my-10 flex flex-col items-center justify-center'>
            <h1 className={`${bebas_neue.className} text-6xl pb-10`}>Get in touch</h1>
            <div className="form w-full">
                <form className='flex px-2 flex-col space-y-4'>
                    <div className="nameEmail w-full flex space-x-4">
                        <input className='bg-[#A0CED6] w-1/2 outline-none placeholder:text-black placeholder:text-lg p-3' type="text" placeholder='Name' />
                        <input className='bg-[#A0CED6] w-1/2 outline-none placeholder:text-black placeholder:text-lg p-3' type="email" name="email" id="email" placeholder='Email Address' />
                    </div>
                    <div className="phoneNumber">
                        <input className='bg-[#A0CED6] w-full outline-none placeholder:text-black placeholder:text-lg p-3' type="text" placeholder='Phone Number' />
                    </div>
                    <textarea className='bg-[#A0CED6] w-full outline-none placeholder:text-black placeholder:text-lg p-3' name="message" id="message" cols="30" rows="7" placeholder='Message'></textarea>
                    <div className="button">
                        <button className='bg-[#2C3E50] py-2 px-8 text-white'>Send</button>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default Contact

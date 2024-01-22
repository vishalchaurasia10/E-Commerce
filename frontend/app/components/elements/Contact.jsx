'use client'
import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const SendEmail = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.phone || !formData.message) {
            toast.error('Please fill all fields');
            return;
        }

        const { name, email, phone, message } = formData;

        const emailData = {
            name,
            email,
            phone,
            message
        };

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData),
        };

        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sendemail`, options);
            const resp = await response.json();
            if (response.status == 200) {
                toast.success(resp.message);
            } else {
                toast.error(resp.message);
            }
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }

        setFormData({
            name: '',
            email: '',
            phone: '',
            message: ''
        });
    };

    return (
        <>
            <Toaster />
            <div className='w-full lg:w-1/2 mx-auto my-10 flex flex-col items-center justify-center'>
                <h1 className={`font-bebas_neue text-6xl pb-10`}>Get in touch</h1>
                <div className="form w-full">
                    <form className='flex px-2 flex-col space-y-4'>
                        <div className="nameEmail w-full flex space-x-4">
                            <input className='bg-[#A0CED6] w-1/2 outline-none placeholder:text-black placeholder:text-lg p-3' type="text" name='name' placeholder='Name' onChange={handleChange} value={formData.name} />
                            <input className='bg-[#A0CED6] w-1/2 outline-none placeholder:text-black placeholder:text-lg p-3' type="email" name="email" id="email" placeholder='Email Address' onChange={handleChange} value={formData.email} />
                        </div>
                        <div className="phoneNumber">
                            <input className='bg-[#A0CED6] w-full outline-none placeholder:text-black placeholder:text-lg p-3' type="text" name='phone' placeholder='Phone Number' onChange={handleChange} value={formData.phone} />
                        </div>
                        <textarea className='bg-[#A0CED6] w-full outline-none placeholder:text-black placeholder:text-lg p-3' name="message" id="message" cols="30" rows="7" placeholder='Message' onChange={handleChange} value={formData.message}></textarea>
                        <div className="button">
                            <button
                                onClick={SendEmail}
                                className='bg-[#2C3E50] px-8 text-white flex items-center space-x-1 py-2'>
                                {loading && <span className="loading -ml-2 mr-1 loading-spinner loading-sm"></span>}
                                <span>Send</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Contact;

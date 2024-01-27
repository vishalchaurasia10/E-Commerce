import Image from 'next/image'
import React from 'react'

const Team = () => {
    return (
        <div className='teams py-10 flex-col space-y-5'>
            <div className="team flex flex-col md:flex-row items-center justify-center md:space-x-2 lg:space-x-4 mx-2 md:mx-5 xl:mx-40 bg-[#4D7E86] text-white">
                <div className="md:w-1/2">
                    <Image src='/assets/teams/team.svg' alt="team" width={500} height={500} className="w-full h-full object-cover" />
                </div>
                <div className="description md:w-1/2 flex flex-col items-center justify-center space-y-4 py-10 md:py-0 px-10 lg:px-20">
                    <h1 className={`font-bebas_neue text-6xl`}>Our team</h1>
                    <p className='text-justify'>
                        Welcome to our Clothing and Apparel Store! Our passion for design has inspired us to create a collection of unique and creative t-shirts that are sure to make a statement. Our team is dedicated to bringing new and exciting designs to life, and we are proud to offer a variety of options for our customers.
                        Our t-shirts are made from organic 100% cotton, ensuring that they are both comfortable and environmentally friendly. We believe in using high-quality materials to create products that are not only stylish but also sustainable.
                    </p>
                    {/* <p className='text-justify'>
                        Our t-shirts are made from organic 100% cotton, ensuring that they are both comfortable and environmentally friendly. We believe in using high-quality materials to create products that are not only stylish but also sustainable.
                    </p>
                    <p className='text-justify'>
                        Whether you are looking for a bold graphic tee or a more subtle design, our store has something for everyone. Our team is always working on new ideas and designs, so be sure to check back often to see what's new.
                    </p>
                    <p className='text-justify'>
                        Thank you for choosing our Clothing and Apparel Store for all of your t-shirt needs. We hope that our passion for design and commitment to quality shines through in every product we offer
                    </p> */}
                </div>
            </div>
            <div className="team flex flex-col md:flex-row items-center justify-center md:space-x-2 lg:space-x-4 mx-2 md:mx-5 xl:mx-40 bg-[#4D7E86] text-white">
                <div className="md:w-1/2 order-1 md:order-2">
                    <Image src='/assets/teams/style.svg' alt="team" width={500} height={500} className="w-full h-full object-cover" loading='lazy' />
                </div>
                <div className="description order-2 md:order-1 md:w-1/2 flex flex-col items-center justify-center space-y-4 py-10 md:py-0 px-10 lg:px-20">
                    <h1 className={`font-bebas_neue text-6xl`}>Our Style</h1>
                    <p className='text-justify'>
                        At our shop, we believe that fashion should be comfortable and accessible to everyone. That's why we prioritize using high-quality materials in our clothing, without sacrificing affordability. Whether you're looking for a casual and cozy outfit or something more polished, we have something for you. We also strive to be as eco-friendly as possible, using sustainable fabrics and packaging materials. Our goal is to make you feel good about your purchase, both in terms of style and environmental impact. So come on in and browse our latest collection - we're confident you'll find something you love!
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Team

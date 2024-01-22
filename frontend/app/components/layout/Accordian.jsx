import { termsAndConditions } from '@/app/utils/constants'
import React from 'react'

const Accordian = () => {
    return (
        <div className="wrapper px-2 md:px-10 lg:px-40 py-10 text-white space-y-4">
            {termsAndConditions.map((item, index) => {
                return (
                    <div key={index} className="collapse collapse-arrow rounded-none">
                        <input type="radio" name="my-accordion-2" />
                        <div className={`font-bebas_neue collapse-title text-3xl font-medium bg-[#4D7E86]`}>
                            {item.title}
                        </div>
                        <div className="collapse-content bg-[#4D7E86] px-10">
                            <ul className='list-disc font-light'>
                                {item.description.map((desc, index) => {
                                    return (
                                        <li key={index}>
                                            {desc}
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Accordian
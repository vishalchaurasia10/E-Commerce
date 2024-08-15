import { announcementInfo } from '@/app/utils/constants'
import React from 'react'

const Announcement = () => {
    return (
        <div className={`text-xs tracking-widest font-medium text-center bg-[#587d85] text-white py-3`}>
            {announcementInfo.title}
        </div>
    )
}

export default Announcement

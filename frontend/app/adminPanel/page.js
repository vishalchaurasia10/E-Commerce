import React from 'react'
import UploadCategory from '../components/admin/UploadCategory'

const page = () => {
    return (
        <>
            <div className="tabs">
                <a className="tab tab-lifted">Tab 1</a>
                <a className="tab tab-lifted tab-active">Tab 2</a>
                <a className="tab tab-lifted">Tab 3</a>
            </div>
            <UploadCategory />
        </>
    )
}

export default page

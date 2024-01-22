import React from 'react'

const Loading = () => {
    return (
        <div className='h-screen w-full flex flex-col space-y-2 items-center justify-center'>
            <span className="loading loading-spinner loading-lg"></span>
            <span className={`font-roboto} text-xl`}>Loading</span>
        </div>
    )
}

export default Loading

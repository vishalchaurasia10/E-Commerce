import { bebas_neue } from '@/app/utils/fonts'
import React from 'react'

const TrackOrder = () => {
    return (
        <>
        <div>
            <h1 className={`${bebas_neue.className} text-4xl`}>Track Your Shipment</h1>
            <div className="inputId">
                <input type="text" placeholder='Shipment Id' />
            </div>
            <h2>Status</h2>
            <h1>Date</h1>
        </div>
        </>
    )
}

export default TrackOrder

'use client'
import { bebas_neue, roboto } from '@/app/utils/fonts'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FaArrowRightLong } from 'react-icons/fa6'
import { useSearchParams } from 'next/navigation'

const TrackOrder = () => {

    const [trackingDetails, setTrackingDetails] = useState(null)
    const [groupedDetails, setGroupedDetails] = useState(null)
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(false)
    const [shipmentId, setShipmentId] = useState(null)
    const searchParams = useSearchParams()
    const search = searchParams.get('shipmentId')

    const getAccessToken = async () => {
        setLoading(true)
        try {
            const response = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
                email: process.env.NEXT_PUBLIC_SHIPROCKET_EMAIL,
                password: process.env.NEXT_PUBLIC_SHIPROCKET_PASSWORD
            });
            setToken(response.data.token)
            console.log(response.data.token)
            await getTrackingDetails(response.data.token)
        } catch (error) {
            console.error("Error getting Shiprocket access token:", error.response ? error.response.data : error.message);
        } finally {
            setLoading(false)
        }
    }

    const getTrackingDetails = async (token) => {
        setLoading(true)
        try {
            const response = await axios.get(`https://apiv2.shiprocket.in/v1/external/courier/track/shipment/${shipmentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTrackingDetails(response.data.tracking_data)
        } catch (error) {
            console.error("Error getting Shiprocket tracking details:", error.response ? error.response.data : error.message);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (search) {
            setShipmentId(search)
            getAccessToken()
        }
    }, [])

    // useEffect(() => {
    //     if (token)
    //         getTrackingDetails(token)
    //     else if (shipmentId)
    //         getAccessToken()
    // }, [shipmentId])

    useEffect(() => {
        console.log(trackingDetails)
        if (trackingDetails && trackingDetails.track_status !== 0 && !trackingDetails.error) groupActivitiesByDate(trackingDetails?.shipment_track_activities)
    }, [trackingDetails])

    function groupActivitiesByDate(activities) {
        const groupedActivities = [];

        // Create a Map to store activities grouped by date
        const activitiesMap = new Map();

        activities.forEach((activity) => {
            // Extract the date from the activity
            const date = activity.date.split(' ')[0];

            // If the date is not in the Map, add it with an array containing the current activity
            if (!activitiesMap.has(date)) {
                activitiesMap.set(date, [activity]);
            } else {
                // If the date is already in the Map, push the current activity to the existing array
                activitiesMap.get(date).push(activity);
            }
        });

        // Convert the Map values (arrays of activities) to an array
        groupedActivities.push(...activitiesMap.values());

        console.log(groupedActivities)
        setGroupedDetails(groupedActivities)
        return groupedActivities;
    }

    // Function to format the date
    function formatDate(inputDate) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = new Date(inputDate).toLocaleDateString('en-US', options);
        return formattedDate;
    }

    // Function to format the time
    function formatTime(inputDate) {
        const options = { hour: 'numeric', minute: 'numeric', hour12: true };
        const formattedTime = new Date(inputDate).toLocaleTimeString('en-US', options);
        return formattedTime;
    }


    return (
        <>
            {loading ?
                <div className='flex items-center justify-center h-[70vh]'>
                    <div className="loading loading-spinner loading-lg"></div>
                </div>
                :
                <div className='flex flex-col items-center justify-center'>
                    <h1 className={`${bebas_neue.className} text-4xl py-5`}>Track Your Shipment</h1>
                    <div className="inputId py-5 flex items-center">
                        <input
                            className='bg-[#4D7E86] text-white placeholder:text-white outline-none p-3'
                            type="text"
                            value={shipmentId}
                            onChange={(e) => setShipmentId(e.target.value)}
                            name='shipmentId'
                            placeholder='Enter Shipment Id' />
                        <button
                            onClick={() => {
                                if (shipmentId) {
                                    if (token)
                                        getTrackingDetails(token)
                                    else
                                        getAccessToken()
                                }
                            }}
                            className='bg-[#4D7E86] text-4xl py-[0.36rem] pr-2 text-white'>
                            <FaArrowRightLong />
                        </button>
                    </div>
                    {shipmentId && trackingDetails &&
                        <>
                            <h2 className={`${roboto.className} font-extrabold text-xl md:text-2xl pt-5 pb-3`}>
                                {trackingDetails.track_status !== 0 ? trackingDetails?.shipment_track[0]?.current_status : 'Confirmed'}
                            </h2>
                            <h1 className='font-medium text-2xl md:text-3xl text-center'>
                                {
                                    trackingDetails.track_status !== 0 ? (trackingDetails?.shipment_track[0]?.edd === null ?
                                        (trackingDetails?.shipment_track[0]?.delivered_date ?
                                            `Delivered: ${formatDate(trackingDetails?.shipment_track[0]?.delivered_date)} at ${formatTime(trackingDetails?.shipment_track[0]?.delivered_date)}` : 'Est. Delivery Date: N/A')
                                        : `Est. Delivery Date:  ${formatDate(trackingDetails?.shipment_track[0]?.edd)} at ${formatTime(trackingDetails?.shipment_track[0]?.edd)}`) :
                                        'Your order has been confirmed. Tracking is not available yet.'
                                }
                            </h1>
                            <ul className="timeline py-5 w-full">
                                <li className='w-1/4'>
                                    <div className="w-1/4"></div>
                                    <div className="timeline-middle">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-[#4D7E86]"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                                    </div>
                                    <hr className={`${trackingDetails?.shipment_status >= 0 ? 'bg-[#4D7E86]' : ''}`} />
                                </li>
                                <li className='w-1/4'>
                                    <hr className={`${trackingDetails?.shipment_status >= 2 ? 'bg-[#4D7E86]' : ''}`} />
                                    <div className="timeline-middle">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-[#4D7E86]"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                                    </div>
                                    <div className="timeline-end w-1/2"></div>
                                    <hr className={`${trackingDetails?.shipment_status >= 4 ? 'bg-[#4D7E86]' : ''}`} />
                                </li>
                                <li className='w-1/4'>
                                    <hr className={`${trackingDetails?.shipment_status >= 5 ? 'bg-[#4D7E86]' : ''}`} />
                                    <div className="timeline-end w-1/2"></div>
                                    <div className="timeline-middle">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-[#4D7E86]"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                                    </div>
                                    <hr className={`${trackingDetails?.shipment_status >= 6 ? 'bg-[#4D7E86]' : ''}`} />
                                </li>
                                <li className='w-1/4'>
                                    <hr className={`${trackingDetails?.shipment_status >= 7 ? 'bg-[#4D7E86]' : ''}`} />
                                    <div className="timeline-end w-1/2"></div>
                                    <div className="timeline-middle">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-[#4D7E86]"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                                    </div>
                                </li>
                            </ul>
                            {trackingDetails.track_status !== 0 && <div className="fromto flex items-center justify-between w-full md:w-1/2 md:mx-auto py-16 px-10 md:px-0">
                                <div className="from">
                                    <p className='font-bold text-lg'>From</p>
                                    <p>{trackingDetails?.shipment_track[0]?.origin}, India</p>
                                </div>
                                <div className="to">
                                    <p className='font-bold text-lg'>To</p>
                                    <p>{trackingDetails?.shipment_track[0]?.destination}, India</p>
                                </div>
                            </div>}
                            <div className="shipmentHistory w-full mb-5 md:mb-10 md:px-6 lg:px-40">
                                <h1 className='font-bold text-xl pb-2'>Shipment History</h1>
                                <div className="history flex flex-col space-y-6 w-full">
                                    {
                                        groupedDetails ?
                                            groupedDetails.map((group, index) => {
                                                return (
                                                    <div className="group w-full" key={index}>
                                                        <h1 className='py-2 px-4 text-white bg-[#4D7E86]'>{formatDate(group[0].date)}</h1>
                                                        <div className="activities py-2 md:px-10 bg-[#F1EEEE] overflow-x-auto w-full">
                                                            <table className="table w-full">
                                                                {
                                                                    group.map((activity, index) => {
                                                                        return (
                                                                            <tr key={index}>
                                                                                <td className='w-1/4'>{formatTime(activity.date)}</td>
                                                                                <td className='w-1/3'>{activity.location.length === 0 ? 'N/A' : activity.location}</td>
                                                                                <td className='w-1/3'>{activity.activity.length === 0 ? 'N/A' : activity.activity}</td>
                                                                            </tr>
                                                                        )
                                                                    })
                                                                }
                                                            </table>
                                                        </div>
                                                    </div>
                                                )
                                            }) :
                                            <div className="group w-full">
                                                <h1 className='py-2 px-4 text-white bg-[#4D7E86]'></h1>
                                                <div className="activities py-2 md:px-10 bg-[#F1EEEE] overflow-x-auto w-full">
                                                    <table className="table w-full">
                                                        <tr>
                                                            <td className='w-1/4'>N/A</td>
                                                            <td className='w-1/3'>N/A</td>
                                                            <td className='w-1/3'>N/A</td>
                                                        </tr>
                                                    </table>
                                                </div>
                                            </div>
                                    }
                                </div>
                            </div>
                        </>}
                </div>}
        </>
    )
}

export default TrackOrder

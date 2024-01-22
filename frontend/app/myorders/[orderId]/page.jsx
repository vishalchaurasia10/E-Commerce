'use client'
import React, { useContext, useEffect, useState } from 'react'
import authContext from '../../context/Auth/authContext'
import { useRouter } from 'next/navigation'
import ProfileNavigation from '../../components/layout/ProfileNavigation'
import SingleOrder from '@/app/components/content/SingleOrder'

const page = ({ params }) => {
    const [showSidebar, setShowSidebar] = useState(false)
    const { user } = useContext(authContext)
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        if (!user) {
            router.push('/sign-in')
        }
    }, [user])

    useEffect(() => {
        const getOrder = async () => {
            try {
                setLoading(true)
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${params.orderId}`)
                const data = await res.json()
                setOrder(data)
                if (data.error) throw new Error(data.error)
            } catch (err) {
                console.log(err)
                toast.error(err.message)
            } finally {
                setLoading(false)
            }
        }
        getOrder()
    }, [])

    return (
        <>
            {loading ?
                <div className="w-full min-h-screen -mt-20 my-10 flex items-center justify-center">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
                :
                <div className={`profileWrapper font-roboto flex lg:space-x-4 px-2 pt-4 lg:pt-0 lg:px-40`}>
                    <div className={`profileNavigation ${showSidebar ? '' : 'translate-x-[30rem] scale-0 lg:scale-100'} left-0 lg:translate-x-0 duration-700 transition-all absolute lg:static bg-white w-full lg:w-1/4`}>
                        <ProfileNavigation user={user} />
                    </div>
                    <div className="profileContent mx-auto lg:w-3/4">
                        <SingleOrder order={order} setShowSidebar={setShowSidebar} showSidebar={showSidebar} />
                    </div>
                </div>}
        </>
    )
}

export default page

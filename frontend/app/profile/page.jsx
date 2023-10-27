'use client'
import React, { useContext, useEffect, useState } from 'react'
import authContext from '../context/Auth/authContext'
import { useRouter } from 'next/navigation'
import Profile from '../components/content/Profile'
import ProfileNavigation from '../components/layout/ProfileNavigation'
import { roboto } from '../utils/fonts'

const page = () => {
    const [showSidebar, setShowSidebar] = useState(false)
    const { user } = useContext(authContext)
    const router = useRouter()
    console.log(user)

    useEffect(() => {
        if (!user) {
            router.push('/sign-in')
        }
    }, [user])

    return (
        <>
            <div className={`profileWrapper ${roboto.className} flex lg:space-x-4 px-2 pt-4 lg:pt-0 lg:px-40`}>
                <div className={`profileNavigation ${showSidebar?'':'translate-x-[30rem] scale-0 lg:scale-100'} left-0 lg:translate-x-0 duration-700 transition-all absolute lg:static bg-white w-full lg:w-1/4`}>
                    <ProfileNavigation user={user} />
                </div>
                <div className="profileContent mx-auto lg:w-3/4">
                    <Profile user={user} setShowSidebar={setShowSidebar} showSidebar={showSidebar} />
                </div>
            </div>
        </>
    )
}

export default page

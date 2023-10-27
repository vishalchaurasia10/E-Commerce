'use client'
import React, { useContext, useEffect } from 'react'
import authContext from '../context/Auth/authContext'
import { useRouter } from 'next/navigation'
import Profile from '../components/content/Profile'
import ProfileNavigation from '../components/layout/ProfileNavigation'
import { roboto } from '../utils/fonts'

const page = () => {
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
            <div className={`profileWrapper ${roboto.className} flex space-x-4 px-40`}>
                <div className="profileNavigation w-1/4">
                    <ProfileNavigation />
                </div>
                <div className="profileContent w-3/4">
                    <Profile user={user} />
                </div>
            </div>
        </>
    )
}

export default page

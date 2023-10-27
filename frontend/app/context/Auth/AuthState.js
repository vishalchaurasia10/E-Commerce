'use client'
import { toast, Toaster } from "react-hot-toast";
import AuthContext from "./authContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AuthState = (props) => {

    const [user, setUser] = useState(null);

    const router = useRouter();

    useEffect(() => {
        verifyAccessToken();
    }, []);

    const signUp = async (email, password) => {
        try {
            const user = {
                email,
                password
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user),
            });
            const data = await response.json();
            if (data._id) {
                toast.success('User created successfully!');
                router.push('/sign-in');
            } else {
                toast.error(data.error)
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const signIn = async (email, password) => {
        try {
            const user = {
                email,
                password
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user),
            });
            const data = await response.json();
            if (data.token) {
                toast.success('Logged in successfully!');
                localStorage.setItem('accessToken', data.token);
                setUser(data.user);
                router.push('/profile');
            } else {
                toast.error(data.error)
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const verifyAccessToken = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/verifyjwt`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            const data = await response.json();
            if (data.user) {
                const userId = data.user._id;
                fetchUserDetails(userId);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const fetchUserDetails = async (userId) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`);
            const data = await response.json();
            if (data._id) {
                setUser(data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const updateUserDetails = async (userId, updatedUser) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedUser),
            });
            const data = await response.json();
            if (data._id) {
                setUser(data);
                toast.success('User updated successfully!');
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <>
            <Toaster />
            <AuthContext.Provider
                value={{
                    signUp,
                    signIn,
                    verifyAccessToken,
                    updateUserDetails,
                    user
                }}>
                {props.children}
            </AuthContext.Provider>
        </>
    )
}

export default AuthState;
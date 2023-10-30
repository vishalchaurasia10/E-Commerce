'use client'
import { toast, Toaster } from "react-hot-toast";
import AuthContext from "./authContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AuthState = (props) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        verifyAccessToken();
    }, []);

    const signUp = async (email, password) => {
        try {
            setLoading(true);
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
        } finally {
            setLoading(false);
        }
    }

    const signIn = async (email, password) => {
        try {
            setLoading(true);
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
        } finally {
            setLoading(false);
        }
    }

    const verifyAccessToken = async () => {
        try {
            setLoading(true);
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
        } finally {
            setLoading(false);
        }
    }

    const fetchUserDetails = async (userId) => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`);
            const data = await response.json();
            if (data._id) {
                setUser(data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const updateUserDetails = async (userId, updatedUser) => {
        try {
            setLoading(true);
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
        } finally {
            setLoading(false);
        }
    }

    const uploadProfileImage = async (userId, file) => {
        try {
            setLoading(true);
            if (!file) {
                return { status: 'failure', message: 'No file Selected' }
            }

            const formData = new FormData();
            formData.append('file', file);

            const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/upload/${userId}`, {
                method: 'POST',
                body: formData,
            });

            if (result.status === 200) {
                const data = await result.json();
                toast.success(data.message)
                setUser((prevUser) => ({ ...prevUser, profileImageId: data.fileId }));
            } else {
                return { status: 'failure', message: 'Error uploading file' };
            }
        } catch (error) {
            return { status: 'failure', message: error.message };
        } finally {
            setLoading(false);
        }
    }

    const signOut = () => {
        localStorage.removeItem('accessToken');
        setUser(null);
        router.push('/sign-in');
    }

    const googleAuth = () => {
        try {
            window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/users/auth/google`;
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
                    uploadProfileImage,
                    signOut,
                    googleAuth,
                    user,
                    loading
                }}>
                {props.children}
            </AuthContext.Provider>
        </>
    )
}

export default AuthState;
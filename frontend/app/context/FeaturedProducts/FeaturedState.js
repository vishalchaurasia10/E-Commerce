'use client'
import toast, { Toaster } from "react-hot-toast";
import FeaturedContext from "./featuredContext";
import { useState } from "react";

const FeaturedState = (props) => {

    // const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const getFeaturedProducts = async (page) => {
        try {
            setLoading(true);
            const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/featured?page=${page}`);
            const data = await result.json();
            setLoading(false);
            return data;
        } catch (error) {
            toast.error(error.message)
            setLoading(false);
        }
    }

    return (
        <>
            <Toaster />
            <FeaturedContext.Provider
                value={{
                    getFeaturedProducts, loading
                }}
            >
                {props.children}
            </FeaturedContext.Provider>
        </>
    );
}

export default FeaturedState;
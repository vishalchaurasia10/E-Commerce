'use client'
import toast, { Toaster } from "react-hot-toast";
import FeaturedContext from "./featuredContext";
import { useState } from "react";

const FeaturedState = (props) => {

    const [featuredProducts, setFeaturedProducts] = useState([]);

    const getFeaturedProducts = async () => {
        try {
            const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/featured`);
            const data = await result.json();
            if (result.status === 200) {
                setFeaturedProducts(data);
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <>
            <Toaster />
            <FeaturedContext.Provider
                value={{
                    featuredProducts, getFeaturedProducts
                }}
            >
                {props.children}
            </FeaturedContext.Provider>
        </>
    );
}

export default FeaturedState;
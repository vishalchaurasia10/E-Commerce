'use client'
import { useState } from "react";
import ProductContext from "./productContext";
import { toast, Toaster } from "react-hot-toast";

const ProductState = (props) => {

    const [products, setProducts] = useState([])

    const getAllProducts = async () => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/products`
            const response = await fetch(url)
            const data = await response.json()
            setProducts(data)
            return data
        } catch (error) {
            console.log(error)
        }
    }

    const searchProducts = async (search) => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/products/search/?query=${search}`
            const response = await fetch(url)
            const data = await response.json()
            return data
        } catch (error) {
            console.log(error)
            toast.error('Error searching products')
        }
    }

    const searchProductsByType = async (type) => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/products/type/${type}`
            const response = await fetch(url)
            const data = await response.json()
            return data
        } catch (error) {
            console.log(error)
            toast.error('Error searching products')
        }
    }

    const searchProductsByCategory = async (categoryId) => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/products/category/${categoryId}`
            const response = await fetch(url)
            const data = await response.json()
            return data
        } catch (error) {
            console.log(error)
            toast.error('Error searching products')
        }
    }

    return (
        <>
            <Toaster />
            <ProductContext.Provider
                value={{
                    products, getAllProducts, setProducts, searchProducts, searchProductsByType, searchProductsByCategory
                }}>
                {props.children}
            </ProductContext.Provider>
        </>
    )
}

export default ProductState;
'use client'
import { useState } from "react";
import ProductContext from "./productContext";
import { toast, Toaster } from "react-hot-toast";

const ProductState = (props) => {

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)

    const getAllProducts = async () => {
        try {
            setLoading(true)
            const url = `${process.env.NEXT_PUBLIC_API_URL}/products`
            const response = await fetch(url)
            const data = await response.json()
            setProducts(data)
            return data
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const getProductsWithPagination = async (page) => {
        try{
            setLoading(true)
            const url = `${process.env.NEXT_PUBLIC_API_URL}/products/page?page=${page}`
            const response = await fetch(url)
            const data = await response.json()
            setProducts(data.products)
            return data
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const searchProducts = async (search) => {
        try {
            setLoading(true)
            const url = `${process.env.NEXT_PUBLIC_API_URL}/products/search/?query=${search}`
            const response = await fetch(url)
            const data = await response.json()
            return data
        } catch (error) {
            console.log(error)
            toast.error('Error searching products')
        } finally {
            setLoading(false)
        }
    }

    const searchProductsByType = async (type,page) => {
        try {
            setLoading(true)
            const url = `${process.env.NEXT_PUBLIC_API_URL}/products/type/${type}?page=${page}`
            const response = await fetch(url)
            const data = await response.json()
            return data
        } catch (error) {
            console.log(error)
            toast.error('Error searching products')
        } finally {
            setLoading(false)
        }
    }

    const searchProductsByCategory = async (categoryId,page) => {
        try {
            setLoading(true)
            const url = `${process.env.NEXT_PUBLIC_API_URL}/products/category/${categoryId}?page=${page}`
            const response = await fetch(url)
            const data = await response.json()
            return data
        } catch (error) {
            console.log(error)
            toast.error('Error searching products')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Toaster />
            <ProductContext.Provider
                value={{
                    products,
                    loading,
                    getAllProducts,
                    setProducts,
                    searchProducts,
                    searchProductsByType,
                    searchProductsByCategory,
                    getProductsWithPagination
                }}>
                {props.children}
            </ProductContext.Provider>
        </>
    )
}

export default ProductState;
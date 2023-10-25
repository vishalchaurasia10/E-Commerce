'use client'
import { useState } from "react";
import ProductContext from "./productContext";

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

    return (
        <ProductContext.Provider
            value={{
                products, getAllProducts, setProducts
            }}>
            {props.children}
        </ProductContext.Provider>
    )
}

export default ProductState;
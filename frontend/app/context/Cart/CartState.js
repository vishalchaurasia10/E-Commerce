'use client'
import { useEffect, useState } from "react";
import CartContext from "./cartContext";
import { toast, Toaster } from "react-hot-toast";

const CartState = (props) => {
    const [cart, setCart] = useState([]);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        // Retrieve the cart data from local storage and set it in the state
        const cartData = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(cartData);

        // Calculate and set the cart count based on the cart data
        const totalCount = cartData.reduce((total, item) => total + item.quantity, 0);
        setCartCount(totalCount);
    }, []);

    const addToCart = (product, size, quantity, color) => {
        // Retrieve the current cart data from local storage or initialize an empty array
        const existingCart = JSON.parse(localStorage.getItem('cart')) || [];

        // Check if the product is already in the cart
        const existingProductIndex = existingCart.findIndex(
            (item) => item.product._id === product._id && item.size === size && item.color === color
        );

        if (existingProductIndex !== -1) {
            // Product with the same ID and size is already in the cart
            existingCart[existingProductIndex].quantity += quantity;
        } else {
            // Product is not in the cart, add it
            existingCart.push({ product, size, quantity, color });
        }

        // Save the updated cart data to local storage
        localStorage.setItem('cart', JSON.stringify(existingCart));

        // Update the state with the new cart data
        setCart(existingCart);

        // Calculate and set the updated cart count
        const totalCount = existingCart.reduce((total, item) => total + item.quantity, 0);
        setCartCount(totalCount);

        toast.success('Product added to cart');
    };



    const removeFromCart = (product, size, color) => {
        // Retrieve the current cart data from local storage or initialize an empty array
        const existingCart = JSON.parse(localStorage.getItem('cart')) || [];

        // Find the index of the item to remove
        const itemIndex = existingCart.findIndex(
            (item) => item.product._id === product._id && item.size === size && item.color === color
        );

        if (itemIndex !== -1) {
            // Remove the item from the cart
            existingCart.splice(itemIndex, 1);

            // Save the updated cart data to local storage
            localStorage.setItem('cart', JSON.stringify(existingCart));

            // Update the state with the new cart data
            setCart(existingCart);

            // Calculate and set the updated cart count
            const totalCount = existingCart.reduce((total, item) => total + item.quantity, 0);
            setCartCount(totalCount);

            toast.success('Product removed from cart');
        }
    };


    const decreaseQuantity = (product, size, color) => {
        // Retrieve the current cart data from local storage or initialize an empty array
        const existingCart = JSON.parse(localStorage.getItem('cart')) || [];

        // Find the item in the cart
        const item = existingCart.find(
            (item) => item.product._id === product._id && item.size === size && item.color === color
        );

        if (item) {
            // Decrease the quantity of the item by 1
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                // If the quantity is 1, remove the item from the cart
                existingCart.splice(existingCart.indexOf(item), 1);
            }

            // Save the updated cart data to local storage
            localStorage.setItem('cart', JSON.stringify(existingCart));

            // Update the state with the new cart data
            setCart(existingCart);

            // Calculate and set the updated cart count
            const totalCount = existingCart.reduce((total, item) => total + item.quantity, 0);
            setCartCount(totalCount);
        }
    };



    return (
        <>
            <Toaster />
            <CartContext.Provider
                value={{
                    cart,
                    addToCart,
                    removeFromCart,
                    decreaseQuantity,
                    cartCount,
                }}>
                {props.children}
            </CartContext.Provider>
        </>
    );
}

export default CartState;
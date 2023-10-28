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

    const addToCart = (product, size, quantity) => {
        // Retrieve the current cart data from local storage or initialize an empty array
        const existingCart = JSON.parse(localStorage.getItem('cart')) || [];

        // Check if the product is already in the cart
        const existingProductIndex = existingCart.findIndex(
            (item) => item._id === product._id && item.size === size
        );

        if (existingProductIndex !== -1) {
            // Product with the same ID and size is already in the cart
            existingCart[existingProductIndex].quantity += quantity;
        } else {
            // Product is not in the cart, add it
            existingCart.push({ id: product._id, size, quantity });
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



    const removeFromCart = (product) => {
        setCart(cart.filter((item) => item.id !== product.id));
        toast.success('Product removed from cart');
        updateCartCount();
    }

    const updateCartCount = () => {
        let itemCount = 0;
        cart.forEach((item) => {
            itemCount += item.quantity;
        });
        setCartCount(itemCount); // Update the cartCount state
    };


    return (
        <>
            <Toaster />
            <CartContext.Provider
                value={{
                    cart,
                    addToCart,
                    removeFromCart,
                    cartCount,
                }}>
                {props.children}
            </CartContext.Provider>
        </>
    );
}

export default CartState;
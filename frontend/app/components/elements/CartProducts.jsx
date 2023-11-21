import { roboto } from '@/app/layout'
import Image from 'next/image'
import React, { useContext } from 'react'
import { FaTrash } from 'react-icons/fa'
import { FiMinus, FiPlus } from 'react-icons/fi'
import CartContext from '@/app/context/Cart/cartContext'

const CartProducts = ({ item }) => {

    const { cart, addToCart, removeFromCart, decreaseQuantity } = useContext(CartContext);

    return (
        <>
            <div className={`cartProduct ${roboto.className} flex flex-col md:flex-row`}>
                <div className="image mb-4 lg:mb-0 md:mr-3 lg:mr-6 md:w-[35%]">
                    <Image className='rounded-lg w-full' src={`http://localhost:8000/uploads/products/${item?.product?.imageId[0]}`} alt={item.title} width={200} height={200} />
                </div>
                <div className="details space-y-1 lg:mr-6 md:mr-3 md:w-[75%]">
                    <h1 className='font-bold text-2xl pb-1'>{item?.product?.title}</h1>
                    <p className='font-bold lg:font-medium text-lg'>Price: ₹ {item?.product?.price}</p>
                    <p className='font-bold lg:font-medium text-lg'>Size: {item?.size}</p>
                    <div className='flex space-x-2 items-center'>
                        <p className='font-bold lg:font-medium text-lg'>Color:</p>
                        <button
                            className={`rounded-full w-6 h-6 lg:mr-2 border border-black}`}
                            style={{ backgroundColor: `#${item?.color}` }}
                        ></button>
                    </div>
                    <div onClick={() => removeFromCart(item.product, item.size, item.color)} className="remove flex space-x-2 items-center pt-2 cursor-pointer w-fit">
                        <FaTrash className='cursor-pointer' />
                        <p className='font-bold text-lg'>Remove</p>
                    </div>
                </div>
                <div className="buttons border border-black flex items-center h-fit px-2 w-fit mt-5 lg:mt-0 lg:w-[10%]">
                    <FiMinus onClick={() => decreaseQuantity(item.product, item.size, item.color)} className='cursor-pointer' />
                    <button className='px-3 py-1'>{item?.quantity}</button>
                    <FiPlus onClick={() => addToCart(item.product, item.size, 1, item.color)} className='cursor-pointer' />
                </div>
            </div>
            <div className="divider bg-[#4D7E86] h-[0.05rem]"></div>
        </>
    )
}

export default CartProducts

import { roboto } from '@/app/utils/fonts'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import authContext from '@/app/context/Auth/authContext'
import Image from 'next/image'
import { formatDate } from './Orders'
import { FaCircleExclamation } from 'react-icons/fa6'
import { toast, Toaster } from 'react-hot-toast'

const SingleOrder = ({ order, setShowSidebar, showSidebar }) => {
    const [products, setProducts] = useState([]);
    const router = useRouter();
    const { user } = useContext(authContext);

    const getProducts = async () => {
        const productDetails = order.products.map((product) => ({
            id: product._id,
            color: product.color,
            size: product.size,
        }));

        const uniqueProducts = [];
        const productSet = new Set();

        for (const details of productDetails) {
            const { id, color, size } = details;
            const productKey = `${id}-${color}-${size}`;

            try {
                if (productSet.has(productKey)) continue; // Skip if combination already added

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
                const data = await response.json();

                productSet.add(productKey);
                uniqueProducts.push(data);
            } catch (error) {
                console.log(error);
            }
        }

        setProducts(uniqueProducts);
    };

    const cancelOrder = async (orderId) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/cancel/${orderId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (response.status === 200) {
                toast.success(data.message);
                router.push('/myorders');
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };



    useEffect(() => {
        if (!user) {
            router.push('/sign-in');
        } else {
            getProducts();
        }
    }, [user]);

    return (
        <>
            <Toaster />
            {user && products.length > 0 && order &&
                <div className='h-full py-6 lg:py-10 px-3 lg:px-5 border border-[#4D7E86]'>
                    <div className="hamburger pb-3 lg:hidden">
                        <svg onClick={() => setShowSidebar(!showSidebar)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block relative bg-white z-30 w-8 h-8 stroke-current lg:hidden"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </div>
                    <div className="orderDetails mb-8">
                        <div className='flex items-center space-x-2 mb-6'>
                            <h1 className='font-bold text-2xl'>Tracking OrderId : {order.shiprocketOrderId}</h1>
                        </div>
                        <div className="description flex flex-col space-y-1 pb-10">
                            <p className='text-sm'><span className='font-bold'>OrderedAt:</span> {formatDate(order.createdAt)}</p>
                            <p><span className='font-bold'>Order Status:</span> {order.status}</p>
                            <p><span className='font-bold'>Name:</span> {order.firstName} {order.lastName}</p>
                            <p><span className='font-bold'>Email:</span> {user.email}</p>
                            <p><span className='font-bold'>Phone:</span> {order.phoneNumber}</p>
                            <p><span className='font-bold'>Shipping Address:</span> {order.address}, {order.city}, {order.state}, {order.pinCode}</p>
                            <p><span className='font-bold'>Amount Paid:</span> ₹{order.paidAmount / 100}</p>
                            <div className="buttons space-x-2">
                                <button
                                    disabled={order.status === 'cancelled' || order.status === 'delivered'}
                                    onClick={() => document.getElementById('cancelModal').showModal()}
                                    className={`bg-[#4D7E86] hover:bg-red-500 btn text-white rounded-sm px-3`}>
                                    Cancel Order
                                </button>
                                <button className='bg-[#4D7E86] btn hover:bg-black text-white rounded-sm px-3'>Return Order</button>
                            </div>
                            <dialog id="cancelModal" className="modal">
                                <div className="modal-box">
                                    <h3 className="font-bold text-lg flex items-center">
                                        <FaCircleExclamation className="inline-block mr-2 text-2xl text-red-500" />
                                        <span className='text-xl'>
                                            Cancel Order
                                        </span>
                                    </h3>
                                    <p className="py-4">Are you sure, you want to cancel the order?</p>
                                    <div className="modal-action">
                                        <form className='space-x-2' method="dialog">
                                            {/* if there is a button in form, it will close the modal */}
                                            <button onClick={() => cancelOrder(order._id)} className="btn btn-neutral">Cancel Order</button>
                                            <button className="btn">Close</button>
                                        </form>
                                    </div>
                                </div>
                            </dialog>
                        </div>
                        {
                            products.length > 0 && products.map((product, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <div className={`cartProduct ${roboto.className} flex flex-col md:flex-row`}>
                                            <div className="image mb-4 lg:mb-0 md:mr-3 lg:mr-6 md:w-[35%]">
                                                <Image className='rounded-lg w-full' src={`http://localhost:8000/uploads/products/${product?.imageId[0]}`} alt={product.title} width={200} height={200} />
                                            </div>
                                            <div className="details space-y-1 lg:mr-6 md:mr-3 md:w-[75%]">
                                                <h1 className='font-bold text-2xl pb-1'>{product?.title}</h1>
                                                <p className='font-bold lg:font-medium text-lg'>Price: ₹ {product?.price}</p>
                                                <p className='font-bold lg:font-medium text-lg'>Size: {order.products[index]?.size}</p>
                                                <div className='flex space-x-2 items-center'>
                                                    <p className='font-bold lg:font-medium text-lg'>Color:</p>
                                                    <button
                                                        className={`rounded-full w-6 h-6 lg:mr-2 border border-black}`}
                                                        style={{ backgroundColor: `#${order.products[index]?.color}` }}
                                                    ></button>
                                                </div>
                                            </div>
                                            <div className="buttons border border-black flex items-center h-fit px-2 w-fit mt-5 lg:mt-0 lg:w-[15%]">
                                                <p className='font-bold lg:font-medium text-lg whitespace-nowrap'>Quantity: {order.products[index]?.quantity}</p>
                                            </div>
                                        </div>
                                        <div className="divider bg-[#4D7E86] h-[0.05rem]"></div>
                                    </React.Fragment>
                                )
                            })

                        }
                    </div>
                </div>
            }
        </>
    )
}

export default SingleOrder

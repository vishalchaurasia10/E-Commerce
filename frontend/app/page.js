'use client'
import { useEffect, useState } from "react";
import FeaturedProduct from "./components/Featured/FeaturedProduct";
import Category from "./components/categories/Category";
import Banner from "./components/content/Banner";
import WhyChoose from "./components/content/WhyChoose";
import Carousel from "./components/elements/Carousel";
import Company from "./components/elements/Company";
import Contact from "./components/elements/Contact";
import Team from "./components/elements/Team";
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);
  return (
    <>
      {loading && (
        <AnimatePresence>
          <motion.div
            initial={{ scale: 1, }}
            animate={{ scale: 1, }}
            exit={{ scale: 0, }}
            transition={{ duration: 1 }}
            className="h-screen fixed top-0 left-0 w-full z-50 bg-white flex items-center justify-center space-x-4"
          >
            <span className="loading loading-spinner loading-lg"></span>
            <p className="font-bold text-xl">Loading...</p>
          </motion.div>
        </AnimatePresence>
      )}
      <>
        <Banner url="bannerHome.svg" />
        <FeaturedProduct />
        <Category />
        <Team />
        <Carousel />
        <WhyChoose />
        <Company />
        <Contact />
      </>
    </>
  )
}

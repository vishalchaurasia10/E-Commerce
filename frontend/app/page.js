import FeaturedProduct from "./components/Featured/FeaturedProduct";
import Category from "./components/categories/Category";
import Banner from "./components/content/Banner";
import WhyChoose from "./components/content/WhyChoose";
import Carousel from "./components/elements/Carousel";
import Company from "./components/elements/Company";
import Contact from "./components/elements/Contact";
import Team from "./components/elements/Team";
import HomeLoading from "./components/layout/HomeLoading";

export const metadata = {
  metadataBase: new URL('https://forever-trendin.vercel.app/'),
  title: 'Clothing and Apparel Store - Forever TrendIn',
  description: 'The One-stop Destination for apparel and lifestyle products. Clothing and Apparel Store',
  themeColor: '#4e7f88',
  alternates: {
    canonical: 'https://forever-trendin.vercel.app/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forever TrendIn',
    description: 'The One-stop Destination for apparel and lifestyle products. Clothing and Apparel Store',
    site: '@ForeverTrendin',
    creator: '@forevertrendin',
    images: ['https://img1.wsimg.com/isteam/stock/2751'],
  },
  verification: {
    google: 'bCk4fM26lCFui0qVponCBR4EnBU6FNoUGWI8QIeaeXs',
  },
  openGraph: {
    url: 'https://forever-trendin.vercel.app/',
    title: 'Forever TrendIn',
    description: 'The One-stop Destination for apparel and lifestyle products. Clothing and Apparel Store',
    images: [
      {
        url: 'https://img1.wsimg.com/isteam/stock/2751',
        width: 800,
        height: 600,
        alt: 'Forever TrendIn',
      },
    ],
    site_name: 'Forever TrendIn',
    type: 'website',
    locale: 'en_IN',
  },
}

export default function Home() {

  return (
    <>
      <HomeLoading />
      <Banner url="bannerHome.svg" />
      <FeaturedProduct />
      <Category />
      <Team />
      <Carousel />
      <WhyChoose />
      <Company />
      <Contact />
    </>
  )
}

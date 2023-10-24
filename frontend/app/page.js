import FeaturedProduct from "./components/Featured/FeaturedProduct";
import Category from "./components/categories/Category";
import Banner from "./components/content/Banner";
import WhyChoose from "./components/content/WhyChoose";
import Carousel from "./components/elements/Carousel";
import Company from "./components/elements/Company";
import Contact from "./components/elements/Contact";
import Team from "./components/elements/Team";

export default function Home() {
  return (
    <>
      <Banner url='bannerHome.svg' />
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

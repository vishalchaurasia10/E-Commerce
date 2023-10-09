import FeaturedProduct from "./components/Featured/FeaturedProduct";
import Category from "./components/categories/Category";
import Banner from "./components/content/Banner";
import Carousel from "./components/elements/Carousel";
import Team from "./components/elements/Team";

export default function Home() {
  return (
    <>
      <Banner />
      {/* <FeaturedProduct /> */}
      <Category />
      <Team />
      <Carousel />
    </>
  )
}

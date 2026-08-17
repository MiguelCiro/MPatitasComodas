import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

import Hero from "@/sections/Hero/Hero";
import HeroSlider from "@/components/HeroSlider/HeroSlider";

import FeaturedProducts from "@/sections/FeaturedProducts/FeaturedProducts";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />

        <HeroSlider />

        <FeaturedProducts />

      </main>

      <Footer />
    </>
  );
}
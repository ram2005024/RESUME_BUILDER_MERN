import React from "react";
import Banner from "../components/Home/Banner";
import Hero from "../components/Home/Hero";
import Features from "../components/Home/Features";
import Testimonials from "../components/Home/Testimonials";
import Footer from "../components/Home/Footer";
import Contact from "../components/Home/Contact";

const Home = () => {
  return (
    <div className="w-screen h-screen ">
      <Banner />
      <Hero />
      <Features />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;

import React from "react";
import Banner from "../components/Banner";
import NavBar from "../components/Home/NavBar";
import Hero from "../components/Home/Hero";
import Features from "../components/Home/Features";
import Testimonials from "../components/Home/Testimonials";
import Footer from "../components/Home/Footer";
import Contact from "../components/Home/Contact";

const Home = () => {
  return (
    <div className="w-screen h-screen ">
      <Banner />
      <NavBar />
      <Hero />
      <Features />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;

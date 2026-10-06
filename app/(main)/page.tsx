import React from "react";
import Categories from "@/components/homePage/Categories/Categories";
import CTA from "@/components/homePage/CTA/CTA";
import AboutUs from "@/components/homePage/AboutUs/AboutUs";
import Testimonials from "@/components/homePage/Testimonials/Testimonials";
import Apointment from "@/components/homePage/Apointment/Apointment";
import Newsletter from "@/components/homePage/Newsletter/Newsletter";
import FAQ from "@/components/homePage/FAQ/FAQ";

export default function HomePage() {
  return (
    <div className="sm:space-y-20 space-y-10">
      <Categories />
      <CTA />
      <AboutUs />
      <Testimonials />
      <Apointment />
      <Newsletter />
      <FAQ />
    </div>
  );
}

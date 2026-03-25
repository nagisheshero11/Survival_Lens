import Navbar from "../components/LandingPage/Navbar";
import Hero from "../components/LandingPage/Hero";
import RealitySection from "../components/LandingPage/RealitySection";
import FeaturesSection from "../components/LandingPage/FeaturesSection";
import CalculatorSection from "../components/LandingPage/CalculatorSection";
import TestimonialSection from "../components/LandingPage/TestimonialSection";
import SolutionSection from "../components/LandingPage/SolutionSection";
import StepsSection from "../components/LandingPage/StepsSection";
import TechnologySection from "../components/LandingPage/TechnologySection";
import Footer from "../components/LandingPage/Footer";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-between overflow-x-hidden bg-slate-50">
      <Navbar />
      <Hero />
      <RealitySection />
      <CalculatorSection />
      <FeaturesSection />
      <SolutionSection />
      <StepsSection />
      <TechnologySection />
      <TestimonialSection />
      <Footer />
    </main>
  );
}

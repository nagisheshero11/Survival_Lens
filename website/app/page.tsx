import Navbar from "../components/LandingPage/Navbar";
import Hero from "../components/LandingPage/Hero";
import RealitySection from "../components/LandingPage/RealitySection";
import SolutionSection from "../components/LandingPage/SolutionSection";
import StepsSection from "../components/LandingPage/StepsSection";
import TechnologySection from "../components/LandingPage/TechnologySection";
import CTASection from "../components/LandingPage/CTASection";
import Footer from "../components/LandingPage/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      <Navbar />
      <Hero />
      <RealitySection />
      <SolutionSection />
      <StepsSection />
      <TechnologySection />
      <CTASection />
      <Footer />
    </div>
  );
}

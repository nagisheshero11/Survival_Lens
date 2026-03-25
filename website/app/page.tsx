import Navbar from "../components/LandingPage/Navbar";
import Hero from "../components/LandingPage/Hero";
import RealitySection from "../components/LandingPage/RealitySection";
import SolutionSection from "../components/LandingPage/SolutionSection";
import StepsSection from "../components/LandingPage/StepsSection";
import TechnologySection from "../components/LandingPage/TechnologySection";
import Footer from "../components/LandingPage/Footer";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-between overflow-x-hidden">
      {/* Ambient soft background glow */}
      <div className="fixed inset-0 z-[-1] bg-slate-50">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-400/10 blur-[120px]" />
      </div>

      <Navbar />
      <Hero />
      <RealitySection />
      <SolutionSection />
      <StepsSection />
      <TechnologySection />
      <Footer />
    </main>
  );
}

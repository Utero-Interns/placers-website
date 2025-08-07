import NavBar from "@/components/NavBar";
import LandingHero from "@/components/landingpage/LandingHero";
import LandingAboutUs from "@/components/landingpage/LandingAboutUs";
import LandingValues from "@/components/landingpage/LandingValues";
import LandingGallery from "@/components/landingpage/LandingGallery";
import LandingInvestor from "@/components/landingpage/LandingInvestor";

export default function Home() {
  return (
    <div className="bg-white">
      <NavBar />
      <main>
        <LandingHero />
        <LandingAboutUs />
        <LandingValues />
        <LandingGallery />
        <LandingInvestor />
      </main>
    </div>
  );
}

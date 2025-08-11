import NavBar from "@/components/NavBar";
import FootBar from "@/components/footer/FootBar";
import LandingAboutUs from "@/components/landingpage/LandingAboutUs";
import LandingFAQ from "@/components/landingpage/LandingFAQ";
import LandingGallery from "@/components/landingpage/LandingGallery";
import LandingHero from "@/components/landingpage/LandingHero";
import LandingInvestor from "@/components/landingpage/LandingInvestor";
import LandingValues from "@/components/landingpage/LandingValues";

export default function Home() {
  return (
    <div className="bg-white">
      <NavBar />
      <main>
        <LandingHero />
        <LandingAboutUs />
        <LandingValues />
        {/* <LandingGallery /> */}
        <LandingInvestor />
        {/* <LandingFAQ /> */}
      </main>
      {/* <FootBar /> */}
    </div>
  );
}

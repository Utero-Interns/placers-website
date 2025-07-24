import NavBar from "@/components/NavBar";
import LandingHero from "@/components/landingpage/LandingHero";
import LandingAboutUs from "@/components/landingpage/LandingAboutUs";
export default function Home() {
  return (
    <div className="bg-white">
      <NavBar />
      <main>
        <LandingHero />
        <LandingAboutUs />
      </main>
    </div>
  );
}

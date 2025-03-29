
import MainLayout from "@/components/layouts/MainLayout";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import CallToAction from "@/components/home/CallToAction";
import Footer from "@/components/home/Footer";

export default function Home() {
  return (
    <MainLayout showSidebar={false}>
      <HeroSection />
      <FeaturesSection />
      <CallToAction />
      <Footer />
    </MainLayout>
  );
}

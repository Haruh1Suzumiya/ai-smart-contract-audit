import MainLayout from "@/components/layouts/MainLayout";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import CallToAction from "@/components/home/CallToAction";
import Footer from "@/components/home/Footer";

export default function Home() {
  return (
    <MainLayout showSidebar={false}>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <HeroSection />
        <FeaturesSection />
        <CallToAction />
        <Footer />
      </div>
    </MainLayout>
  );
}
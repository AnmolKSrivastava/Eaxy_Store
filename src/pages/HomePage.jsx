import { Footer, Navbar } from '../components/layout';
import './HomePage.css';
import {
  CoverageSection,
  CtaBannerSection,
  HeroSection,
  HotDealsSection,
  HowItWorksSection,
  ProductCategoriesSection,
  RepairServicesSection,
  TestimonialsSection,
  WhyChooseSection,
} from '../components/home';

function HomePage() {
  return (
    <div className="page">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <ProductCategoriesSection />
      <RepairServicesSection />
      <WhyChooseSection />
      <CoverageSection />
      <HotDealsSection />
      <TestimonialsSection />
      <CtaBannerSection />
      <Footer />
    </div>
  );
}

export default HomePage;

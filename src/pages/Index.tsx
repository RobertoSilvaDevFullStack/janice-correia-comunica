import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Palestras from "@/components/Palestras";
import Mentorias from "@/components/Mentorias";
import InstagramFeed from "@/components/InstagramFeed";
import Blog from "@/components/Blog";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Palestras />
      <Mentorias />
      <InstagramFeed />
      <Blog />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;

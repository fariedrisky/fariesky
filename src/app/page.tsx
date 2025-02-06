import Profile from "@/components/sections/01-Profile";
import About from "@/components/sections/02-About";
import Skills from "@/components/sections/03-Skills";
import Experience from "@/components/sections/04-Experience";
import Projects from "@/components/sections/05-Projects";
import Education from "@/components/sections/06-Education";
import Links from "@/components/sections/10-Links";
import Contact from "@/components/sections/11-Contact";
import Footer from "@/components/layouts/01-Footer";
import Course from "@/components/sections/08-Course-Training";
import Languages from "@/components/sections/09-Languages";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Desktop Layout (lg and above) */}
      <div className="mx-auto hidden max-w-7xl gap-8 p-8 lg:flex">
        {/* Left Side - Fixed Profile */}
        <div className="fixed w-[350px]">
          <Profile variant="desktop" />
        </div>

        {/* Right Side - Scrollable Content */}
        <div className="flex-1 pl-[380px]">
          <div className="max-w-3xl space-y-16">
            <About />
            <Skills />
            <Experience />
            <Projects />
            <Education />
            <Course />
            <Languages />
            <Links />
            <Contact />
          </div>
        </div>
      </div>

      {/* Tablet Layout (md to lg) */}
      <div className="mx-auto hidden max-w-4xl p-8 md:block lg:hidden">
        <div className="space-y-16">
          <Profile variant="tablet" />
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Education />
          <Course />
          <Languages />
          <Links />
          <Contact />
        </div>
      </div>

      {/* Mobile Layout (below md) */}
      <div className="block md:hidden">
        <div className="space-y-12 p-4">
          <Profile variant="mobile" />
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Education />
          <Course />
          <Languages />
          <Links />
          <Contact />
        </div>
      </div>
      <Footer />
    </main>
  );
}

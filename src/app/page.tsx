"use client";

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
import AnimatedSection from "@/components/ui/AnimatedSection";
import ViewCounter from "@/components/ui/ViewCounter";
//import ResetVisitors from "@/components/ui/ResetVisitors";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-neutral-50">
      <ViewCounter />
      {/*<ResetVisitors/>*/}
      {/* Desktop Layout (lg and above) */}
      <div className="mx-auto hidden max-w-7xl gap-8 p-8 lg:flex">
        {/* Left Side - Fixed Profile */}
        <div className="fixed w-[350px]">
          <AnimatedSection variant="horizontal">
            <Profile variant="desktop" />
          </AnimatedSection>
        </div>

        {/* Right Side - Scrollable Content */}
        <div className="flex-1 pl-[380px]">
          <div className="max-w-3xl space-y-16">
            <AnimatedSection delay={0.1}>
              <About />
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <Skills />
            </AnimatedSection>
            <AnimatedSection delay={0.3}>
              <Experience />
            </AnimatedSection>
            <AnimatedSection delay={0.4}>
              <Projects />
            </AnimatedSection>
            <AnimatedSection delay={0.5}>
              <Education />
            </AnimatedSection>
            <AnimatedSection delay={0.6}>
              <Course />
            </AnimatedSection>
            <AnimatedSection delay={0.7}>
              <Languages />
            </AnimatedSection>
            <AnimatedSection delay={0.8}>
              <Links />
            </AnimatedSection>
            <AnimatedSection delay={0.9}>
              <Contact />
            </AnimatedSection>
          </div>
        </div>
      </div>

      {/* Tablet Layout (md to lg) */}
      <div className="mx-auto hidden max-w-4xl p-8 md:block lg:hidden">
        <div className="space-y-16">
          <AnimatedSection>
            <Profile variant="tablet" />
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <About />
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <Skills />
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <Experience />
          </AnimatedSection>
          <AnimatedSection delay={0.4}>
            <Projects />
          </AnimatedSection>
          <AnimatedSection delay={0.5}>
            <Education />
          </AnimatedSection>
          <AnimatedSection delay={0.6}>
            <Course />
          </AnimatedSection>
          <AnimatedSection delay={0.7}>
            <Languages />
          </AnimatedSection>
          <AnimatedSection delay={0.8}>
            <Links />
          </AnimatedSection>
          <AnimatedSection delay={0.9}>
            <Contact />
          </AnimatedSection>
        </div>
      </div>

      {/* Mobile Layout (below md) */}
      <div className="block md:hidden">
        <div className="space-y-12 p-4">
          <AnimatedSection>
            <Profile variant="mobile" />
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <About />
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <Skills />
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <Experience />
          </AnimatedSection>
          <AnimatedSection delay={0.4}>
            <Projects />
          </AnimatedSection>
          <AnimatedSection delay={0.5}>
            <Education />
          </AnimatedSection>
          <AnimatedSection delay={0.6}>
            <Course />
          </AnimatedSection>
          <AnimatedSection delay={0.7}>
            <Languages />
          </AnimatedSection>
          <AnimatedSection delay={0.8}>
            <Links />
          </AnimatedSection>
          <AnimatedSection delay={0.9}>
            <Contact />
          </AnimatedSection>
        </div>
      </div>
      <Footer />
    </main>
  );
}

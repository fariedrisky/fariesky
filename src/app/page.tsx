import Profile from "@/components/sections/01-Profile";
import About from "@/components/sections/02-About";
import Skills from "@/components/sections/03-Skills";
import Experience from "@/components/sections/04-Experience";
import TechStack from "@/components/sections/05-TechStack";
import Projects from "@/components/sections/06-Projects";
import Education from "@/components/sections/07-Education";
import Links from "@/components/sections/11-Links";
import Contact from "@/components/sections/12-Contact";
import Footer from "@/components/layouts/01-Footer";
import Course from "@/components/sections/09-Course-Training";
import Languages from "@/components/sections/10-Languages";

export default function Home() {
    return (
        <main className="min-h-screen">
            {/* Desktop Layout (lg and above) */}
            <div className="hidden lg:flex max-w-7xl mx-auto gap-8 p-8">
                {/* Left Side - Fixed Profile */}
                <div className="w-[350px] fixed">
                    <Profile variant="desktop" />
                </div>

                {/* Right Side - Scrollable Content */}
                <div className="flex-1 pl-[380px]">
                    <div className="space-y-16">
                        <About />
                        <Skills />
                        <Experience />
                        <TechStack />
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
            <div className="hidden md:block lg:hidden max-w-4xl mx-auto p-8">
                <div className="space-y-16">
                    <Profile variant="tablet" />
                    <About />
                    <Skills />
                    <Experience />
                    <TechStack />
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
                    <TechStack />
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

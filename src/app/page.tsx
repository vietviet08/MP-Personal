
import { HeroSection } from "@/components/Home/HeroSection";
import { About } from "@/components/About/About";
import { Experience } from "@/components/Experience/Experience";
import { Skills } from "@/components/Skills/Skills";
import { Projects } from "@/components/Projects/Projects";
import { Contact } from "@/components/Contact/Contact";

export default function Home() {
    return (
        <main>
            <HeroSection />
            <About />
            <Experience />
            <Skills />
            <Projects />
            <Contact />
        </main>
    );
}

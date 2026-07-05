// app/page.tsx — One-page: compone todas las secciones en orden.

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Countdown from "@/components/Countdown";
import OurStory from "@/components/OurStory";
import EventDetails from "@/components/EventDetails";
import PracticalInfo from "@/components/PracticalInfo";
import RsvpForm from "@/components/RsvpForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Countdown />
        <OurStory />
        <EventDetails />
        <PracticalInfo />
        <RsvpForm />
      </main>
      <Footer />
    </>
  );
}

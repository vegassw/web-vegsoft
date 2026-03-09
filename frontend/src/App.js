import "@/App.css";
import { BrowserRouter } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { Toaster } from "./components/ui/sonner";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import WhyUs from "./components/WhyUs";
import TechStack from "./components/TechStack";
import Clients from "./components/Clients";
import Process from "./components/Process";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="App min-h-screen bg-background">
          <Header />
          <main>
            <Hero />
            <Services />
            <WhyUs />
            <TechStack />
            <Clients />
            <Process />
            <Contact />
          </main>
          <Footer />
          <WhatsAppButton />
          <Toaster position="top-right" richColors />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;

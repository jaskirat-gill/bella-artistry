"use client";

import { useEffect, useRef, useState } from "react";
import ServiceListPreview from "../components/ServiceList/ServiceListPreview";
import { ArrowDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Service, { PortfolioItem } from "@/lib/types";
import { getPortfolio, getServices } from "@/api/controller";
import { useConfig } from "@/components/ConfigContextProvider";

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const config = useConfig();
  useEffect(() => {
    getServices().then((services) => {
      setServices(services);
    });
    getPortfolio().then((portfolio) => {
      setPortfolio(portfolio);
      console.log("portfolio", portfolio);
    });
  }, []);

  const aboutRef = useRef<HTMLDivElement>(null);

  const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          muted
          loop
          className="absolute w-full h-full object-cover"
          style={{ objectFit: "cover", filter: "brightness(0.7)" }}
        >
          <source src="/sky.mp4" type="video/mp4" />
        </video>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto text-white">
          <p className="font-sans font-medium uppercase tracking-widest text-sm md:text-base mb-4 opacity-90">
            {config.landingPageTagline}
          </p>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-12 tracking-tight">
            {config.companyName}
          </h1>
          <Button
            className="bg-white text-black hover:bg-white/90 px-8 py-6 text-lg rounded-full transition-all"
            asChild
          >
            <a href="/book-now">Book Now</a>
          </Button>

          <button
            onClick={scrollToAbout}
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-white/80 hover:text-white transition-colors"
            aria-label="Scroll to about section"
          >
            <ArrowDown className="animate-bounce w-10 h-10" />
          </button>
        </div>
      </section>

      {/* View Work Section */}
      <section ref={aboutRef} className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="w-24 h-1 bg-pink-400 mb-8"></div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight text-pink-900">
                View Our Work
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="leading-relaxed text-pink-900">
                  We take pride in our work and strive to provide the best
                  service to our clients. Have a look at our portfolio to see
                  some of our recent work.
                </p>
                <p className="leading-relaxed text-pink-900">
                  Click see more to learn more!
                </p>
              </div>
              <div className="mt-8">
                <Button
                  variant="outline"
                  className="group bg-pink-400 hover:bg-pink-900 hover:text-white"
                  asChild
                >
                  <a href="/about-me" className="flex items-center text-white">
                    See More
                    <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              </div>
            </div>
            <div className="order-1 md:order-2 h-[400px] md:h-[500px] overflow-hidden rounded-lg shadow-xl">
              <div
                className="w-full h-full bg-cover bg-center transition-transform hover:scale-105 duration-700"
                style={{ backgroundImage: `url(${portfolio[0]?.sourceUrl})` }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 relative">
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover opacity-20 z-0"
          style={{ objectFit: "cover" }}
        >
          <source src="/sky.mp4" type="video/mp4" />
        </video>

        <div className="container relative z-10 mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-24 h-1 bg-pink-400 mx-auto mb-8"></div>
            <h2 className="text-3xl md:text-4xl font-bold mb-12 tracking-tight text-pink-900">
              Lets Get Started
            </h2>

            {services?.length ? (
              <>
                <ServiceListPreview
                  services={services.filter((service) => service.featured)}
                />

                <div className="mt-12">
                  <Button
                    asChild
                    className="bg-pink-400 hover:bg-pink-900 hover:text-white"
                  >
                    <a href="/services">View All Services</a>
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="w-24 h-1 bg-pink-400 mb-8"></div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight text-pink-900">
                About The Team
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="leading-relaxed text-pink-900">
                  {config.aboutPageContent}
                </p>
                <p className="leading-relaxed text-pink-900">
                  Click Read More to learn more about our amazing Team and their
                  work!
                </p>
              </div>
              <div className="mt-8">
                <Button
                  variant="outline"
                  className="group bg-pink-400 hover:bg-pink-900 hover:text-white"
                  asChild
                >
                  <a href="/about-me" className="flex items-center text-white">
                    Read More
                    <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              </div>
            </div>
            <div className="order-1 md:order-2 h-[400px] md:h-[500px] overflow-hidden rounded-lg shadow-xl">
              <div
                className="w-full h-full bg-cover bg-center transition-transform hover:scale-105 duration-700"
                style={{ backgroundImage: "url('/logo.jpg')" }}
              ></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { NavBar } from "./NavBar/NavBar";
import { Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useConfig } from "../ConfigContextProvider";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const config = useConfig();
  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed w-full z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-sm shadow-md py-2"
            : "bg-pink-50 py-3"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center space-x-2 transition-transform hover:scale-105 group"
            >
              <div className="bg-pink-500 text-white p-1.5 rounded-lg group-hover:bg-pink-600 transition-colors">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold tracking-tight text-xl md:text-2xl text-pink-900">
                  {config.companyName}
                </span>
                <span className="text-xs text-pink-400 hidden sm:block">
                  By Bal Randhawa
                </span>
              </div>
            </Link>

            <div className="hidden md:block">
              <NavBar />
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                className="hidden md:flex text-pink-900 hover:text-pink-700 hover:bg-pink-100"
                asChild
              >
                <Link href="/contact">Contact</Link>
              </Button>

              <Button
                className="hidden md:flex bg-pink-500 hover:bg-pink-600 text-white"
                asChild
              >
                <Link href="/book-now">Book Now</Link>
              </Button>

              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="md:hidden border-pink-200 text-pink-500 hover:bg-pink-50 hover:text-pink-600"
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-pink-50">
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center mb-8 pt-2">
                      <div className="flex items-center space-x-2">
                        <div className="bg-pink-500 text-white p-1 rounded-lg">
                          <Sparkles className="h-4 w-4" />
                        </div>
                        <span className="font-bold text-lg text-pink-900">
                          {config.companyName}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-4">
                      <MobileNavBar />
                    </div>

                    <div className="mt-auto pt-8 flex flex-col space-y-3">
                      <Button
                        variant="outline"
                        className="w-full border-pink-200 text-pink-900 hover:bg-pink-100"
                        asChild
                      >
                        <Link href="/contact">Contact</Link>
                      </Button>

                      <Button
                        className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                        asChild
                      >
                        <Link href="/book-now">Book Now</Link>
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
      <div className="h-16 md:h-20"></div>
    </>
  );
};

// Mobile navigation component
const MobileNavBar = () => {
  return (
    <nav className="flex flex-col space-y-2">
      <Link
        href="/"
        className="px-2 py-2 text-pink-900 hover:bg-pink-100 rounded-md transition-colors"
      >
        Home
      </Link>
      <Link
        href="/about"
        className="px-2 py-2 text-pink-900 hover:bg-pink-100 rounded-md transition-colors"
      >
        About
      </Link>
      <Link
        href="/services"
        className="px-2 py-2 text-pink-900 hover:bg-pink-100 rounded-md transition-colors"
      >
        Services
      </Link>
      <Link
        href="/testimonials"
        className="px-2 py-2 text-pink-900 hover:bg-pink-100 rounded-md transition-colors"
      >
        Testimonials
      </Link>
      <Link
        href="/portfolio"
        className="px-2 py-2 text-pink-900 hover:bg-pink-100 rounded-md transition-colors"
      >
        Portfolio
      </Link>
    </nav>
  );
};

export default Header;

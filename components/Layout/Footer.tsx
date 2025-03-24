"use client";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Link from "next/link";

const FooterNote = () => (
  <div className="text-xs text-pink-900/70">
    <p>© {new Date().getFullYear()} by Bella Artistry.</p>
    <p>All rights reserved.</p>
  </div>
);

const Footer = () => (
  <footer className="w-full py-12 bg-pink-100 text-pink-900 leading-7">
    <div className="container mx-auto max-w-6xl px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <div className="mb-6">
            <div className="w-16 h-1 bg-pink-400 mb-4"></div>
            <h2 className="text-xl font-bold tracking-wide mb-6">Contact</h2>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start">
              <MapPin className="mr-2 h-5 w-5 text-pink-500 mt-1 flex-shrink-0" />
              <div>
                <p>Surrey, BC</p>
                <p>Available For Travel</p>
              </div>
            </div>

            <div className="flex items-center">
              <Phone className="mr-2 h-5 w-5 text-pink-500 flex-shrink-0" />
              <p>Tel: 123-456-7890</p>
            </div>

            <div className="flex items-center">
              <Mail className="mr-2 h-5 w-5 text-pink-500 flex-shrink-0" />
              <a
                href="mailto:info@mysite.com"
                className="hover:text-pink-700 transition-colors underline"
              >
                info@mysite.com
              </a>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-medium mb-3">Connect With Us</h3>
            <ul className="flex gap-4 items-center">
              <li>
                <a
                  href="http://www.facebook.com/wix"
                  target="_blank"
                  rel="noreferrer"
                  className="block p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5 text-pink-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/wix"
                  target="_blank"
                  rel="noreferrer"
                  className="block p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5 text-pink-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/wix/"
                  target="_blank"
                  rel="noreferrer"
                  className="block p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5 text-pink-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/user/Wix"
                  target="_blank"
                  rel="noreferrer"
                  className="block p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
                  aria-label="YouTube"
                >
                  <Youtube className="h-5 w-5 text-pink-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="md:pl-8">
          <div className="mb-6">
            <div className="w-16 h-1 bg-pink-400 mb-4"></div>
            <h2 className="text-xl font-bold tracking-wide mb-6">
              Quick Links
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <Link href="/" className="hover:text-pink-700 transition-colors">
              Home
            </Link>
            <Link
              href="/book-now"
              className="hover:text-pink-700 transition-colors"
            >
              Book
            </Link>
            <Link
              href="/services"
              className="hover:text-pink-700 transition-colors"
            >
              Services
            </Link>
            <Link
              href="/portfolio"
              className="hover:text-pink-700 transition-colors"
            >
              Portfolio
            </Link>
            <Link
              href="/team"
              className="hover:text-pink-700 transition-colors"
            >
              Team
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-pink-200 flex flex-col md:flex-row justify-between items-center">
        <FooterNote />
        <div className="mt-4 md:mt-0 text-xs text-pink-900/70">
          <Link
            href="https://jaskirat-gill.github.io/"
            className="hover:text-pink-700 transition-colors"
          >
            Developed By Jaskirat Gill
          </Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;

"use client"

import Link from "next/link"
import { NavBar } from "./NavBar/NavBar"
import { Menu } from "lucide-react"

const Header = () => {

  return (
    <>
      <header
        className={`fixed w-full z-40 transition-all duration-300 bg-pink-100 text-pink-900`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center space-x-2 transition-transform hover:scale-105">
              <span className="font-bold tracking-tight text-xl md:text-2xl">Bella Artistry</span>
            </Link>

            <div className="hidden md:block">
              <NavBar />
            </div>

            <button className="md:hidden p-2 rounded-md hover:bg-gray-100">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </button>
          </div>
        </div>
      </header>
      <div className="h-16 md:h-20"></div>
    </>
  )
}

export default Header


import Link from "next/link";

export const NavBar = () => {
  return (
    <nav className="flex items-center space-x-1">
      <Link
        href="/"
        className="px-3 py-2 text-pink-900 hover:bg-pink-100 rounded-md transition-colors text-sm font-medium"
      >
        Home
      </Link>
      <Link
        href="/about"
        className="px-3 py-2 text-pink-900 hover:bg-pink-100 rounded-md transition-colors text-sm font-medium"
      >
        About
      </Link>
      <Link
        href="/services"
        className="px-3 py-2 text-pink-900 hover:bg-pink-100 rounded-md transition-colors text-sm font-medium"
      >
        Services
      </Link>
      <Link
        href="/testimonials"
        className="px-3 py-2 text-pink-900 hover:bg-pink-100 rounded-md transition-colors text-sm font-medium"
      >
        Testimonials
      </Link>
      <Link
        href="/blog"
        className="px-3 py-2 text-pink-900 hover:bg-pink-100 rounded-md transition-colors text-sm font-medium"
      >
        Blog
      </Link>
    </nav>
  );
};

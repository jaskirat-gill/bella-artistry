"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Star,
  Quote,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { Testimonial } from "@/lib/types";
import { getTestimonials } from "@/api/controller";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

// Star rating component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

// Testimonial card component
const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <motion.div variants={itemVariants}>
      <Card className="h-full flex flex-col bg-white/95 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
        <CardContent className="flex-grow pt-6">
          <div className="mb-4">
            <Quote className="h-8 w-8 text-pink-300 mb-2" />
            <p className="text-pink-900 italic">{testimonial.quote}</p>
          </div>
        </CardContent>
        <CardFooter className="border-t border-pink-100 pt-4 pb-6">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-pink-200 overflow-hidden">
              <div className="h-full w-full flex items-center justify-center bg-pink-300 text-white font-bold text-lg">
                {testimonial.name.charAt(0)}
              </div>
            </div>
            <div>
              <p className="font-medium text-pink-900">{testimonial.name}</p>
              5 <StarRating rating={5} />
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

// Pagination component
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of page range
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if at the beginning
      if (currentPage <= 2) {
        end = Math.min(totalPages - 1, 4);
      }

      // Adjust if at the end
      if (currentPage >= totalPages - 1) {
        start = Math.max(2, totalPages - 3);
      }

      // Add ellipsis if needed
      if (start > 2) {
        pages.push("...");
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-12">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="border-pink-200 text-pink-500 hover:bg-pink-100 disabled:opacity-50"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {getPageNumbers().map((page, index) =>
        page === "..." ? (
          <span key={`ellipsis-${index}`} className="text-pink-300 px-2">
            ...
          </span>
        ) : (
          <Button
            key={`page-${page}`}
            variant={currentPage === page ? "default" : "outline"}
            className={
              currentPage === page
                ? "bg-pink-500 hover:bg-pink-600 text-white"
                : "border-pink-200 text-pink-900 hover:bg-pink-100"
            }
            onClick={() => onPageChange(page as number)}
          >
            {page}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="border-pink-200 text-pink-500 hover:bg-pink-100 disabled:opacity-50"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default function TestimonialsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const testimonialsPerPage = 6;
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    getTestimonials().then((data) => setTestimonials(data));
  }, []);
  // Calculate total pages
  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage);

  // Get current testimonials
  const indexOfLastTestimonial = currentPage * testimonialsPerPage;
  const indexOfFirstTestimonial = indexOfLastTestimonial - testimonialsPerPage;
  const currentTestimonials = testimonials.slice(
    indexOfFirstTestimonial,
    indexOfLastTestimonial
  );

  // Change page
  const handlePageChange = (pageNumber: number) => {
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentPage(pageNumber);
  };

  return (
    <div className="relative min-h-screen">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        className="absolute w-full h-full object-cover"
        style={{ filter: "brightness(0.9)" }}
      >
        <source src="/sky.mp4" type="video/mp4" />
      </video>

      {/* Content */}
      <div className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center justify-center p-1 bg-pink-500 rounded-lg mb-4">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Client Testimonials
            </h1>
            <p className="text-lg text-pink-100 mb-8"></p>
          </div>

          {/* Testimonials Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={`testimonials-page-${currentPage}`} // Re-animate when page changes
          >
            {currentTestimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}

          {/* Share Your Story Section */}
          <div className="max-w-3xl mx-auto text-center mt-20 bg-white/10 backdrop-blur-sm p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-4 text-white">
              Share Your Experience
            </h2>
            <p className="text-pink-100 mb-6">
              Have you had an amazing experience with our services? We&apos;d love to
              hear about it!.
            </p>
            <Button
              className="bg-pink-500 hover:bg-pink-600 text-white"
              asChild
            >
              <a href="https://www.google.com/maps/place/Bella+Artistry/@49.1397962,-122.827361,17z/data=!4m8!3m7!1s0x5485db798e284833:0xaeda12dd446c0db6!8m2!3d49.1397962!4d-122.8247861!9m1!1b1!16s%2Fg%2F11jzpvtv5v?entry=ttu&g_ep=EgoyMDI1MDMxOS4yIKXMDSoASAFQAw%3D%3D">
                Submit Your Testimonial
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

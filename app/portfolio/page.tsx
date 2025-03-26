"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import {
  ImageIcon,
  X,
  ChevronLeft,
  ChevronRight,
  Instagram,
} from "lucide-react";
import { motion } from "framer-motion";
import type { PortfolioItem } from "@/lib/types";
import { getPortfolio } from "@/api/controller";
import { useConfig } from "@/components/ConfigContextProvider";

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

export default function BlogPage() {
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const itemsPerPage = 6;
  const config = useConfig();

  useEffect(() => {
    getPortfolio().then((data) => {
      setPortfolioItems(data);
    });
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(portfolioItems.length / itemsPerPage);

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = portfolioItems.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentPage(pageNumber);
  };

  // Handle dialog navigation
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setSelectedItem(portfolioItems[currentIndex - 1]);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < portfolioItems.length - 1) {
      setSelectedItem(portfolioItems[currentIndex + 1]);
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Update current index when selected item changes
  useEffect(() => {
    if (selectedItem) {
      const newIndex = portfolioItems.findIndex(
        (item) => item.id === selectedItem.id
      );
      if (newIndex !== -1) {
        setCurrentIndex(newIndex);
      }
    }
  }, [selectedItem, portfolioItems]);

  return (
    <div className="relative min-h-screen">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute w-full h-full object-cover"
        style={{ filter: "brightness(0.3)" }}
      >
        <source src="/sky.mp4" type="video/mp4" />
      </video>

      {/* Content */}
      <div className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center justify-center p-1 bg-pink-500 rounded-lg mb-4">
              <ImageIcon className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Portfolio Gallery
            </h1>
            <p className="text-lg text-pink-100 mb-8">
              Explore our collection of work showcasing beautiful
              transformations and creative artistry. Each image represents our
              commitment to bringing out your unique beauty.
            </p>
          </div>

          {/* Portfolio Grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {currentItems.map((item) => (
              <div key={item.id} className="break-inside-avoid mb-6">
                <PortfolioCard
                  item={item}
                  onClick={() => setSelectedItem(item)}
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}

          {/* Instagram CTA */}
          <div className="max-w-3xl mx-auto text-center mt-20 bg-white/10 backdrop-blur-sm p-8 rounded-xl">
            <div className="inline-flex items-center justify-center p-2 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-xl mb-6">
              <Instagram className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-white">
              Follow Us on Instagram
            </h2>
            <p className="text-pink-100 mb-6">
              For inspiration, behind-the-scenes content, and our latest work,
              follow us on Instagram.
            </p>
            <Button
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
              asChild
            >
              <a
                href={`${config.instagramLink}`}
                target="_blank"
                rel="noreferrer"
              >
                <Instagram className="mr-2 h-4 w-4" />
                {config.instagramHandle}
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Image Dialog */}
      <Dialog
        open={!!selectedItem}
        onOpenChange={(open) => !open && setSelectedItem(null)}
      >
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none shadow-none">
          <div className="relative bg-black/90 rounded-lg overflow-hidden">
            {/* Close button */}
            <DialogClose className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 rounded-full p-1 text-white">
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </DialogClose>

            {/* Navigation buttons */}
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 disabled:opacity-30 disabled:hover:bg-black/50 rounded-full p-2 text-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === portfolioItems.length - 1}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 disabled:opacity-30 disabled:hover:bg-black/50 rounded-full p-2 text-white"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Image */}
            {selectedItem && (
              <div>
                <div className="relative w-full h-[70vh] max-h-[80vh]">
                  <img
                    src={selectedItem.sourceUrl || "/placeholder.svg"}
                    alt={selectedItem.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Caption */}
                <div className="p-6 bg-black/90 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-1">
                        {selectedItem.name}
                      </h3>
                      <p className="text-gray-300">
                        {selectedItem.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Portfolio card component
const PortfolioCard = ({
  item,
  onClick,
}: {
  item: PortfolioItem;
  onClick: () => void;
}) => {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5 }}
      className="h-full overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-transparent"
      onClick={onClick}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
        <img
          src={item.sourceUrl || "/placeholder.svg?height=400&width=300"}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <div className="p-4 bg-black/70 backdrop-blur-sm rounded-b-lg -mt-1">
        <h3 className="font-medium text-lg text-white mb-1">{item.name}</h3>
        <p className="text-pink-200 text-sm line-clamp-2">{item.description}</p>
      </div>
    </motion.div>
  );
};

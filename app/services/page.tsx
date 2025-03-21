"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, DollarSign, Sparkles } from "lucide-react";
import { formatCurrency, formatDuration } from "@/lib/utils";
import { motion } from "framer-motion";
import Service from "@/lib/types";
import { getServices } from "@/api/controller";
import Link from "next/link";



// Animation variants for staggered animations
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

export default function ServicesPage() {
  const [filter, setFilter] = useState<"all" | "featured">("all");
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    getServices().then((services) => {
      setServices(services);
    });
  }, []);

  const filteredServices =
    filter === "all"
      ? services
      : services.filter((service) => service.featured);

  return (
    <div className="relative min-h-screen">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
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
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Our Services
            </h1>
            <p className="text-lg text-pink-100 mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Vestibulum cursus nisl nisi, nec euismod risus vestibulum quis.
              Etiam sapien urna, feugiat vitae luctus non, malesuada feugiat
              libero. Proin eu aliquet purus. Morbi non ex eu nunc cursus mollis
              eu vitae justo.
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
                className={
                  filter === "all"
                    ? "bg-pink-500 hover:bg-pink-600 text-white"
                    : "border-pink-300 text-pink-100 hover:bg-pink-900/20"
                }
              >
                All Services
              </Button>
              <Button
                variant={filter === "featured" ? "default" : "outline"}
                onClick={() => setFilter("featured")}
                className={
                  filter === "featured"
                    ? "bg-pink-500 hover:bg-pink-600 hover:text-white text-white"
                    : "border-pink-300 text-pink-300 hover:bg-pink-900/20"
                }
              >
                Featured Services
              </Button>
            </div>
          </div>

          {/* Services Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </motion.div>

          {/* Contact Section */}
          <div className="max-w-3xl mx-auto text-center mt-20 bg-white/10 backdrop-blur-sm p-8 rounded-xl">
            <h2 className="text-2xl font-bold mb-4 text-white">
              Not sure which service is right for you?
            </h2>
            <p className="text-pink-100 mb-6">
              Our team is more than happy to help.{" "}
              <Link href="/contact" className="text-pink-500 hover:text-pink-700 transition-colors">
                  Get in touch now!
              </Link>
            </p>
            <Button
              className="bg-pink-500 hover:bg-pink-600 text-white"
              asChild
            >
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}



interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const formattedPrice = formatCurrency(service.price);
  const formattedDuration = formatDuration(service.duration);

  return (
    <motion.div
      className="bg-white/95 backdrop-blur-sm rounded-lg overflow-hidden shadow-xl flex flex-col h-full"
      variants={itemVariants}
    >
      {service.featured && (
        <div className="bg-pink-500 text-white text-center py-1 text-sm font-medium">
          Featured Service
        </div>
      )}

      <div className="p-6 flex-grow">
        <h3 className="text-xl font-bold mb-3 text-pink-900">
          {service.title}
        </h3>

        <div className="w-12 h-1 bg-pink-400 mb-4"></div>

        <p className="text-pink-700 mb-6 line-clamp-4">{service.description}</p>

        <div className="flex items-center space-x-6 mb-4">
          <div className="flex items-center text-pink-900">
            <DollarSign className="h-4 w-4 mr-1 text-pink-500" />
            <span>{formattedPrice}</span>
          </div>

          <div className="flex items-center text-pink-900">
            <Clock className="h-4 w-4 mr-1 text-pink-500" />
            <span>{formattedDuration}</span>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 mt-auto">
        <Button
          className="w-full bg-pink-500 hover:bg-pink-600 text-white group"
          asChild
        >
          <Link href={`/book-now/${service.slug}`} className="flex items-center justify-center">
              Book Now
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </motion.div>
  );
};

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Instagram,
} from "lucide-react";
import { motion } from "framer-motion";
import { useConfig } from "@/components/ConfigContextProvider";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

export default function ContactPage() {
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // Replacing subject with phone number
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState("");
  const config = useConfig();
  // Form validation state
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      phone?: string;
      message?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send phone instead of subject
        body: JSON.stringify({ name, email, phone, message }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to send message");
      }

      setSubmitStatus("success");
      // Reset form fields
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (error: unknown) {
      console.error("Error sending message:", error);
      setSubmitStatus("error");
      setErrorMessage("Failed to send your message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <Mail className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Get in Touch
            </h1>
            <p className="text-lg text-pink-100 mb-8">
              Have questions about our services? Get in touch now to learn more.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Contact Form */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-8"
            >
              <motion.h2
                variants={itemVariants}
                className="text-2xl font-bold mb-6 text-pink-900"
              >
                Send a Message
              </motion.h2>

              {submitStatus === "success" && (
                <div className="mb-6 bg-green-50 border-green-200 p-4 rounded">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mr-2" />
                    <div>
                      <h4 className="text-green-800 font-bold">
                        Message Sent!
                      </h4>
                      <p className="text-green-700">
                        Thank you for reaching out. We&apos;ll get back to you as
                        soon as possible.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="mb-6 bg-red-50 border-red-200 p-4 rounded">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                    <div>
                      <h4 className="text-red-800 font-bold">Error</h4>
                      <p className="text-red-700">{errorMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="name" className="text-pink-900">
                    Your Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`border-pink-200 focus:ring-pink-500 ${
                      errors.name ? "border-red-500" : ""
                    }`}
                    placeholder="Enter your name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="email" className="text-pink-900">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`border-pink-200 focus:ring-pink-500 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="phone" className="text-pink-900">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`border-pink-200 focus:ring-pink-500 ${
                      errors.phone ? "border-red-500" : ""
                    }`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">{errors.phone}</p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="message" className="text-pink-900">
                    Message <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={`border-pink-200 focus:ring-pink-500 min-h-[150px] ${
                      errors.message ? "border-red-500" : ""
                    }`}
                    placeholder="How can we help you?"
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm">{errors.message}</p>
                  )}
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Button
                    type="submit"
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent border-white"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </motion.div>

            {/* Contact Information */}
            <div className="flex flex-col gap-8">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-8"
              >
                <motion.h2
                  variants={itemVariants}
                  className="text-2xl font-bold mb-6 text-pink-900"
                >
                  Contact Information
                </motion.h2>
                <div className="space-y-6">
                  <motion.div
                    variants={itemVariants}
                    className="flex items-start"
                  >
                    <div className="bg-pink-100 p-3 rounded-full mr-4">
                      <MapPin className="h-5 w-5 text-pink-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-pink-900 mb-1">
                        Location
                      </h3>
                      <p className="text-pink-700">Surrey, BC, Canada</p>
                    </div>
                  </motion.div>
                  <motion.div
                    variants={itemVariants}
                    className="flex items-start"
                  >
                    <div className="bg-pink-100 p-3 rounded-full mr-4">
                      <Phone className="h-5 w-5 text-pink-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-pink-900 mb-1">Phone</h3>
                      <p className="text-pink-700">
                        <a
                          href={`tel:${config.phoneNumber}`}
                          className="hover:text-pink-500 transition-colors"
                        >
                          {config.phoneNumber}
                        </a>
                      </p>
                    </div>
                  </motion.div>
                  <motion.div
                    variants={itemVariants}
                    className="flex items-start"
                  >
                    <div className="bg-pink-100 p-3 rounded-full mr-4">
                      <Mail className="h-5 w-5 text-pink-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-pink-900 mb-1">Email</h3>
                      <p className="text-pink-700">
                        <a
                          href={`mailto:${config.email}`}
                          className="hover:text-pink-500 transition-colors"
                        >
                          {config.email}
                        </a>
                      </p>
                    </div>
                  </motion.div>
                </div>
                <Separator className="my-6" />
                <motion.div variants={itemVariants}>
                  <h3 className="font-medium text-pink-900 mb-4">
                    Connect With Us
                  </h3>
                  <div className="flex gap-4">
                    <a
                      href={`${config.instagramLink}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-white p-2 rounded-full shadow-sm hover:shadow-md transition-shadow"
                      aria-label="Instagram"
                    >
                      <Instagram className="h-5 w-5 text-pink-500" />
                    </a>
                  </div>
                </motion.div>
              </motion.div>
              {/* Map */}
              <motion.div
                variants={itemVariants}
                className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden h-[300px]"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12416.967524349404!2d-122.83522613355464!3d49.137057221226044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5485db798e284833%3A0xaeda12dd446c0db6!2sBella%20Artistry!5e0!3m2!1sen!2sca!4v1742770863398!5m2!1sen!2sca"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office Location"
                ></iframe>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Award, Heart, Mail, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { TeamMember } from "@/lib/types";
import { getArtists } from "@/api/controller";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
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

// Team member card component
const TeamMemberCard = ({
  member,
  onClick,
}: {
  member: TeamMember;
  onClick: () => void;
}) => {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5 }}
      className="h-full overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/95 backdrop-blur-sm"
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden">
        {member.image ? (
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-pink-200 text-pink-900 font-bold text-4xl">
            {member.name}
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="font-bold text-xl text-pink-900 mb-1">{member.name}</h3>
        <p className="text-pink-500 font-medium mb-3">{member.role}</p>
        <p className="text-pink-700 line-clamp-3 mb-4">{member.bio}</p>
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-pink-500 hover:text-pink-700 hover:bg-pink-50 p-0 h-auto"
          >
            <span className="sr-only">View Profile</span>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// Team member detail component
const TeamMemberDetail = ({
  member,
  onBack,
}: {
  member: TeamMember;
  onBack: () => void;
}) => {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/3">
          <div className="relative h-full">
            {member.image ? (
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover md:h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-pink-200 text-pink-900 font-bold text-6xl">
                {member.name}
              </div>
            )}
          </div>
        </div>
        <div className="p-8 md:w-2/3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mb-4 text-pink-500 hover:text-pink-700 hover:bg-pink-50"
          >
            ← Back to Team
          </Button>

          <h2 className="text-3xl font-bold text-pink-900 mb-1">
            {member.name}
          </h2>
          <p className="text-pink-500 font-medium text-lg mb-6">
            {member.role}
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-pink-900 mb-2">
                About
              </h3>
              <p className="text-pink-700">{member.bio}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <Award className="h-5 w-5 text-pink-500 mt-1 mr-2" />
                <div>
                  <h4 className="font-medium text-pink-900">Experience</h4>
                  <p className="text-pink-700">{member.experience}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-pink-900 mb-2">
                Specialties
              </h3>
              <div className="flex flex-wrap gap-2">
                {member.specialties.map((specialty, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="border-pink-200 text-pink-700"
                  >
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>

            <Button
              className="bg-pink-500 hover:bg-pink-600 text-white"
              asChild
            >
              <a href={`/book-now`}>Book an Appointment</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AboutPage() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  // Fetch team members
  useEffect(() => {
    getArtists().then((data) => {
      setTeamMembers(data);
    });
  }, []);

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
              <Users className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Meet Our Team
            </h1>
            <p className="text-lg text-pink-100 mb-8">
              Our talented team of professionals is dedicated to helping you
              look and feel your best. Each member brings unique skills and
              expertise to provide you with exceptional service.
            </p>
          </div>

          {selectedMember ? (
            <TeamMemberDetail
              member={selectedMember}
              onBack={() => setSelectedMember(null)}
            />
          ) : (
            <>
              {/* Team Grid */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {teamMembers.map((member: TeamMember) => (
                  <TeamMemberCard
                    key={member.id}
                    member={member}
                    onClick={() => setSelectedMember(member)}
                  />
                ))}
              </motion.div>
            </>
          )}

          {/* Mission Statement */}
          {!selectedMember && (
            <div className="max-w-3xl mx-auto text-center mt-20 bg-white/10 backdrop-blur-sm p-8 rounded-xl">
              <div className="inline-flex items-center justify-center p-2 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-xl mb-6">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-white">
                Our Mission
              </h2>
              <p className="text-pink-100 mb-6">
                At Bella Artistry, we believe that true beauty comes from
                within. Our mission is to help you discover and enhance your
                natural beauty while building the confidence to shine in every
                aspect of your life. We're committed to providing personalized
                services that celebrate your uniqueness.
              </p>
              <Button
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                asChild
              >
                <a href="/contact">
                  <Mail className="mr-2 h-4 w-4" />
                  Get in Touch
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

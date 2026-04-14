"use client";

import { motion } from "framer-motion";

export function MapSection() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  // Edmonton office location - Guardium Group headquarters (4918 Roper Rd NW, Edmonton, AB T6B3T7)
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2370.8!2d-113.44!3d53.52!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s4918+Roper+Rd+NW%2C+Edmonton%2C+AB+T6B3T7!5e0!3m2!1sen!2sca!4v1680000000000!5m2!1sen!2sca";

  return (
    <motion.section
      initial="visible"
      animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }}
      viewport={{ once: true, margin: "-100px" }}
      className="w-full"
      style={{ height: "450px" }}
    >
      <iframe
        src={mapEmbedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Guardium Group Office Location"
        className="w-full h-full  transition-all duration-500"
      />
    </motion.section>
  );
}

"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, use } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  ExternalLink,
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BreadcrumbHero } from "@/components/breadcrumb-hero";

// Enhanced Company data with rich content
const companiesData: Record<string, {
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  image: string;
  heroImage: string;
  href: string;
  color: string;
  colorLight: string;
  phone: string;
  email: string;
  services: { title: string; description: string; icon: string }[];
  benefits: { title: string; description: string }[];
  stats: { label: string; value: string; suffix?: string }[];
  process: { step: number; title: string; description: string }[];
  testimonials: { name: string; role: string; company: string; text: string; rating: number }[];
  faqs: { question: string; answer: string }[];
  certifications: string[];
}> = {
  towing: {
    name: "Guardium Towing",
    tagline: "24/7  Towing & Roadside Assistance",
    description: "24/7 towing and roadside assistance services across Edmonton and surrounding areas.",
    longDescription: "When you're stranded on the road, every minute counts. Guardium Towing provides fast, reliable, and professional towing and roadside assistance services throughout Edmonton and the Greater Alberta region. Our experienced operators and modern fleet ensure you get the help you need, when you need it most.",
    image: "/companies/towing.png",
    heroImage: "/images/hero-2.jpg",
    href: "https://guardiumtowing.com",
    color: "bg-red-600",
    colorLight: "bg-red-50",
    phone: "+1 780-809-7860",
    email: "dispatch@guardiumtowing.com",
    services: [
      { title: "24/7 Emergency Towing", description: "Round-the-clock emergency towing services with rapid response times across Edmonton.", icon: "clock" },
      { title: "Flatbed Towing", description: "Safe transportation for luxury, classic, and low-clearance vehicles on our modern flatbed trucks.", icon: "truck" },
      { title: "Heavy Duty Towing", description: "Commercial vehicle recovery and towing for trucks, buses, and industrial equipment.", icon: "weight" },
      { title: "Roadside Assistance", description: "Jump starts, tire changes, lockouts, and fuel delivery to get you back on the road.", icon: "wrench" },
      { title: "Accident Recovery", description: "Professional accident scene cleanup and vehicle recovery with care and discretion.", icon: "shield" },
      { title: "Long Distance Towing", description: "Reliable long-distance vehicle transport across Alberta and beyond.", icon: "map" },
      { title: "Motorcycle Towing", description: "Specialized equipment and trained operators for safe motorcycle transport.", icon: "bike" },
      { title: "Winch & Recovery", description: "Expert winch-out services for vehicles stuck in ditches, mud, or snow.", icon: "anchor" }
    ],
    benefits: [
      { title: "Rapid Response Time", description: "Average arrival time of 30 minutes or less within Edmonton city limits." },
      { title: "Modern Fleet", description: "State-of-the-art tow trucks equipped with the latest technology and safety features." },
      { title: "Trained Professionals", description: "All operators are certified, insured, and undergo rigorous background checks." },
      { title: "Transparent Pricing", description: "Upfront quotes with no hidden fees. Pay only what you're quoted." },
      { title: "GPS Tracking", description: "Real-time tracking so you always know where your vehicle is." }
    ],
    stats: [
      { label: "Years of Experience", value: "15", suffix: "+" },
      { label: "Vehicles in Fleet", value: "50", suffix: "+" },
      { label: "Calls Answered Annually", value: "10", suffix: "K+" },
      { label: "Customer Satisfaction", value: "98", suffix: "%" }
    ],
    process: [
      { step: 1, title: "Call Us", description: "Reach our 24/7 dispatch center at any time. We're always here to help." },
      { step: 2, title: "Get a Quote", description: "Receive an instant, transparent quote with no hidden fees or surprises." },
      { step: 3, title: "Track Arrival", description: "Monitor your tow truck's location in real-time as it heads to you." },
      { step: 4, title: "Safe Delivery", description: "Your vehicle is safely transported to your destination of choice." }
    ],
    testimonials: [
      { name: "Michael R.", role: "Vehicle Owner", company: "Edmonton", text: "Stranded at 2 AM on the Henday, and Guardium had a truck to me in 25 minutes. Professional service when I needed it most.", rating: 5 },
      { name: "Sarah K.", role: "Fleet Manager", company: "ABC Logistics", text: "We've used Guardium for our fleet needs for 3 years. Reliable, professional, and always fair pricing.", rating: 5 },
      { name: "David L.", role: "Classic Car Enthusiast", company: "Edmonton", text: "Trusted them with my 1967 Mustang. The flatbed service was impeccable. Highly recommend!", rating: 5 }
    ],
    faqs: [
      { question: "How quickly can you arrive?", answer: "Our average response time within Edmonton city limits is 30 minutes or less. Rural areas may take slightly longer depending on location." },
      { question: "Do you tow all types of vehicles?", answer: "Yes! We tow everything from motorcycles to heavy-duty commercial vehicles. Our diverse fleet ensures we have the right equipment for any job." },
      { question: "What forms of payment do you accept?", answer: "We accept all major credit cards, debit, cash, and can direct bill to most insurance companies and roadside assistance programs." },
      { question: "Are you available on holidays?", answer: "Absolutely. We operate 24/7/365, including all holidays. Emergencies don't take days off, and neither do we." },
      { question: "Do you offer roadside assistance memberships?", answer: "Yes, we offer annual membership plans that provide priority service and discounted rates. Contact us for details." }
    ],
    certifications: ["WreckMaster Certified", "ARA Member", "BBB A+ Rating", "Fully Insured", "CAA Approved"]
  },
  security: {
    name: "Guardium Security",
    tagline: "Professional Security Solutions You Can Trust",
    description: "Professional security services including guards, patrols, and surveillance solutions.",
    longDescription: "In an unpredictable world, security isn't a luxury—it's a necessity. Guardium Security delivers comprehensive protection solutions for businesses, events, and properties across Alberta. Our highly trained security professionals combine vigilance with professionalism to safeguard what matters most to you.",
    image: "/companies/security.png",
    heroImage: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=1920&q=80",
    href: "https://guardiumsecurity.com",
    color: "bg-blue-600",
    colorLight: "bg-blue-50",
    phone: "+1 780-809-7860",
    email: "info@guardiumsecurity.com",
    services: [
      { title: "Security Guard Services", description: "Uniformed and plainclothes security officers for any environment or situation.", icon: "shield" },
      { title: "Mobile Patrol", description: "Regular patrol services with documented check-ins and incident reporting.", icon: "car" },
      { title: "Event Security", description: "Crowd management, access control, and VIP protection for events of all sizes.", icon: "users" },
      { title: "Concierge Security", description: "Professional front-desk security combining hospitality with protection.", icon: "building" },
      { title: "Loss Prevention", description: "Retail security solutions to minimize theft and protect your bottom line.", icon: "eye" },
      { title: "CCTV Monitoring", description: "24/7 remote video monitoring with rapid response protocols.", icon: "camera" },
      { title: "Access Control", description: "Electronic access systems, key management, and visitor protocols.", icon: "key" },
      { title: "Emergency Response", description: "Rapid deployment teams for urgent security situations.", icon: "alert" }
    ],
    benefits: [
      { title: "Licensed & Bonded", description: "All officers are provincially licensed, bonded, and thoroughly vetted." },
      { title: "24/7 Operations Center", description: "Round-the-clock dispatch and monitoring from our central command." },
      { title: "Custom Security Plans", description: "Tailored security solutions designed for your specific needs and budget." },
      { title: "Real-Time Reporting", description: "Digital incident reports and activity logs accessible anytime." },
      { title: "Ongoing Training", description: "Continuous professional development ensures top-tier service." }
    ],
    stats: [
      { label: "Security Officers", value: "200", suffix: "+" },
      { label: "Properties Protected", value: "500", suffix: "+" },
      { label: "Years in Business", value: "12", suffix: "+" },
      { label: "Client Retention", value: "95", suffix: "%" }
    ],
    process: [
      { step: 1, title: "Consultation", description: "Free security assessment to understand your unique needs and vulnerabilities." },
      { step: 2, title: "Custom Plan", description: "We design a comprehensive security solution tailored to your requirements." },
      { step: 3, title: "Implementation", description: "Professional deployment of security personnel and systems." },
      { step: 4, title: "Ongoing Support", description: "Continuous monitoring, reporting, and plan optimization." }
    ],
    testimonials: [
      { name: "Jennifer M.", role: "Property Manager", company: "Skyline Properties", text: "Guardium Security transformed our building's safety. Incidents dropped 80% in the first year.", rating: 5 },
      { name: "Robert T.", role: "Event Coordinator", company: "Edmonton Events Co.", text: "Professional, discreet, and incredibly organized. They made our 5,000-person event run smoothly.", rating: 5 },
      { name: "Amanda S.", role: "Store Manager", company: "Retail Chain", text: "Shrinkage reduced significantly since partnering with Guardium. Worth every penny.", rating: 5 }
    ],
    faqs: [
      { question: "Are your security guards licensed?", answer: "Yes, all our security personnel hold valid Alberta Security Services licenses and undergo thorough background checks." },
      { question: "Can you provide armed security?", answer: "Yes, we offer armed security services for situations that require enhanced protection, subject to proper licensing and protocols." },
      { question: "Do you offer temporary security services?", answer: "Absolutely. We provide security for one-time events, construction sites, or temporary needs of any duration." },
      { question: "How do you handle emergencies?", answer: "Our 24/7 operations center monitors all sites and can dispatch rapid response teams within minutes when needed." },
      { question: "Can I access security reports online?", answer: "Yes, clients have access to our online portal for real-time incident reports, activity logs, and analytics." }
    ],
    certifications: ["ASIS Certified", "Alberta Licensed", "ISO 9001", "BBB Accredited", "WorkSafe Certified"]
  },
  logistics: {
    name: "Guardium Logistics",
    tagline: "Efficient Freight & Supply Chain Solutions",
    description: "Comprehensive freight and logistics solutions for businesses of all sizes.",
    longDescription: "In today's fast-paced business environment, efficient logistics can make or break your competitive edge. Guardium Logistics provides end-to-end supply chain solutions that optimize your operations, reduce costs, and ensure your products reach their destination on time, every time.",
    image: "/companies/logistics.png",
    heroImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80",
    href: "https://guardiumlogistics.com",
    color: "bg-green-600",
    colorLight: "bg-green-50",
    phone: "+1 780-809-7860",
    email: "logistics@guardiumlogistics.com",
    services: [
      { title: "Freight Transportation", description: "Full truckload, LTL, and expedited shipping across North America.", icon: "truck" },
      { title: "Warehousing", description: "Secure, climate-controlled storage facilities with inventory management.", icon: "warehouse" },
      { title: "Supply Chain Management", description: "End-to-end visibility and optimization of your entire supply chain.", icon: "link" },
      { title: "Cross-Docking", description: "Efficient transfer operations to minimize storage time and costs.", icon: "refresh" },
      { title: "Inventory Management", description: "Real-time tracking, forecasting, and automated reordering systems.", icon: "clipboard" },
      { title: "Last-Mile Delivery", description: "Reliable final-leg delivery to end customers and retail locations.", icon: "home" },
      { title: "Temperature-Controlled", description: "Refrigerated transport and storage for sensitive products.", icon: "thermometer" },
      { title: "Customs Brokerage", description: "Seamless cross-border shipping with full compliance support.", icon: "globe" }
    ],
    benefits: [
      { title: "Coast-to-Coast Network", description: "Comprehensive coverage across Canada and the United States." },
      { title: "Real-Time Tracking", description: "GPS-enabled visibility for every shipment from pickup to delivery." },
      { title: "Scalable Solutions", description: "Services that grow with your business, from startup to enterprise." },
      { title: "Dedicated Support", description: "Personal account managers who understand your business needs." },
      { title: "Technology Integration", description: "Seamless API integration with your existing systems." }
    ],
    stats: [
      { label: "Deliveries Per Year", value: "50", suffix: "K+" },
      { label: "Warehouse Space", value: "100", suffix: "K sq ft" },
      { label: "On-Time Delivery", value: "99", suffix: "%" },
      { label: "Partner Carriers", value: "150", suffix: "+" }
    ],
    process: [
      { step: 1, title: "Assessment", description: "We analyze your logistics needs, volumes, and delivery requirements." },
      { step: 2, title: "Solution Design", description: "Custom logistics strategy optimized for efficiency and cost savings." },
      { step: 3, title: "Integration", description: "Seamless onboarding and system integration with your operations." },
      { step: 4, title: "Optimization", description: "Continuous improvement through data analysis and feedback." }
    ],
    testimonials: [
      { name: "Chris P.", role: "Operations Director", company: "National Retailer", text: "Guardium reduced our shipping costs by 22% while improving delivery times. Exceptional partner.", rating: 5 },
      { name: "Lisa W.", role: "Supply Chain Manager", company: "Manufacturing Co.", text: "Their warehouse management transformed our inventory accuracy from 91% to 99.7%.", rating: 5 },
      { name: "Mark H.", role: "E-commerce Owner", company: "Online Store", text: "Scaling from 100 to 10,000 orders monthly was seamless with Guardium's fulfillment services.", rating: 5 }
    ],
    faqs: [
      { question: "What areas do you service?", answer: "We provide logistics services across all of Canada and the United States." },
      { question: "Can you handle hazardous materials?", answer: "Yes, we have certified drivers and equipment for transporting hazardous materials in compliance with all regulations." },
      { question: "Do you offer expedited shipping?", answer: "Absolutely. We offer same-day, next-day, and time-critical delivery options for urgent shipments." },
      { question: "How do I track my shipments?", answer: "All shipments include real-time GPS tracking accessible through our online portal or mobile app." },
      { question: "Can you integrate with our systems?", answer: "Yes, we offer API integration with most ERP, WMS, and e-commerce platforms for seamless operations." }
    ],
    certifications: ["SmartWay Certified", "C-TPAT Certified", "ISO 9001", "FAST Approved", "PIP Certified"]
  },
  courier: {
    name: "Guardium Courier",
    tagline: "Fast & Reliable Delivery Services",
    description: "Fast and reliable courier and delivery services throughout Alberta.",
    longDescription: "When time is of the essence, Guardium Courier delivers. Our fleet of professional couriers provides swift, secure, and reliable delivery services for businesses and individuals across Alberta. From urgent documents to fragile packages, we handle every delivery with care and precision.",
    image: "/companies/courier.png",
    heroImage: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1920&q=80",
    href: "https://guardiumcourier.com",
    color: "bg-orange-600",
    colorLight: "bg-orange-50",
    phone: "+1 780-809-7860",
    email: "delivery@guardiumcourier.com",
    services: [
      { title: "Same-Day Delivery", description: "Urgent deliveries picked up and delivered within hours across the city.", icon: "zap" },
      { title: "Next-Day Delivery", description: "Reliable overnight shipping for time-sensitive packages.", icon: "clock" },
      { title: "Scheduled Routes", description: "Regular pickup and delivery routes tailored to your business needs.", icon: "calendar" },
      { title: "Medical Courier", description: "Specialized handling for medical specimens, equipment, and supplies.", icon: "heart" },
      { title: "Legal Documents", description: "Secure, chain-of-custody delivery for sensitive legal materials.", icon: "file" },
      { title: "E-Commerce Fulfillment", description: "Integrated shipping solutions for online retailers.", icon: "shopping" },
      { title: "White Glove Service", description: "Premium handling for high-value and fragile items.", icon: "star" },
      { title: "Dedicated Drivers", description: "Exclusive courier service for high-volume or specialized needs.", icon: "user" }
    ],
    benefits: [
      { title: "Real-Time Tracking", description: "Follow your package from pickup to delivery with live GPS tracking." },
      { title: "Proof of Delivery", description: "Photo confirmation and digital signatures for every delivery." },
      { title: "Flexible Windows", description: "Schedule deliveries for specific time slots that work for you." },
      { title: "Secure Handling", description: "Chain-of-custody protocols for sensitive and valuable items." },
      { title: "Volume Discounts", description: "Competitive rates that improve with your shipping volume." }
    ],
    stats: [
      { label: "Deliveries Daily", value: "500", suffix: "+" },
      { label: "Coverage Area", value: "5000", suffix: " km²" },
      { label: "On-Time Rate", value: "99.5", suffix: "%" },
      { label: "Courier Fleet", value: "75", suffix: "+" }
    ],
    process: [
      { step: 1, title: "Book Online", description: "Schedule your pickup through our app, website, or by phone." },
      { step: 2, title: "Pickup", description: "Our courier arrives at your location to collect the package." },
      { step: 3, title: "Track", description: "Monitor your delivery in real-time every step of the way." },
      { step: 4, title: "Delivered", description: "Receive instant confirmation with photo proof of delivery." }
    ],
    testimonials: [
      { name: "Dr. Sarah M.", role: "Clinic Director", company: "Medical Center", text: "Guardium's medical courier service is essential to our operations. Always on time, always professional.", rating: 5 },
      { name: "James T.", role: "Law Office Manager", company: "Legal Firm", text: "We trust Guardium with our most time-sensitive legal documents. Never had an issue in 4 years.", rating: 5 },
      { name: "Emily R.", role: "E-commerce Owner", company: "Online Boutique", text: "My customers love the fast delivery and tracking. It's given us a competitive edge.", rating: 5 }
    ],
    faqs: [
      { question: "How fast is same-day delivery?", answer: "Same-day deliveries within Edmonton are typically completed within 2-4 hours of pickup, depending on distance and traffic." },
      { question: "Do you deliver on weekends?", answer: "Yes, we offer Saturday and Sunday delivery services for an additional fee. Holiday delivery is also available." },
      { question: "Can you handle fragile items?", answer: "Absolutely. Our white glove service includes specialized packaging and handling for fragile, high-value items." },
      { question: "What if no one is available to receive?", answer: "We offer flexible options including safe drop locations, neighbor delivery, or rescheduling at no extra charge." },
      { question: "Do you offer business accounts?", answer: "Yes, we offer corporate accounts with invoicing, volume discounts, and dedicated account management." }
    ],
    certifications: ["HIPAA Compliant", "Background Checked", "Insured Deliveries", "GPS Tracked", "Climate Controlled"]
  },
  technologies: {
    name: "Guardium Technologies",
    tagline: "Innovative Technology Solutions for Modern Business",
    description: "Innovative technology solutions including web development and IT services.",
    longDescription: "Technology drives modern business success. Guardium Technologies empowers organizations with cutting-edge software solutions, robust IT infrastructure, and digital transformation services. From startups to enterprises, we help businesses harness technology to achieve their goals and stay ahead of the competition.",
    image: "/companies/tech.png",
    heroImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80",
    href: "https://guardiumtech.com",
    color: "bg-purple-600",
    colorLight: "bg-purple-50",
    phone: "+1 780-809-7860",
    email: "hello@guardiumtech.com",
    services: [
      { title: "Custom Software", description: "Bespoke applications built to solve your unique business challenges.", icon: "code" },
      { title: "Web Development", description: "Modern, responsive websites and web applications that drive results.", icon: "globe" },
      { title: "Mobile Apps", description: "Native and cross-platform mobile applications for iOS and Android.", icon: "smartphone" },
      { title: "Cloud Solutions", description: "Migration, optimization, and management of cloud infrastructure.", icon: "cloud" },
      { title: "Cybersecurity", description: "Comprehensive security assessments, implementation, and monitoring.", icon: "shield" },
      { title: "IT Management", description: "Proactive IT support and infrastructure management services.", icon: "server" },
      { title: "Data Analytics", description: "Business intelligence and data visualization solutions.", icon: "chart" },
      { title: "AI & Automation", description: "Intelligent automation solutions to streamline operations.", icon: "cpu" }
    ],
    benefits: [
      { title: "Experienced Team", description: "50+ developers, designers, and engineers with diverse expertise." },
      { title: "Agile Methodology", description: "Flexible, iterative development with regular client collaboration." },
      { title: "Full-Stack Capabilities", description: "End-to-end solutions from design to deployment and beyond." },
      { title: "Security First", description: "Built-in security at every layer of development and operations." },
      { title: "Ongoing Support", description: "24/7 support and maintenance to keep your systems running smoothly." }
    ],
    stats: [
      { label: "Projects Delivered", value: "200", suffix: "+" },
      { label: "Happy Clients", value: "150", suffix: "+" },
      { label: "Team Members", value: "50", suffix: "+" },
      { label: "Uptime Guarantee", value: "99.9", suffix: "%" }
    ],
    process: [
      { step: 1, title: "Discovery", description: "Deep dive into your business needs, goals, and technical requirements." },
      { step: 2, title: "Design", description: "UI/UX design and technical architecture planning." },
      { step: 3, title: "Development", description: "Agile development with regular demos and feedback cycles." },
      { step: 4, title: "Launch & Support", description: "Deployment, training, and ongoing maintenance and optimization." }
    ],
    testimonials: [
      { name: "Alex K.", role: "CEO", company: "Tech Startup", text: "Guardium built our MVP in 8 weeks. We secured funding 2 months later. Incredible partners.", rating: 5 },
      { name: "Michelle L.", role: "IT Director", company: "Healthcare Org", text: "Their cybersecurity assessment found vulnerabilities we didn't know existed. Invaluable service.", rating: 5 },
      { name: "Ryan P.", role: "Operations Manager", company: "Manufacturing", text: "The custom ERP they built saved us 20 hours per week in manual processes.", rating: 5 }
    ],
    faqs: [
      { question: "What technologies do you work with?", answer: "We work with modern technologies including React, Next.js, Node.js, Python, AWS, Azure, and many more. We choose the best tools for each project." },
      { question: "How long does a typical project take?", answer: "Project timelines vary based on scope. A simple website might take 4-6 weeks, while complex applications can take 3-6 months or more." },
      { question: "Do you provide ongoing support?", answer: "Yes, we offer various support and maintenance packages including 24/7 emergency support, regular updates, and continuous improvement." },
      { question: "Can you work with our existing systems?", answer: "Absolutely. We specialize in integrations and can connect new solutions with your existing software, databases, and third-party services." },
      { question: "What about intellectual property?", answer: "You own 100% of the code and intellectual property we create for you. It's your project, your property." }
    ],
    certifications: ["ISO 27001", "SOC 2 Type II", "AWS Partner", "Microsoft Partner", "Google Cloud Partner"]
  },
  "property-services": {
    name: "Guardium Property Services",
    tagline: "Complete Property Management & Contracting",
    description: "Property management and general contracting services.",
    longDescription: "Your property is one of your most valuable assets. Guardium Property Services provides comprehensive property management and general contracting solutions that protect and enhance your investment. From routine maintenance to major renovations, our experienced team delivers quality workmanship and peace of mind.",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80",
    heroImage: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1920&q=80",
    href: "https://guardiumgc.com",
    color: "bg-yellow-600",
    colorLight: "bg-yellow-50",
    phone: "+1 780-809-7860",
    email: "property@guardiumgc.com",
    services: [
      { title: "Property Management", description: "Full-service management for residential and commercial properties.", icon: "building" },
      { title: "General Contracting", description: "Licensed contracting services for construction and renovation projects.", icon: "hammer" },
      { title: "Renovations", description: "Kitchen, bathroom, basement, and whole-home renovation services.", icon: "paintbrush" },
      { title: "Maintenance", description: "Preventive and reactive maintenance to keep properties in top condition.", icon: "wrench" },
      { title: "Tenant Services", description: "Tenant screening, placement, and relationship management.", icon: "users" },
      { title: "Inspections", description: "Regular property inspections with detailed reports and recommendations.", icon: "clipboard" },
      { title: "Emergency Repairs", description: "24/7 emergency response for urgent property issues.", icon: "alert" },
      { title: "Commercial Build-Outs", description: "Tenant improvements and commercial space customization.", icon: "store" }
    ],
    benefits: [
      { title: "Licensed Contractors", description: "All work performed by certified, licensed professionals." },
      { title: "Comprehensive Insurance", description: "Full liability coverage for your protection and peace of mind." },
      { title: "Transparent Pricing", description: "Detailed quotes with no hidden costs or surprise fees." },
      { title: "Quality Guarantee", description: "We stand behind our work with comprehensive warranties." },
      { title: "Local Expertise", description: "Deep knowledge of Edmonton's property market and regulations." }
    ],
    stats: [
      { label: "Properties Managed", value: "300", suffix: "+" },
      { label: "Projects Completed", value: "500", suffix: "+" },
      { label: "Years Experience", value: "10", suffix: "+" },
      { label: "Client Satisfaction", value: "97", suffix: "%" }
    ],
    process: [
      { step: 1, title: "Consultation", description: "Free property assessment and project consultation." },
      { step: 2, title: "Proposal", description: "Detailed scope of work, timeline, and transparent pricing." },
      { step: 3, title: "Execution", description: "Professional project management and quality workmanship." },
      { step: 4, title: "Completion", description: "Final walkthrough, documentation, and ongoing support." }
    ],
    testimonials: [
      { name: "Patricia H.", role: "Property Owner", company: "Rental Portfolio", text: "Guardium manages 12 of my rental units. Vacancies are down, and my stress is gone. Best decision I made.", rating: 5 },
      { name: "Tom S.", role: "Business Owner", company: "Retail Store", text: "They completed our store build-out on time and under budget. Professional from start to finish.", rating: 5 },
      { name: "Karen M.", role: "Homeowner", company: "Edmonton", text: "Our kitchen renovation exceeded expectations. The team was respectful, clean, and incredibly skilled.", rating: 5 }
    ],
    faqs: [
      { question: "What areas do you serve?", answer: "We provide services throughout Edmonton and the Greater Edmonton Area, including St. Albert, Sherwood Park, and surrounding communities." },
      { question: "Are you licensed and insured?", answer: "Yes, we are fully licensed general contractors with comprehensive liability insurance and WCB coverage." },
      { question: "How do you handle maintenance emergencies?", answer: "We have a 24/7 emergency line for urgent issues. Our team can typically respond to emergencies within 2-4 hours." },
      { question: "What are your property management fees?", answer: "Our management fees are competitive and transparent, typically ranging from 8-12% of monthly rent depending on property type and services required." },
      { question: "Do you provide references?", answer: "Absolutely. We're happy to connect you with current clients who can speak to our quality of work and service." }
    ],
    certifications: ["Licensed GC", "WCB Covered", "BBB A+ Rating", "COR Certified", "Bonded & Insured"]
  },
  staffing: {
    name: "Guardium Staffing",
    tagline: "Connecting Talent with Opportunity",
    description: "Staffing solutions connecting businesses with qualified professionals.",
    longDescription: "Finding the right talent is critical to business success. Guardium Staffing bridges the gap between exceptional candidates and outstanding employers. Whether you need temporary staff, permanent placements, or specialized recruitment, our team delivers qualified professionals who fit your culture and exceed expectations.",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80",
    heroImage: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&q=80",
    href: "https://guardiumstaffing.com",
    color: "bg-teal-600",
    colorLight: "bg-teal-50",
    phone: "+1 780-809-7860",
    email: "careers@guardiumstaffing.com",
    services: [
      { title: "Temporary Staffing", description: "Qualified temporary workers to handle seasonal or project-based needs.", icon: "clock" },
      { title: "Permanent Placement", description: "Full recruitment services to find your next great hire.", icon: "user-plus" },
      { title: "Contract-to-Hire", description: "Try before you commit with our contract-to-permanent program.", icon: "handshake" },
      { title: "Executive Search", description: "Specialized recruitment for senior and executive-level positions.", icon: "briefcase" },
      { title: "Payroll Services", description: "Compliant payroll processing and administration.", icon: "dollar" },
      { title: "HR Consulting", description: "Expert guidance on HR policies, compliance, and best practices.", icon: "file-text" },
      { title: "Skills Assessment", description: "Comprehensive testing and evaluation of candidate capabilities.", icon: "check-circle" },
      { title: "Workforce Planning", description: "Strategic staffing analysis and planning for future needs.", icon: "trending-up" }
    ],
    benefits: [
      { title: "Extensive Network", description: "Access to thousands of pre-screened candidates across industries." },
      { title: "Thorough Vetting", description: "Comprehensive background checks, reference verification, and skills testing." },
      { title: "Industry Expertise", description: "Specialized recruiters who understand your sector's unique needs." },
      { title: "Fast Placement", description: "Quick turnaround times without compromising on quality." },
      { title: "Guarantee Period", description: "Replacement guarantee if a placement doesn't work out." }
    ],
    stats: [
      { label: "Placements Made", value: "5000", suffix: "+" },
      { label: "Client Companies", value: "200", suffix: "+" },
      { label: "Candidate Database", value: "25", suffix: "K+" },
      { label: "Retention Rate", value: "92", suffix: "%" }
    ],
    process: [
      { step: 1, title: "Understand", description: "We learn about your company culture, role requirements, and ideal candidate profile." },
      { step: 2, title: "Source", description: "Our recruiters tap our network and actively source qualified candidates." },
      { step: 3, title: "Screen", description: "Rigorous interviews, skills testing, and background verification." },
      { step: 4, title: "Present", description: "You receive a shortlist of top candidates ready for your interviews." }
    ],
    testimonials: [
      { name: "Derek M.", role: "HR Director", company: "Manufacturing Company", text: "Guardium filled 15 positions in 3 weeks during our expansion. Quality candidates, fast service.", rating: 5 },
      { name: "Susan L.", role: "Office Manager", company: "Law Firm", text: "They found us an amazing legal assistant who's now been with us 3 years. Perfect match.", rating: 5 },
      { name: "Kevin R.", role: "Operations VP", company: "Logistics Company", text: "Their temp-to-perm program let us find great warehouse staff with minimal risk.", rating: 5 }
    ],
    faqs: [
      { question: "What industries do you specialize in?", answer: "We serve diverse industries including administrative, industrial, IT, healthcare, hospitality, construction, and more." },
      { question: "How do you screen candidates?", answer: "Our process includes interviews, skills assessments, background checks, reference verification, and drug testing when required." },
      { question: "What if a placement doesn't work out?", answer: "We offer a guarantee period. If a permanent placement doesn't work out within the guarantee period, we'll find a replacement at no additional cost." },
      { question: "How quickly can you fill positions?", answer: "Temporary positions can often be filled within 24-48 hours. Permanent placements typically take 2-4 weeks depending on the role." },
      { question: "Do you handle payroll for temp workers?", answer: "Yes, we're the employer of record for temporary staff, handling all payroll, taxes, workers' compensation, and benefits." }
    ],
    certifications: ["ASA Member", "BBB Accredited", "Equal Opportunity", "Background Check Certified", "WCB Covered"]
  },
  consulting: {
    name: "Guardium Consulting",
    tagline: "Strategic Business Solutions for Growth",
    description: "Strategic business consulting to help companies grow and succeed.",
    longDescription: "Every business faces challenges and opportunities. Guardium Consulting provides expert advisory services that help organizations navigate complexity, optimize operations, and achieve sustainable growth. Our consultants bring deep industry knowledge, proven methodologies, and a commitment to delivering measurable results.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80",
    heroImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=80",
    href: "https://guardiumconsulting.com",
    color: "bg-indigo-600",
    colorLight: "bg-indigo-50",
    phone: "+1 780-809-7860",
    email: "consulting@guardiumconsulting.com",
    services: [
      { title: "Business Strategy", description: "Strategic planning, market positioning, and competitive analysis.", icon: "target" },
      { title: "Operations Consulting", description: "Process optimization, efficiency improvements, and operational excellence.", icon: "settings" },
      { title: "Financial Advisory", description: "Financial planning, analysis, and performance optimization.", icon: "dollar" },
      { title: "Market Research", description: "Customer insights, market analysis, and opportunity identification.", icon: "search" },
      { title: "Process Improvement", description: "Lean, Six Sigma, and continuous improvement methodologies.", icon: "trending-up" },
      { title: "Change Management", description: "Organizational change planning and implementation support.", icon: "refresh" },
      { title: "Risk Assessment", description: "Enterprise risk identification, analysis, and mitigation strategies.", icon: "shield" },
      { title: "Growth Planning", description: "Expansion strategies, M&A support, and scaling roadmaps.", icon: "chart" }
    ],
    benefits: [
      { title: "Senior Expertise", description: "Consultants with 15+ years of industry and leadership experience." },
      { title: "Data-Driven", description: "Recommendations backed by rigorous analysis and proven frameworks." },
      { title: "Customized Approach", description: "Solutions tailored to your unique situation, not cookie-cutter templates." },
      { title: "Measurable Results", description: "Clear KPIs and accountability for tangible business outcomes." },
      { title: "Knowledge Transfer", description: "We build your team's capabilities, not just solve problems." }
    ],
    stats: [
      { label: "Clients Served", value: "100", suffix: "+" },
      { label: "Revenue Generated", value: "50", suffix: "M+" },
      { label: "Success Rate", value: "94", suffix: "%" },
      { label: "Industries Covered", value: "15", suffix: "+" }
    ],
    process: [
      { step: 1, title: "Diagnose", description: "Comprehensive assessment of your current state and challenges." },
      { step: 2, title: "Design", description: "Development of customized strategies and solutions." },
      { step: 3, title: "Implement", description: "Hands-on support to execute plans and drive change." },
      { step: 4, title: "Sustain", description: "Performance monitoring and continuous optimization." }
    ],
    testimonials: [
      { name: "Margaret P.", role: "CEO", company: "Mid-Size Manufacturer", text: "Guardium helped us increase margins by 18% through operational improvements. ROI in 6 months.", rating: 5 },
      { name: "Brian T.", role: "Founder", company: "Tech Startup", text: "Their strategic guidance was instrumental in our Series A funding. True partners in growth.", rating: 5 },
      { name: "Nancy K.", role: "COO", company: "Healthcare Provider", text: "The process improvements they implemented saved us $2M annually. Exceptional team.", rating: 5 }
    ],
    faqs: [
      { question: "What size companies do you work with?", answer: "We work with organizations of all sizes, from startups to enterprises. Our solutions scale to fit your needs and budget." },
      { question: "How do you charge for services?", answer: "We offer flexible engagement models including project-based fees, retainers, and performance-based arrangements depending on the scope." },
      { question: "How long is a typical engagement?", answer: "Engagements vary from focused 2-4 week assessments to multi-month transformation programs. We scope each project to deliver maximum value." },
      { question: "Do you implement recommendations?", answer: "Yes, we can support implementation as much or as little as you need, from advisory support to hands-on execution." },
      { question: "What industries do you specialize in?", answer: "Our team has deep expertise in manufacturing, technology, healthcare, retail, professional services, and more." }
    ],
    certifications: ["CMC Certified", "PMP Certified", "Six Sigma Black Belt", "MBA Credentials", "Industry Awards"]
  }
};

// Get all company slugs for related companies section
const allCompanySlugs = Object.keys(companiesData);

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const company = companiesData[slug];
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  if (!company) {
    notFound();
  }

  // Get related companies (excluding current)
  const relatedCompanies = allCompanySlugs
    .filter(s => s !== slug)
    .slice(0, 4)
    .map(s => ({ slug: s, ...companiesData[s] }));

  return (
    <main className="overflow-hidden">
      {/* Breadcrumb Hero */}
      <BreadcrumbHero
        title={company.name}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Companies", href: "/companies" },
          { label: company.name },
        ]}
      />

      {/* Services Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${company.colorLight} ${company.color.replace('bg-', 'text-')} mb-4`}>
              Our Services
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comprehensive Solutions for Your Needs
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer a full range of services designed to meet your specific requirements and exceed your expectations.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {company.services.map((service, index) => (
              <motion.div key={service.title} variants={fadeInUp}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 group border-0 border-gray-500 ">
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 ${company.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                      <Zap className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works / Process Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-14"
          >
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${company.colorLight} ${company.color.replace('bg-', 'text-')} mb-4`}>
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Simple Process, Exceptional Results
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Getting started is easy. Here&apos;s how we work together.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 max-w-6xl mx-auto">
            {company.process.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className={`bg-white rounded-2xl p-6 h-full border-l-4 ${company.color.replace('bg-', 'border-')} shadow-sm hover:shadow-md transition-shadow`}>
                  {/* Step Number Badge */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${company.colorLight} ${company.color.replace('bg-', 'text-')} font-bold text-lg`}>
                      {step.step}
                    </span>
                    <div className="h-px flex-1 bg-gray-200" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Benefits */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${company.colorLight} ${company.color.replace('bg-', 'text-')} mb-4`}>
                Why Choose Us
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                The {company.name.split(' ')[1]} Difference
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                As part of the Guardium Group of Companies, we combine the strength of a diversified conglomerate with specialized expertise to deliver unmatched value.
              </p>

              <div className="space-y-6">
                {company.benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className={`w-12 h-12 ${company.colorLight} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <CheckCircle className={`w-6 h-6 ${company.color.replace('bg-', 'text-')}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                      <p className="text-gray-600 text-sm">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={company.heroImage}
                  alt={company.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Floating Stats Card */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur rounded-2xl p-6">
                  <div className="grid grid-cols-3 gap-4">
                    {company.stats.slice(0, 3).map((stat) => (
                      <div key={stat.label} className="text-center">
                        <div className={`text-2xl font-bold ${company.color.replace('bg-', 'text-')}`}>
                          {stat.value}{stat.suffix}
                        </div>
                        <div className="text-xs text-gray-600">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={`py-24 ${company.color}`}>
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-white/20 text-white mb-4">
              Customer Stories
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What Our Clients Say
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our customers have to say about working with us.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {company.testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bg-white/10 backdrop-blur border-white/20 text-white">
                  <CardContent className="p-8">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <Quote className="w-10 h-10 text-white/30 mb-4" />
                    <p className="text-white/90 mb-6 leading-relaxed">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-lg font-semibold">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-white/70">{testimonial.role}, {testimonial.company}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${company.colorLight} ${company.color.replace('bg-', 'text-')} mb-4`}>
                FAQ
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 mb-8">
                Have questions? We've got answers. If you don't see what you're looking for, feel free to contact us directly.
              </p>

              <div className="bg-gray-50 rounded-2xl p-8">
                <h3 className="font-semibold text-gray-900 mb-4">Still have questions?</h3>
                <p className="text-gray-600 mb-6">
                  Our team is here to help. Reach out and we'll get back to you as soon as possible.
                </p>
                <div className="space-y-3">
                  <a href={`tel:${company.phone}`} className="flex items-center gap-3 text-gray-700 hover:text-primary transition-colors">
                    <Phone className="w-5 h-5" />
                    {company.phone}
                  </a>
                  <a href={`mailto:${company.email}`} className="flex items-center gap-3 text-gray-700 hover:text-primary transition-colors">
                    <Mail className="w-5 h-5" />
                    {company.email}
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Accordion type="single" collapsible className="space-y-4">
                {company.faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`} className="bg-gray-50 rounded-xl px-6 border-0">
                    <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 pb-5">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image src={company.heroImage} alt="" fill className="object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Contact us today to learn how {company.name} can help you achieve your goals. Our team is standing by to answer your questions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className={`${company.color} hover:opacity-90 text-lg px-8`} asChild>
                <a href={`tel:${company.phone}`}>
                  <Phone className="mr-2 h-5 w-5" />
                  {company.phone}
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 text-lg px-8" asChild>
                <a href={company.href} target="_blank" rel="noreferrer">
                  Visit Website
                  <ExternalLink className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Companies / Cross-Sell */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
              Guardium Group
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Explore Our Other Companies
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {company.name} is part of the Guardium Group family. Discover our other trusted brands and services.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedCompanies.map((related, index) => (
              <motion.div
                key={related.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/companies/${related.slug}`}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 group overflow-hidden">
                    <div className="relative h-40 overflow-hidden">
                      <Image
                        src={related.image}
                        alt={related.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white font-semibold">{related.name}</h3>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {related.description}
                      </p>
                      <div className="mt-3 flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                        Learn More <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link href="/">
                View All Companies
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

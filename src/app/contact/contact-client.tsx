"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Phone,
  MapPin,
  MessageSquare,
  Headphones,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { submitContact, getFormToken, type ContactSubmission } from "@/lib/actions/contact";
import { serviceOptions } from "@/lib/validations/contact";
import { BreadcrumbHero } from "@/components/breadcrumb-hero";
import { Turnstile } from "@/components/ui/turnstile";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const contactCards = [
  {
    icon: MessageSquare,
    title: "Chat to Sales",
    description: "Speak to our friendly team",
    action: "sales@guardiumgroup.com",
    actionType: "email" as const,
  },
  {
    icon: Headphones,
    title: "Chat to Support",
    description: "We're here to help you",
    action: "support@guardiumgroup.com",
    actionType: "email" as const,
  },
  {
    icon: MapPin,
    title: "Visit Us",
    description: "Visit our office",
    action: "View on maps",
    actionType: "map" as const,
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "Mon to Fri from 8am to 5pm",
    action: "+1 780-809-7860",
    actionType: "phone" as const,
  },
];

export function ContactClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    services: [] as string[],
  });
  const [formToken, setFormToken] = useState("");
  const [formTimestamp, setFormTimestamp] = useState(0);
  const [honeypot, setHoneypot] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileReset, setTurnstileReset] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // Fetch a server-signed token so the timing check can't be bypassed by a
  // client-forged timestamp. Returns false if the server couldn't be reached.
  const refreshFormToken = useCallback(async (): Promise<boolean> => {
    try {
      const { token, timestamp } = await getFormToken();
      setFormToken(token);
      setFormTimestamp(timestamp);
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    getFormToken()
      .then(({ token, timestamp }) => {
        if (cancelled) return;
        setFormToken(token);
        setFormTimestamp(timestamp);
      })
      .catch(() => {
        if (cancelled) return;
        setSubmitStatus({
          type: "error",
          message: "We couldn't load the contact form. Please refresh the page or call us at +1 780-809-7860.",
        });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleTurnstileVerify = useCallback((token: string) => setTurnstileToken(token), []);
  const handleTurnstileExpire = useCallback(() => setTurnstileToken(""), []);

  // Turnstile tokens are single-use: get a fresh one after every attempt.
  const resetTurnstile = () => {
    setTurnstileToken("");
    setTurnstileReset((n) => n + 1);
  };

  const needsTurnstile = TURNSTILE_SITE_KEY !== "";
  const canSubmit = !isSubmitting && formToken !== "" && (!needsTurnstile || turnstileToken !== "");

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const submission: ContactSubmission = {
        ...formData,
        _honeypot: honeypot,
        _formToken: formToken,
        _timestamp: formTimestamp,
        _turnstileToken: turnstileToken,
      };

      const result = await submitContact(submission);

      if (result.success) {
        setSubmitStatus({ type: "success", message: result.message });
        setFormData({ name: "", email: "", message: "", services: [] });
        setHoneypot("");
        // A token is single-use once a message is sent
        await refreshFormToken();
      } else {
        setSubmitStatus({ type: "error", message: result.message });
        // Expired, invalid or already-used token: get a new one so a retry
        // can succeed without reloading the page.
        if (result.code === "TOKEN_EXPIRED") {
          await refreshFormToken();
        }
      }
    } catch {
      setSubmitStatus({
        type: "error",
        message: "Something went wrong. Please try again.",
      });
      await refreshFormToken();
    } finally {
      resetTurnstile();
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Breadcrumb Hero */}
      <BreadcrumbHero
        title="Contact Us"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact Us" },
        ]}
      />

      {/* Contact Form Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-7xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-12">
              {/* Form */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm order-2 lg:order-1">
                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                  {/* Honeypot field - hidden from users */}
                  <input
                    type="text"
                    name="_honey"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    className="absolute -left-[9999px] opacity-0"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-900 mb-2"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400 text-sm sm:text-base"
                      placeholder="Enter your name here..."
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-900 mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, email: e.target.value }))
                      }
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400 text-sm sm:text-base"
                      placeholder="Enter your Email here..."
                      required
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-900 mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, message: e.target.value }))
                      }
                      rows={4}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-gray-900 placeholder:text-gray-400 text-sm sm:text-base"
                      placeholder="Type here"
                      required
                    />
                  </div>

                  {/* Services */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                      Services
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                      {serviceOptions.map((service) => (
                        <label
                          key={service}
                          className="flex items-center gap-2 cursor-pointer group p-2 -m-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={formData.services.includes(service)}
                            onChange={() => handleServiceToggle(service)}
                            className="sr-only peer"
                          />
                          <div
                            aria-hidden="true"
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2 ${
                              formData.services.includes(service)
                                ? "bg-blue-500 border-blue-500"
                                : "border-gray-300 group-hover:border-blue-400"
                            }`}
                          >
                            {formData.services.includes(service) && (
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>
                          <span className="text-sm text-blue-600">{service}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Status Message */}
                  {submitStatus.type && (
                    <div
                      className={`flex items-start gap-2 p-3 sm:p-4 rounded-lg ${
                        submitStatus.type === "success"
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {submitStatus.type === "success" ? (
                        <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      )}
                      <span className="text-sm">{submitStatus.message}</span>
                    </div>
                  )}

                  {/* Bot protection */}
                  {needsTurnstile && (
                    <Turnstile
                      siteKey={TURNSTILE_SITE_KEY}
                      onVerify={handleTurnstileVerify}
                      onExpire={handleTurnstileExpire}
                      onError={handleTurnstileExpire}
                      resetSignal={turnstileReset}
                      className="min-h-[65px]"
                    />
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={!canSubmit}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              </div>

              {/* Map */}
              <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm h-64 sm:h-80 lg:h-auto lg:min-h-[500px] order-1 lg:order-2">
                <iframe
                  src="https://maps.google.com/maps?q=14360+Yellowhead+Trail,+Edmonton,+AB+T5L+3C2&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Guardium Group Location"
                  className="w-full h-full"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Cards Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-7xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {contactCards.map((card) => (
                <div
                  key={card.title}
                  className="bg-gray-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 text-center"
                >
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <card.icon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">{card.description}</p>
                  {card.actionType === "email" && (
                    <a
                      href={`mailto:${card.action}`}
                      className="inline-block px-4 sm:px-6 py-2 sm:py-2.5 border border-blue-500 text-blue-500 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-50 transition-colors break-all"
                    >
                      {card.action}
                    </a>
                  )}
                  {card.actionType === "phone" && (
                    <a
                      href={`tel:${card.action.replace(/\s/g, "")}`}
                      className="inline-block px-4 sm:px-6 py-2 sm:py-2.5 border border-blue-500 text-blue-500 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-50 transition-colors"
                    >
                      {card.action}
                    </a>
                  )}
                  {card.actionType === "map" && (
                    <a
                      href="https://maps.google.com/?q=14360+Yellowhead+Trail,+Edmonton,+AB+T5L+3C2"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 sm:px-6 py-2 sm:py-2.5 border border-blue-500 text-blue-500 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-50 transition-colors"
                    >
                      {card.action}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

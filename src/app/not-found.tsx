import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Mail } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-24 h-24 bg-[#511010]/10 rounded-full flex items-center justify-center mb-6">
        <span className="text-3xl font-bold text-[#511010]">404</span>
      </div>
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
        Page not found
      </h1>
      <p className="text-gray-500 max-w-md mb-8 text-sm leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        Let&apos;s get you back on track.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/contact">
            <Mail className="mr-2 h-4 w-4" />
            Contact Us
          </Link>
        </Button>
      </div>
    </div>
  );
}

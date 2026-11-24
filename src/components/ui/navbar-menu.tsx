"use client";
import React from "react";
import type { Transition } from "framer-motion";
import * as m from "framer-motion/m";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const transition: Transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string | null) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}) => {
  const isOpen = active === item;
  const panelId = `menu-panel-${item.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div
      onMouseEnter={() => setActive(item)}
      onKeyDown={(event) => {
        if (event.key === "Escape" && isOpen) {
          setActive(null);
          (event.currentTarget.querySelector("button") as HTMLButtonElement | null)?.focus();
        }
      }}
      className="relative"
    >
      {/* A real button so keyboard users can open the menu (focus or Enter/Space). */}
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onFocus={() => setActive(item)}
        // Always opens: with a mouse, hover/focus have already opened it, so a
        // toggle here would immediately close it again. Escape, blur and
        // mouse-leave close it.
        onClick={() => setActive(item)}
        className={cn(
          "cursor-pointer font-mono text-gray-900 hover:text-primary font-medium text-md transition-colors",
          isOpen && "text-primary"
        )}
      >
        {item}
      </button>
      {active !== null && (
        <m.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {isOpen && (
            <div
              id={panelId}
              className="absolute top-[calc(100%+0.5rem)] left-1/2 transform -translate-x-1/2 pt-4"
            >
              <m.div
                transition={transition}
                className="bg-white backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-200 shadow-xl"
              >
                <m.div className="w-max h-full p-4">
                  {children}
                </m.div>
              </m.div>
            </div>
          )}
        </m.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) => {
  return (
    <nav
      aria-label="Main"
      onMouseLeave={() => setActive(null)}
      onBlur={(event) => {
        // Close when keyboard focus leaves the whole menu.
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setActive(null);
        }
      }}
      className="relative bg-none font-mono flex justify-center space-x-4 px-8 py-3.5"
    >
      {children}
    </nav>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
}) => {
  return (
    <Link href={href} className="flex space-x-2 group">
      <Image
        src={src}
        width={140}
        height={70}
        alt={title}
        className="flex-shrink-0 rounded-md shadow-2xl object-cover"
      />
      <div>
        <h4 className="text-xl font-mono font-bold mb-1 text-gray-900 group-hover:text-primary transition-colors">
          {title}
        </h4>
        <p className="text-gray-500 text-sm max-w-[10rem]">
          {description}
        </p>
      </div>
    </Link>
  );
};

export const HoveredLink = ({ children, ...rest }: React.ComponentProps<typeof Link>) => {
  return (
    <Link
      {...rest}
      className="text-gray-600 font-mono hover:text-primary transition-colors"
    >
      {children}
    </Link>
  );
};

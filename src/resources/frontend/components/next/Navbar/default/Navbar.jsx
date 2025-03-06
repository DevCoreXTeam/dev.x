"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import * as Collapsible from "@radix-ui/react-collapsible";

// react-icons
import { IoIosSearch, IoMdClose } from "react-icons/io";
import { HiMiniBars2 } from "react-icons/hi2";
import { IoLogIn } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";

// tailwind-merge & clsx (utils)
import { cn } from "@/lib/utils";

// Dev.X components
import Button from "@/components/generated/Button";
import Input from "@/components/generated/Input";

const NAVBAR_VARIANTS = {
  neutral:
    "bg-white text-black focus:ring-gray-200 dark:bg-black dark:text-white",
  inverse: "bg-black text-white focus:ring-black dark:bg-white dark:text-black",
  outline:
    "border border-gray-300 text-black bg-transparent focus:ring-gray-200 dark:border-gray-600 dark:text-white",
  subtle:
    "bg-gray-200 text-gray-700 focus:ring-gray-200 dark:bg-gray-600 dark:text-white",
  blurred:
    "bg-black/40 text-white backdrop-blur-sm focus:ring-gray-400 dark:bg-white/40 dark:text-black",
};

const DEFAULT_ITEMS = [
  { label: "Home", href: "/", icon: null },
  { label: "Community", href: "/community", icon: null },
  { label: "Resources", href: "/resources", icon: null },
  { label: "About", href: "/about", icon: null },
  { label: "Blog", href: "/blog", icon: null },
];

export default function Navbar({
  title = "DevCoreX",
  logo,
  items = DEFAULT_ITEMS,
  variant = "neutral",
  enableSearch = false,
  onSearch,
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Click outside
  const menuRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (!isOpen) return;
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Focus Input
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 50);
    }
  }, [isSearchOpen]);

  return (
    <nav className={cn("fixed z-50 w-full", className)}>
      {/* keyframes */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); }
          to { transform: translateX(100%); }
        }
        @keyframes slideDown {
          from { height: 0; opacity: 0; }
          to { height: var(--radix-collapsible-content-height); opacity: 1; }
        }
        @keyframes slideUp {
          from { height: var(--radix-collapsible-content-height); opacity: 1; }
          to { height: 0; opacity: 0; }
        }
      `}</style>

      <header
        className={cn(
          "flex items-center justify-between border-b-[0.50px] border-gray-500 px-6 py-4",
          NAVBAR_VARIANTS[variant],
          className,
        )}
      >
        <Link href="/" className="flex items-center">
          {logo && (
            <div className="mr-4 h-6 w-6 drop-shadow-[0_0px_1px_rgba(255,255,255,0.6)]">
              {logo}
            </div>
          )}
          <h1 className="text-lg font-bold">{title}</h1>
        </Link>

        {/* Search - Desktop */}
        {enableSearch && (
          <div
            className={cn(
              "hidden items-center space-x-2 rounded-md p-2 md:flex",
              NAVBAR_VARIANTS[variant],
              className,
            )}
          >
            <Input
              variant="neutral"
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="py-1"
            />
            <Button
              variant="inverse"
              onClick={() => onSearch && onSearch(searchQuery)}
              className="px-3 py-1"
            >
              Search
            </Button>
          </div>
        )}

        <div className="flex items-center">
          {enableSearch && (
            <Collapsible.Root
              open={isSearchOpen}
              onOpenChange={setIsSearchOpen}
            >
              <Collapsible.Trigger asChild>
                <IoIosSearch className="mr-4 cursor-pointer text-xl md:hidden" />
              </Collapsible.Trigger>
            </Collapsible.Root>
          )}

          <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
            <Collapsible.Trigger asChild>
              {isOpen ? (
                <IoMdClose className="cursor-pointer text-2xl" />
              ) : (
                <HiMiniBars2 className="cursor-pointer text-2xl" />
              )}
            </Collapsible.Trigger>
          </Collapsible.Root>
        </div>
      </header>

      {/* Seaech - Mobile */}
      {enableSearch && (
        <Collapsible.Root open={isSearchOpen}>
          <Collapsible.Content
            className={cn(
              "overflow-hidden border-b px-6 py-4 md:hidden",
              NAVBAR_VARIANTS[variant],
              className,
              "data-[state=closed]:animate-[slideUp_300ms_cubic-bezier(0.87,0,0.13,1)] data-[state=open]:animate-[slideDown_300ms_cubic-bezier(0.87,0,0.13,1)]",
            )}
          >
            <div className="flex items-center justify-between">
              <Input
                variant="neutral"
                ref={searchInputRef}
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-[2px]"
              />
              <Button
                variant="inverse"
                size="sm"
                className="ml-2 px-3"
                onClick={() => {
                  onSearch && onSearch(searchQuery);
                  setIsSearchOpen(false);
                }}
              >
                Search
              </Button>
            </div>
          </Collapsible.Content>
        </Collapsible.Root>
      )}

      {/* Mobile Menu */}
      <Collapsible.Root open={isOpen}>
        <Collapsible.Content
          ref={menuRef}
          className={cn(
            "fixed right-0 top-[60px] z-50 h-[calc(100%-60px)] w-64 overflow-y-auto border-l-[0.50px] border-gray-500 p-6 md:top-[88px]",
            NAVBAR_VARIANTS[variant],
            className,
            "data-[state=closed]:animate-[slideOutRight_300ms_cubic-bezier(0.87,0,0.13,1)] data-[state=open]:animate-[slideInRight_300ms_cubic-bezier(0.87,0,0.13,1)]",
          )}
        >
          <div className="mb-8 flex flex-col">
            <Button variant="outline" full={true} className="mb-4">
              Sign In
              <IoLogIn className="ml-2 text-xl" />
            </Button>
            <Button variant="inverse" full={true}>
              <MdAccountCircle className="mr-2 text-xl" />
              Sign Up
            </Button>
          </div>

          <ul className="space-y-4">
            {items.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className="flex items-center py-2 text-base"
                >
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </Collapsible.Content>
      </Collapsible.Root>
    </nav>
  );
}

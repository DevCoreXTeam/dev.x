import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";

// Icons
import { IoIosSearch } from "react-icons/io";
import { HiMiniBars2, HiXMark } from "react-icons/hi2";
import { IoLogIn } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";

// Components
import Button from "../../components/generated/Button";
import Input from "../../components/generated/Input";

/**
 * Predefined navbar color variants
 * Provides different visual styles for the navbar
 */
export const NAVBAR_VARIANTS = {
  neutral: {
    base: "bg-white text-black focus:ring-gray-200 dark:bg-black dark:text-white",
    mobile: "bg-white text-black dark:bg-black dark:text-white",
  },
  inverse: {
    base: "bg-black text-white focus:ring-black dark:bg-white dark:text-black",
    mobile: "bg-black text-white dark:bg-white dark:text-black",
  },
  outline: {
    base: "border border-gray-300 text-black bg-transparent focus:ring-gray-200 dark:border-gray-600 dark:text-white",
    mobile:
      "border-t border-gray-300 text-black dark:border-gray-600 dark:text-white",
  },
  subtle: {
    base: "bg-gray-200 text-gray-700 focus:ring-gray-200 dark:bg-gray-600 dark:text-white",
    mobile: "bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-white",
  },
  blurred: {
    base: "bg-black/40 text-white backdrop-blur-sm focus:ring-gray-400 dark:bg-white/40 dark:text-black",
    mobile:
      "bg-black/30 text-white backdrop-blur-sm dark:bg-white/30 dark:text-black",
  },
} as const;

/**
 * Default navigation items for the navbar
 */
const DEFAULT_NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Community", href: "/community" },
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

/**
 * Interface for defining navigation item
 */
interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

/**
 * Props interface for the Navbar component
 */
interface NavbarProps {
  title?: string;
  logo?: React.ReactNode;
  items?: NavItem[];
  variant?: keyof typeof NAVBAR_VARIANTS;
  enableSearch?: boolean;
  onSearch?: (query: string) => void;
  className?: string;
  logoClassName?: string;
}

/**
 * Responsive Navbar component with configurable variants and features
 */
export default function Navbar({
  title = "DevCoreX",
  logo,
  items = DEFAULT_NAV_ITEMS,
  variant = "neutral",
  enableSearch = false,
  onSearch,
  className,
  logoClassName,
}: NavbarProps) {
  // State management for menu and search
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Refs for handling outside clicks and focus
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu and search when screen becomes larger
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "";
    };
  }, []);

  // Handle click outside to close search and menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Handle search container clicks
      if (
        isSearchOpen &&
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }

      // Handle menu clicks
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest(
          '[aria-label="Open menu"], [aria-label="Close menu"]',
        )
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOpen, isMenuOpen]);

  // Focus on search input when search is opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isSearchOpen]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch?.(searchQuery);
    }
    setIsSearchOpen(false);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const renderDesktopSearch = () =>
    enableSearch && (
      <div
        className={cn(
          "hidden items-center space-x-2 rounded-md p-2 md:flex",
          NAVBAR_VARIANTS[variant].base,
        )}
      >
        <Input
          variant="neutral"
          type="search"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleSearchKeyPress}
          className="py-1"
        />
        <Button variant="inverse" onClick={handleSearch} className="px-3 py-1">
          Search
        </Button>
      </div>
    );

  const renderMobileSearch = () =>
    enableSearch && (
      <div
        ref={searchContainerRef}
        className={cn(
          "absolute inset-x-0 top-[60px] z-30 overflow-hidden border-b transition-all duration-300 ease-in-out md:hidden",
          NAVBAR_VARIANTS[variant].mobile,
          isSearchOpen ? "max-h-20 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <Input
            ref={searchInputRef}
            variant="neutral"
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            className="py-[2px]"
          />
          <Button
            variant="inverse"
            size="sm"
            className="ml-2 px-3"
            onClick={handleSearch}
          >
            Search
          </Button>
        </div>
      </div>
    );

  const renderMenuToggle = () => (
    <button
      onClick={() => setIsMenuOpen(!isMenuOpen)}
      aria-label={isMenuOpen ? "Close menu" : "Open menu"}
    >
      {isMenuOpen ? (
        <HiXMark className="text-2xl" />
      ) : (
        <HiMiniBars2 className="text-2xl" />
      )}
    </button>
  );

  const renderMobileSearchToggle = () =>
    enableSearch && (
      <button
        onClick={() => {
          setIsSearchOpen(!isSearchOpen);
          if (!isSearchOpen) {
            setIsMenuOpen(false);
          }
        }}
        className="mr-4 md:hidden"
        aria-label={isSearchOpen ? "Close search" : "Open search"}
      >
        <IoIosSearch className="text-xl" />
      </button>
    );

  const renderMenu = () => (
    <div
      ref={menuRef}
      className={cn(
        "fixed inset-x-0 top-[60px] z-40 overflow-hidden transition-all duration-300 ease-in-out",
        NAVBAR_VARIANTS[variant].mobile,
        isMenuOpen
          ? "max-h-screen opacity-100"
          : "pointer-events-none max-h-0 opacity-0",
      )}
    >
      <div className="p-6">
        {/* Auth Buttons */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-center">
          <Button
            variant="outline"
            full={true}
            className="sm:w-[300px] sm:mr-8 mb-4 sm:mb-0"
          >
            Sign In
            <IoLogIn className="ml-2 text-xl" />
          </Button>
          <Button variant="inverse" full={true} className="sm:w-[300px]">
            <MdAccountCircle className="mr-2 text-xl" />
            Sign Up
          </Button>
        </div>

        {/* Nav Items */}
        <nav>
          <ul className="space-y-4">
            {items.map((item, index) => (
              <li
                key={index}
                className="transform transition-transform duration-300 hover:translate-x-2"
              >
                <Link
                  to={item.href}
                  className="flex items-center py-2 text-base"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50", className)}>
      {/* Main Navbar */}
      <nav
        className={cn(
          "flex h-[60px] items-center justify-between border-b-[0.50px] border-gray-500 px-4 lg:px-6",
          NAVBAR_VARIANTS[variant].base,
          className,
        )}
      >
        {/* Logo and Title */}
        <Link to="/" className="flex flex-shrink-0 items-center">
          {logo && (
            <div
              className={cn(
                "mr-3 h-6 w-6 drop-shadow-[0_0px_1px_rgba(255,255,255,0.6)]",
                logoClassName,
              )}
            >
              {logo}
            </div>
          )}
          <h1 className="text-lg font-bold">{title}</h1>
        </Link>

        {/* Desktop Search */}
        {renderDesktopSearch()}

        {/* Toggle Menu and Search */}
        <div className="flex items-center mx-2">
          {renderMobileSearchToggle()}
          {renderMenuToggle()}
        </div>
      </nav>

      {/* Mobile Search */}
      {renderMobileSearch()}

      {/* Dropdown Menu */}
      {renderMenu()}
    </header>
  );
}

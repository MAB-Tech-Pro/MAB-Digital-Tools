"use client";

import { useEffect, useMemo, useState } from "react";
import { Menu, X, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [desktopSearch, setDesktopSearch] = useState("");
  const [mobileSearch, setMobileSearch] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  // Menu model
  const menuItems = useMemo(
    () => [
      { name: "Home", href: "/" },
      { name: "Tools", href: "/tools" },
      { name: "About Us", href: "/about-us" },
      { name: "Contact Us", href: "/contact-us" },
      { name: "Blog", href: "/blog" },
    ],
    []
  );

  // Derive active from route
  const isActive = (href: string) => {
    if (!pathname) return false;
    return href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);
  };

  const toggleMenu = () => setIsOpen((v) => !v);
  const closeMenu = () => setIsOpen(false);

  // ✅ Auto-close drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  const handleSearchNavigate = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    let basePath = "/tools";

    if (pathname?.startsWith("/tools")) {
      basePath = "/tools";
    } else if (pathname?.startsWith("/blog")) {
      basePath = "/blog";
    }

    router.push(`${basePath}?q=${encodeURIComponent(trimmed)}`);
  };

  const handleDesktopSearchKeyDown = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchNavigate(desktopSearch);
    }
  };

  const handleMobileSearchKeyDown = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchNavigate(mobileSearch);
    }
  };

  return (
    <header className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl md:text-2xl font-bold flex items-center select-none whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 rounded"
          aria-label="MAB Digital Tools Home"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            MAB
          </span>
          <span className="text-red-500 mx-1">|</span>
          <span className="text-black">Digital Tools</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center">
          {menuItems.map((item, index) => (
            <div key={item.name} className="flex items-center select-none">
              <Link
                href={item.href}
                className={`px-4 py-1 transition-colors duration-200 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2
                  ${
                    isActive(item.href)
                      ? "bg-gray-200"
                      : "bg-white hover:bg-gray-100"
                  } text-black`}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                {item.name}
              </Link>
              {index < menuItems.length - 1 && (
                <span
                  className="text-gray-400 mx-2 select-none"
                  aria-hidden="true"
                >
                  |
                </span>
              )}
            </div>
          ))}

          {/* Search Bar (desktop) */}
          <div className="ml-6 relative">
            <label htmlFor="desktop-search" className="sr-only">
              Search
            </label>
            <input
              id="desktop-search"
              type="text"
              placeholder="Search..."
              aria-label="Search"
              className="px-3 py-2 pr-10 border border-gray-600 rounded bg-gray-100 text-gray-700 placeholder-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
              value={desktopSearch}
              onChange={(e) => setDesktopSearch(e.target.value)}
              onKeyDown={handleDesktopSearchKeyDown}
            />
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
              aria-hidden="true"
            />
          </div>
        </nav>

        {/* Tablet / Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            aria-controls="mobile-drawer"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-gray-800" />
            ) : (
              <Menu className="w-6 h-6 text-gray-800" />
            )}
          </button>
        </div>
      </div>

      {/* Invisible backdrop for click-outside */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={closeMenu}
          className="fixed inset-0 bg-transparent md:hidden"
        />
      )}

      {/* Mobile/Tablet Drawer */}
      {isOpen && (
        <div
          id="mobile-drawer"
          className="fixed top-0 right-0 h-full w-1/2 bg-white shadow-lg p-4 flex flex-col transition-all duration-300 md:hidden"
          role="dialog"
          aria-modal="true"
        >
          <button
            className="self-end mb-4 inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <X className="w-6 h-6 text-gray-800" />
          </button>

          {/* Search Bar (mobile) */}
          <div className="mb-4 relative w-full">
            <label htmlFor="mobile-search" className="sr-only">
              Search
            </label>
            <input
              id="mobile-search"
              type="text"
              placeholder="Search..."
              aria-label="Search"
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded bg-gray-100 text-gray-700 placeholder-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
              value={mobileSearch}
              onChange={(e) => setMobileSearch(e.target.value)}
              onKeyDown={handleMobileSearchKeyDown}
            />
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
              aria-hidden="true"
            />
          </div>

          {/* Menu Items */}
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={closeMenu}
              className={`py-2 text-lg text-black transition-colors duration-200 px-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2
                ${
                  isActive(item.href)
                    ? "bg-gray-200"
                    : "bg-white hover:bg-gray-100"
                } select-none`}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

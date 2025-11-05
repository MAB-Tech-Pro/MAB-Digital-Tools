"use client";

import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Tools", href: "/tools" },
    { name: "About Us", href: "/about-us" },
    { name: "Contact Us", href: "/contact-us" },
    { name: "Blog", href: "/blog" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="text-2xl md:text-2xl font-bold flex items-center select-none whitespace-nowrap">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            MAB
          </span>
          <span className="text-red-500 mx-1">|</span>
          <span className="text-black">Digital Tools</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-0 items-center">
          {menuItems.map((item, index) => (
            <div key={item.name} className="flex items-center select-none">
              <Link
                href={item.href}
                onClick={() => setActiveItem(item.name)}
                className={`px-4 py-1 transition-colors duration-200 rounded
                  ${activeItem === item.name ? "bg-gray-200 border-b-2 border-black" : "bg-white"}
                  hover:bg-gray-100 text-black`}
              >
                {item.name}
              </Link>
              {index < menuItems.length - 1 && (
                <span className="text-gray-400 mx-2 select-none">|</span>
              )}
            </div>
          ))}

          {/* Search Bar */}
          <div className="ml-6 relative">
            <input
              type="text"
              placeholder="Search..."
              className="px-3 py-2 pr-10 border border-gray-600 rounded focus:outline-none bg-gray-100 text-gray-700 placeholder-gray-600"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
          </div>
        </nav>

        {/* Tablet / Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu}>
            {isOpen ? <X className="w-6 h-6 text-gray-800" /> : <Menu className="w-6 h-6 text-gray-800" />}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Drawer */}
      {isOpen && (
        <div className="fixed top-0 right-0 h-full w-1/2 bg-white shadow-lg p-4 flex flex-col transition-transform duration-300">
          <button className="self-end mb-4" onClick={toggleMenu}>
            <X className="w-6 h-6 text-gray-800" />
          </button>

          {/* Search Bar */}
          <div className="mb-4 relative w-full">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded focus:outline-none bg-gray-100 text-gray-700 placeholder-gray-600"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
          </div>

          {/* Menu Items */}
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setActiveItem(item.name)}
              className={`py-2 text-lg text-black transition-colors duration-200 px-2 rounded
                ${activeItem === item.name ? "bg-gray-200 border-b-2 border-black" : "bg-white hover:bg-gray-100"} select-none`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

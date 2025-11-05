"use client";

import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();

  const socialIcons = [
    { icon: <Facebook />, link: "#" },
    { icon: <Twitter />, link: "#" },
    { icon: <Instagram />, link: "#" },
    { icon: <Linkedin />, link: "#" },
  ];

  return (
    <footer className="w-full bg-gray-900 select-none">

      {/* Row 1 */}
      <div className="w-full bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
          
          {/* Column 1 + 2 (Follow Us) */}
          <div className="md:col-span-2 flex flex-col items-center md:items-start">
            <h2 className="text-lg font-semibold mb-4 bg-gray-600 px-4 py-2 rounded-full select-none">
              Follow Us
            </h2>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              {socialIcons.map((item, idx) => (
                <a
                  key={idx}
                  href={item.link}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-600 transition-colors"
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 3 (Newsletter) */}
          <div className="flex flex-col items-center md:items-start bg-gray-800 p-4 rounded-lg w-full">
            <h2 className="text-lg font-semibold mb-2">Subscribe to our Newsletter</h2>
            <p className="text-sm mb-2 text-gray-300">Enter your email to get updates</p>
            
            {/* Responsive input + button */}
            <div className="flex flex-col sm:flex-row w-full gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 border border-gray-600 rounded-md sm:rounded-l-md focus:outline-none bg-gray-600 text-white placeholder-gray-400 w-full"
              />
              <button className="px-4 py-2 bg-gray-900 text-white rounded-md sm:rounded-r-md hover:bg-gray-600 transition-colors w-full sm:w-auto">
                Subscribe
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Row 2 (Bottom links) */}
      <div className="bg-gray-800 py-4 text-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          
          {/* Column 1 (Brand clickable to home) */}
          <div className="text-center md:text-left cursor-pointer" onClick={() => router.push("/")}>
            &copy; {new Date().getFullYear()} MAB Digital Tools. All Rights Reserved
          </div>

          {/* Column 2 */}
          <div className="flex justify-center md:justify-end gap-6 flex-wrap">
            <a href="#" className="hover:underline text-gray-200">Privacy Policy</a>
            <a href="#" className="hover:underline text-gray-200">Terms</a>
            <a href="#" className="hover:underline text-gray-200">Disclaimer</a>
          </div>

        </div>
      </div>
    </footer>
  );
}

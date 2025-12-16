"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChefHat, ChevronDown } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface NavLink {
  label: string;
  href: string;
}

export default function Navbar({ links }: { links: NavLink[] }) {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2 text-[#009966] font-bold text-xl">
          <ChefHat className="w-8 h-8" />
          <span>DapurPintar</span>
        </div>

        {/* Links */}
        <div className="hidden md:flex gap-6 text-sm font-medium text-gray-500">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`hover:text-[#009966] transition-colors ${
                pathname === link.href ? "text-[#009966] font-semibold" : ""
              }`}
            >
              {link.label}
            </a>
          ))}

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="hover:text-[#009966] transition-colors flex items-center gap-1"
            >
              Profile <ChevronDown className="w-4 h-4" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    router.push("/");
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

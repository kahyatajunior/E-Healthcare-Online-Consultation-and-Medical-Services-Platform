"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { FiMenu, FiX, FiUser, FiLogOut } from "react-icons/fi";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = () => {
    if (!user) {
      return [
        { href: "/doctors", label: "Find Doctors" },
        { href: "/login", label: "Login" },
        { href: "/register", label: "Register" },
      ];
    }

    const links = [{ href: "/dashboard", label: "Dashboard" }];

    if (user.role === "patient") {
      links.push(
        { href: "/doctors", label: "Find Doctors" },
        { href: "/appointments", label: "Appointments" },
        { href: "/prescriptions", label: "Prescriptions" },
        { href: "/chat", label: "Messages" }
      );
    }

    if (user.role === "doctor") {
      links.push(
        { href: "/appointments", label: "Appointments" },
        { href: "/prescriptions", label: "Prescriptions" },
        { href: "/chat", label: "Messages" }
      );
    }

    if (user.role === "admin") {
      links.push(
        { href: "/admin/users", label: "Users" },
        { href: "/admin/appointments", label: "Appointments" }
      );
    }

    return links;
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-600">
                E-Healthcare
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {navLinks().map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <div className="flex items-center space-x-3 ml-4 border-l pl-4">
                <Link
                  href="/profile"
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
                >
                  <FiUser className="w-4 h-4" />
                  <span className="text-sm">{user.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-500 hover:text-red-600 transition-colors"
                >
                  <FiLogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700"
            >
              {menuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks().map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <>
                <Link
                  href="/profile"
                  className="block text-gray-700 hover:text-blue-600 px-3 py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left text-red-600 px-3 py-2"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

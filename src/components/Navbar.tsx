"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  
  // State to control the mobile menu (open/close)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper function to check if the link is the active page
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* 1. Logo Section */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-blue-600 text-white p-2 rounded-xl group-hover:bg-blue-700 transition-colors shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6.75h1.5m-1.5 3h1.5m-1.5 3h1.5M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
              </svg>
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tight">
              Tour<span className="text-blue-600">Guides</span>
            </span>
          </Link>

          {/* 2. Desktop Navigation Links (Hidden on small screens via md:flex) */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className={`font-semibold text-base transition-colors ${
                isActive("/") ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "text-gray-500 hover:text-blue-600"
              }`}
            >
              Explore
            </Link>

            {session?.user && (
              <Link 
                href="/favorites" 
                className={`font-semibold text-base transition-colors flex items-center gap-1 ${
                  isActive("/favorites") ? "text-red-500 border-b-2 border-red-500 pb-1" : "text-gray-500 hover:text-red-500"
                }`}
              >
                <span>Favorites</span>
                <span className="text-red-500">❤️</span>
              </Link>
            )}
          </div>

          {/* 3. User Actions & Mobile Hamburger Button */}
          <div className="flex items-center gap-4">
            
            {/* Desktop Auth Buttons (Hidden on mobile) */}
            <div className="hidden md:flex items-center gap-4">
              {session?.user ? (
                <>
                  <Link href="/create" className="flex items-center gap-2 bg-blue-50 text-blue-700 font-bold px-5 py-2.5 rounded-full hover:bg-blue-100 hover:shadow-sm transition-all border border-blue-200">
                    <span className="text-xl">+</span> Add Post
                  </Link>
                  <div className="flex items-center gap-3 border-l-2 border-gray-200 pl-4 ml-2">
                    <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md cursor-pointer border-2 border-white ring-2 ring-gray-100">
                      {session.user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <button onClick={() => signOut()} className="text-sm font-semibold text-gray-500 hover:text-red-600 transition-colors">
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <Link href="/login" className="bg-gray-900 text-white font-bold px-6 py-2.5 rounded-full hover:bg-gray-800 transition-colors shadow-md">
                  Log In
                </Link>
              )}
            </div>

            {/* Mobile Hamburger Button (Visible only on mobile) */}
            <button 
              className="md:hidden p-2 text-gray-600 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                {isMobileMenuOpen ? (
                  // Close Icon (X)
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  // Hamburger Icon (☰)
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* 4. Mobile Dropdown Menu (Conditionally rendered) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full left-0 animate-in slide-in-from-top-2">
          <div className="px-4 pt-4 pb-6 space-y-4 flex flex-col">
            
            {/* Close menu when a link is clicked */}
            <Link 
              href="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block font-semibold text-lg ${isActive("/") ? "text-blue-600" : "text-gray-600"}`}
            >
              Explore
            </Link>
            
            {session?.user && (
              <Link 
                href="/favorites" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block font-semibold text-lg ${isActive("/favorites") ? "text-red-500" : "text-gray-600"}`}
              >
                Favorites ❤️
              </Link>
            )}

            <div className="border-t border-gray-100 pt-4 mt-2">
              {session?.user ? (
                <div className="flex flex-col gap-4">
                  <Link 
                    href="/create" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="bg-blue-50 text-blue-700 font-bold px-4 py-3 rounded-xl text-center border border-blue-200"
                  >
                    + Add Post
                  </Link>
                  <button 
                    onClick={() => { signOut(); setIsMobileMenuOpen(false); }} 
                    className="text-left font-semibold text-red-500 py-2"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link 
                  href="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block bg-gray-900 text-white font-bold px-4 py-3 rounded-xl text-center"
                >
                  Log In
                </Link>
              )}
            </div>

          </div>
        </div>
      )}
    </nav>
  );
}
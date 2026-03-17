"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold tracking-wider">
          🌍 Travel Guides
        </Link>
        
        <div className="flex gap-4 items-center">
          {/* What you see if the user is logged in */}
          {session?.user ? (
            <>
              <span className="font-semibold text-sm hidden md:block">
                Hi, {session.user.name}
              </span>
              <Link 
                href="/create" 
                className="bg-white text-blue-600 px-4 py-2 rounded-md font-bold hover:bg-gray-100 transition"
              >
                Create Listing
              </Link>
              <button 
                onClick={() => signOut()} 
                className="bg-red-500 px-4 py-2 rounded-md font-bold hover:bg-red-600 transition cursor-pointer"
              >
                Logout
              </button>

              {/* Only show the Favorites link if the user is logged in (session exists) */}
{session?.user && (
  <Link 
    href="/favorites" 
    className="flex items-center gap-1 text-gray-700 hover:text-red-500 font-bold px-3 py-2 rounded-md transition-colors"
  >
    My Favorites ❤️
  </Link>
)}

            </>
          ) : (
            /* What you see if the user is not logged in */
            <>
              <Link href="/login" className="hover:underline font-semibold mt-1">
                Login
              </Link>
              <Link 
                href="/register" 
                className="bg-white text-blue-600 px-4 py-2 rounded-md font-bold hover:bg-gray-100 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
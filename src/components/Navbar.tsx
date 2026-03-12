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
          {/* යූසර් ලොග් වෙලා නම් පේන ටික */}
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
            </>
          ) : (
            /* යූසර් ලොග් වෙලා නැත්නම් පේන ටික */
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
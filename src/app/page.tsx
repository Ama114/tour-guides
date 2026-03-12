"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Listing එකේ තියෙන විස්තර මොනවද කියලා TypeScript එකට අඳුන්වලා දෙනවා
interface Listing {
  _id: string;
  title: string;
  location: string;
  imageUrl: string;
  description: string;
  price: number;
  creatorName: string;
  createdAt: string;
}

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // පිටුව ලෝඩ් වෙද්දිම API එකෙන් ඩේටා ටික ගන්නවා
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("/api/listings");
        if (res.ok) {
          const data = await res.json();
          setListings(data);
        }
      } catch (error) {
        console.log("Error loading listings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  // "2 hours ago" වගේ වෙලාව හදන පොඩි Function එකක්
  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  return (
    <div className="container mx-auto p-6 mt-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Explore Local Experiences</h1>
      
      {loading ? (
        <div className="text-center text-gray-600 text-xl font-semibold mt-10">Loading experiences...</div>
      ) : listings.length === 0 ? (
        <div className="text-center text-gray-600 text-xl mt-10">No experiences found. Be the first to create one!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((listing) => (
            <div key={listing._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              {/* පින්තූරය */}
              <img 
                src={listing.imageUrl} 
                alt={listing.title} 
                className="w-full h-56 object-cover"
              />
              
              <div className="p-5 flex flex-col h-[280px]">
                {/* මාතෘකාව සහ මිල */}
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-gray-800 line-clamp-1">{listing.title}</h2>
                  {listing.price > 0 && (
                    <span className="bg-green-100 text-green-800 text-sm font-bold px-2 py-1 rounded">
                      ${listing.price}
                    </span>
                  )}
                </div>
                
                {/* ස්ථානය */}
                <p className="text-gray-500 text-sm mb-3 font-medium">📍 {listing.location}</p>
                
                {/* කෙටි විස්තරය */}
                <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
                  {listing.description}
                </p>
                
                {/* කවුද දැම්මේ සහ වෙලාව */}
                <div className="flex justify-between items-center text-xs text-gray-400 border-t pt-3 mb-4">
                  <span className="font-semibold text-gray-500">By {listing.creatorName}</span>
                  <span>{timeAgo(listing.createdAt)}</span>
                </div>
                
                {/* View Details බට්න් එක */}
                <Link 
                  href={`/listing/${listing._id}`}
                  className="block text-center w-full bg-blue-50 text-blue-600 font-bold py-2 rounded-md border border-blue-200 hover:bg-blue-600 hover:text-white transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
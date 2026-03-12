"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
  
  // Search කරන වචනේ සේව් කරගන්න අලුත් State එක
  const [searchTerm, setSearchTerm] = useState(""); 

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

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  // ඩේටාබේස් එකෙන් ආපු පෝස්ට් වලින්, අපි ටයිප් කරන වචනේ තියෙන ඒවා විතරක් පෙරාගන්නවා
  const filteredListings = listings.filter((listing) =>
    listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 mt-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Explore Local Experiences</h1>
      
      {/* අලුතින් දාපු Search Bar එක */}
      <div className="max-w-xl mx-auto mb-10">
        <input
          type="text"
          placeholder="Search by title or location..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border-2 border-gray-200 px-5 py-3 rounded-full focus:outline-none focus:border-blue-500 shadow-sm text-gray-800"
        />
      </div>
      
      {loading ? (
        <div className="text-center text-gray-600 text-xl font-semibold mt-10">Loading experiences...</div>
      ) : filteredListings.length === 0 ? (
        <div className="text-center text-gray-600 text-xl mt-10">No experiences found matching your search.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredListings.map((listing) => (
            <div key={listing._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <img src={listing.imageUrl} alt={listing.title} className="w-full h-56 object-cover" />
              <div className="p-5 flex flex-col h-[280px]">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-gray-800 line-clamp-1">{listing.title}</h2>
                  {listing.price > 0 && (
                    <span className="bg-green-100 text-green-800 text-sm font-bold px-2 py-1 rounded">${listing.price}</span>
                  )}
                </div>
                <p className="text-gray-500 text-sm mb-3 font-medium">📍 {listing.location}</p>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">{listing.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-400 border-t pt-3 mb-4">
                  <span className="font-semibold text-gray-500">By {listing.creatorName}</span>
                  <span>{timeAgo(listing.createdAt)}</span>
                </div>
                <Link href={`/listing/${listing._id}`} className="block text-center w-full bg-blue-50 text-blue-600 font-bold py-2 rounded-md border border-blue-200 hover:bg-blue-600 hover:text-white transition-colors">
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
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

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

export default function ListingDetail() {
  const { id } = useParams();
  const router = useRouter(); // වෙන පිටුවකට යවන්න මේක ඕනේ
  const { data: session } = useSession();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listings/${id}`);
        if (res.ok) {
          const data = await res.json();
          setListing(data);
        }
      } catch (error) {
        console.log("Error loading listing details", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchListing();
  }, [id]);

  // පෝස්ට් එක මකන Function එක
  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this listing?");
    
    if (confirmed) {
      try {
        const res = await fetch(`/api/listings/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          router.push("/"); // මැකුවට පස්සේ මුල් පිටුවට යවනවා
        } else {
          alert("Failed to delete listing");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (loading) return <div className="text-center text-xl mt-20 text-gray-600">Loading details...</div>;
  if (!listing) return <div className="text-center text-xl mt-20 text-red-500">Experience not found.</div>;

  return (
    <div className="container mx-auto p-6 mt-8 max-w-4xl">
      <Link href="/" className="text-blue-600 hover:underline font-semibold mb-6 inline-block">
        &larr; Back to Feed
      </Link>
      
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <img src={listing.imageUrl} alt={listing.title} className="w-full h-96 object-cover" />
        
        <div className="p-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl font-extrabold text-gray-900">{listing.title}</h1>
            <div className="flex gap-4 items-center">
              {listing.price > 0 && (
                <span className="bg-green-100 text-green-800 text-xl font-bold px-4 py-2 rounded-lg">${listing.price}</span>
              )}
              
              {/* තමන් දාපු පෝස්ට් එකක් නම් Edit සහ Delete බට්න් දෙකම පෙන්වනවා */}
              {session?.user?.name === listing.creatorName && (
                <>
                  <Link href={`/edit/${listing._id}`} className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-yellow-600 transition">
                    ✏️ Edit
                  </Link>
                  <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 transition cursor-pointer">
                    🗑️ Delete
                  </button>
                </>
              )}
            </div>
          </div>
          
          <p className="text-gray-500 text-lg mb-6 font-medium">📍 {listing.location}</p>
          
          <div className="border-t border-b py-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">About this experience</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{listing.description}</p>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
            <span className="font-semibold text-base text-gray-700">Hosted by {listing.creatorName}</span>
            <span>Posted on {new Date(listing.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
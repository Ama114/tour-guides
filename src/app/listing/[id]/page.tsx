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
  savedBy: string[]; // Added the new array to our TypeScript interface
}

export default function ListingDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false); // To show loading animation on the heart button

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listings/${id}`);
        if (res.ok) {
          const data = await res.json();
          // Ensure savedBy exists even for old posts
          if (!data.savedBy) data.savedBy = []; 
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

  // Function to handle the Heart Button click
  const handleSaveToggle = async () => {
    if (!session?.user?.email) {
      alert("Please login to save this experience!");
      return;
    }

    setIsSaving(true);

    try {
      // Call our new API route
      const res = await fetch(`/api/listings/${id}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: session.user.email }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update the screen immediately with the new saved list
        if (listing) {
          setListing({ ...listing, savedBy: data.savedBy });
        }
      }
    } catch (error) {
      console.log("Error toggling save", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this listing?");
    if (confirmed) {
      try {
        const res = await fetch(`/api/listings/${id}`, { method: "DELETE" });
        if (res.ok) router.push("/");
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (loading) return <div className="text-center text-xl mt-20 text-gray-600">Loading details...</div>;
  if (!listing) return <div className="text-center text-xl mt-20 text-red-500">Experience not found.</div>;

  // Check if the currently logged-in user's email is in the savedBy list
  const isSavedByMe = session?.user?.email && listing.savedBy.includes(session.user.email);
  const saveCount = listing.savedBy.length; // How many people liked this

  return (
    <div className="container mx-auto p-6 mt-8 max-w-4xl">
      <Link href="/" className="text-blue-600 hover:underline font-semibold mb-6 inline-block">
        ← Back to Feed
      </Link>
      
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative">
        <img src={listing.imageUrl} alt={listing.title} className="w-full h-96 object-cover" />
        
        {/* --- Floating Heart Button on top of the image --- */}
        <button 
          onClick={handleSaveToggle}
          disabled={isSaving}
          className={`absolute top-6 right-6 p-4 rounded-full shadow-lg transition transform hover:scale-110 flex items-center gap-2 ${
            isSavedByMe ? "bg-red-50 text-red-500" : "bg-white text-gray-400"
          }`}
        >
          <span className="text-2xl">{isSavedByMe ? "❤️" : "🤍"}</span>
          {saveCount > 0 && <span className="font-bold text-gray-700">{saveCount}</span>}
        </button>
        {/* ----------------------------------------------- */}

        <div className="p-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl font-extrabold text-gray-900">{listing.title}</h1>
            <div className="flex gap-4 items-center">
              {listing.price > 0 && <span className="bg-green-100 text-green-800 text-xl font-bold px-4 py-2 rounded-lg">${listing.price}</span>}
              
              {session?.user?.name === listing.creatorName && (
                <>
                  <Link href={`/edit/${listing._id}`} className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-yellow-600 transition">✏️ Edit</Link>
                  <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 transition">🗑️ Delete</button>
                </>
              )}
            </div>
          </div>
          
          <p className="text-gray-500 text-lg mb-6 font-medium">📍 {listing.location}</p>
          
          <div className="border-t border-b py-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3">About this experience</h3>
            <div className="text-gray-800 leading-relaxed mb-8" dangerouslySetInnerHTML={{ __html: listing.description }} />

            <h3 className="text-xl font-bold text-gray-800 mb-4">Location Map</h3>
            <div className="w-full h-80 rounded-xl overflow-hidden border-2 border-gray-200">
              <iframe width="100%" height="100%" frameBorder="0" scrolling="no" marginHeight={0} marginWidth={0} src={`https://maps.google.com/maps?q=$?q=${encodeURIComponent(listing.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}></iframe>
            </div>
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
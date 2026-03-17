"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Define the structure of our listing data
interface Listing {
  _id: string;
  title: string;
  location: string;
  imageUrl: string;
  price: number;
}

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [favorites, setFavorites] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect to login if the user is not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch the favorite posts when the page loads
  useEffect(() => {
    const fetchFavorites = async () => {
      if (session?.user?.email) {
        try {
          // Send the email to our new API using a query parameter
          // Add { cache: "no-store" } to force the browser to always request fresh data
            const res = await fetch(`/api/favorites?email=${session.user.email}`, { 
            cache: "no-store" 
            });
            
          if (res.ok) {
            const data = await res.json();
            setFavorites(data);
          }
        } catch (error) {
          console.log("Error fetching favorites", error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (session?.user?.email) {
      fetchFavorites();
    }
  }, [session]);

  if (status === "loading" || loading) {
    return <div className="text-center mt-20 text-xl text-gray-600 font-semibold">Loading your favorites...</div>;
  }

  return (
    <div className="container mx-auto p-6 mt-8">
      <h1 className="text-4xl font-extrabold mb-2 text-gray-900 text-center">My Saved Experiences ❤️</h1>
      <p className="text-center text-gray-500 mb-10 text-lg">Places you want to visit next</p>

      {/* Show a message if the user hasn't saved anything yet */}
      {favorites.length === 0 ? (
        <div className="text-center mt-10 bg-red-50 p-10 rounded-2xl max-w-lg mx-auto border border-red-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No favorites yet!</h2>
          <p className="text-gray-600 mb-6">You haven't saved any experiences. Go back to the home page and click the heart icon on places you like.</p>
          <Link href="/" className="bg-red-500 text-white font-bold px-6 py-3 rounded-lg hover:bg-red-600 transition">
            Explore Experiences
          </Link>
        </div>
      ) : (
        /* Show the list of saved posts in a grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.map((listing) => (
            <div key={listing._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
              <img src={listing.imageUrl} alt={listing.title} className="w-full h-48 object-cover" />
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-gray-800 line-clamp-1">{listing.title}</h2>
                  {listing.price > 0 && <span className="bg-green-100 text-green-800 text-sm font-bold px-2 py-1 rounded">${listing.price}</span>}
                </div>
                <p className="text-gray-500 text-sm mb-4 font-medium">📍 {listing.location}</p>
                
                <Link href={`/listing/${listing._id}`} className="block text-center w-full bg-red-50 text-red-500 font-bold py-2 rounded-md border border-red-200 hover:bg-red-500 hover:text-white transition-colors">
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
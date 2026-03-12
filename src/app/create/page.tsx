"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CreateListing() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  // If someone is not logged in, they will automatically be sent to login.
  if (status === "unauthenticated") {
    router.replace("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !location || !imageUrl || !description) {
      setError("Please fill all required fields (Price is optional).");
      return;
    }

    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          location,
          imageUrl,
          description,
          price,
          creatorEmail: session?.user?.email, // Sending the logged-in user's email
        }),
      });

      if (res.ok) {
        router.push("/"); // send to the home page after creating the listing
      } else {
        const data = await res.json();
        setError(data.message || "Failed to create listing.");
      }
    } catch (error) {
      console.log(error);
      setError("Something went wrong.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-lg border-t-4 border-blue-600">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Create a New Experience</h1>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Experience Title</label>
          <input
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="e.g. Sunset Boat Tour"
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-blue-500 text-gray-900"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Location</label>
          <input
            onChange={(e) => setLocation(e.target.value)}
            type="text"
            placeholder="e.g. Bali, Indonesia"
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-blue-500 text-gray-900"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Image URL</label>
          <input
            onChange={(e) => setImageUrl(e.target.value)}
            type="text"
            placeholder="https://example.com/image.jpg"
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-blue-500 text-gray-900"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Price ($) - Optional</label>
          <input
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            placeholder="e.g. 45"
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-blue-500 text-gray-900"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Description</label>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Describe the experience..."
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-blue-500 text-gray-900"
          />
        </div>

        {error && <div className="bg-red-500 text-white text-sm py-2 px-3 rounded-md">{error}</div>}

        <button className="bg-blue-600 text-white font-bold px-6 py-3 rounded-md hover:bg-blue-700 transition">
          Publish Listing
        </button>
      </form>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary"; // Import the Cloudinary widget

export default function EditListing() {
  const { id } = useParams();
  const router = useRouter();

  // State variables to hold our listing data
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch the existing listing details when the page loads
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listings/${id}`);
        if (res.ok) {
          const data = await res.json();
          setTitle(data.title);
          setLocation(data.location);
          setImageUrl(data.imageUrl); // This will load the existing image from database
          setDescription(data.description);
          setPrice(data.price.toString());
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchListing();
  }, [id]);

  // Handle the form submission to update the database
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location || !imageUrl || !description) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, location, imageUrl, description, price: Number(price) }),
      });

      if (res.ok) {
        router.push(`/listing/${id}`); // Redirect back to the details page after saving
      } else {
        setError("Failed to update listing.");
      }
    } catch (error) {
      console.log(error);
      setError("Something went wrong.");
    }
  };

  if (loading) return <div className="text-center mt-20 text-xl">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-lg border-t-4 border-yellow-500">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Experience</h1>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Title" className="border p-2 rounded text-gray-900" />
        <input value={location} onChange={(e) => setLocation(e.target.value)} type="text" placeholder="Location" className="border p-2 rounded text-gray-900" />
        
        {/* --- Image Upload Section Start --- */}
        <div className="border p-4 rounded-md bg-gray-50">
          <label className="block text-gray-700 font-semibold mb-2">Update Image</label>
          <CldUploadWidget 
            uploadPreset="tour_guide_uploads" // Ensure your upload preset name is exactly this
            onSuccess={(result: any) => {
              setImageUrl(result.info.secure_url); // Replace old image URL with the new one
            }}
          >
            {({ open }) => (
              <div className="flex flex-col items-start gap-3">
                <button 
                  type="button" 
                  onClick={() => open()} 
                  className="bg-white text-gray-800 font-semibold px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
                >
                  📷 Change Image
                </button>
                
                {/* Show the current image (from DB) or the newly uploaded one */}
                {imageUrl && (
                  <div className="mt-2 w-full">
                    <p className="text-xs text-gray-500 mb-1">Current Image Preview:</p>
                    <img src={imageUrl} alt="Current listing" className="h-40 w-full object-cover rounded-md border" />
                  </div>
                )}
              </div>
            )}
          </CldUploadWidget>
        </div>
        {/* --- Image Upload Section End --- */}

        <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" placeholder="Price" className="border p-2 rounded text-gray-900" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Description" className="border p-2 rounded text-gray-900" />
        
        {error && <div className="bg-red-500 text-white p-2 rounded">{error}</div>}
        
        <div className="flex gap-4">
          <button type="submit" className="bg-yellow-500 text-white font-bold px-6 py-2 rounded hover:bg-yellow-600 transition">Save Changes</button>
          <button type="button" onClick={() => router.push(`/listing/${id}`)} className="bg-gray-300 text-gray-800 font-bold px-6 py-2 rounded hover:bg-gray-400 transition">Cancel</button>
        </div>
      </form>
    </div>
  );
}
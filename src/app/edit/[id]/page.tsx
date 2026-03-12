"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditListing() {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // පිටුවට එද්දිම පරණ විස්තර ටික අරගෙන ෆෝම් එකට පුරවනවා
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listings/${id}`);
        if (res.ok) {
          const data = await res.json();
          setTitle(data.title);
          setLocation(data.location);
          setImageUrl(data.imageUrl);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !location || !imageUrl || !description) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      // අප්ඩේට් කරන API එකට ඩේටා යවනවා
      const res = await fetch(`/api/listings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, location, imageUrl, description, price: Number(price) }),
      });

      if (res.ok) {
        router.push(`/listing/${id}`); // අප්ඩේට් කළාට පස්සේ ආයෙත් විස්තර පිටුවට යවනවා
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
        <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Title" className="border p-2 rounded" />
        <input value={location} onChange={(e) => setLocation(e.target.value)} type="text" placeholder="Location" className="border p-2 rounded" />
        <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} type="text" placeholder="Image URL" className="border p-2 rounded" />
        <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" placeholder="Price" className="border p-2 rounded" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Description" className="border p-2 rounded" />
        
        {error && <div className="bg-red-500 text-white p-2 rounded">{error}</div>}
        
        <div className="flex gap-4">
          <button type="submit" className="bg-yellow-500 text-white font-bold px-6 py-2 rounded hover:bg-yellow-600">Save Changes</button>
          <button type="button" onClick={() => router.push(`/listing/${id}`)} className="bg-gray-300 text-gray-800 font-bold px-6 py-2 rounded hover:bg-gray-400">Cancel</button>
        </div>
      </form>
    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("All fields are necessary.");
      return;
    }

    try {
      const res = await fetch("api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (res.ok) {
        const form = e.target as HTMLFormElement;
        form.reset();
        router.push("/login"); // රෙජිස්ටර් වුණාට පස්සේ ලොගින් එකට යවනවා
      } else {
        const { message } = await res.json();
        setError(message);
      }
    } catch (error) {
      console.log("Error during registration: ", error);
      setError("Something went wrong.");
    }
  };

  return (
    <div className="grid place-items-center h-screen bg-gray-100">
      <div className="shadow-lg p-8 rounded-lg border-t-4 border-blue-600 bg-white w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Register</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Full Name"
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:border-blue-500 text-gray-900"
          />
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Email Address"
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:border-blue-500 text-gray-900"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:border-blue-500 text-gray-900"
          />
          
          <button className="bg-blue-600 text-white font-bold cursor-pointer px-6 py-2 rounded-md mt-2 hover:bg-blue-700 transition">
            Register
          </button>

          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}

          <div className="text-sm mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-semibold hover:underline">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // NextAuth එකේ signIn function එක පාවිච්චි කරලා ලොග් වෙනවා
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password.");
        return;
      }

      // ලොගින් වුණාට පස්සේ ප්‍රධාන පිටුවට (Home) යවනවා
      router.replace("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="grid place-items-center h-screen bg-gray-100">
      <div className="shadow-lg p-8 rounded-lg border-t-4 border-blue-600 bg-white w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            Login
          </button>

          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}

          <div className="text-sm mt-4 text-center text-gray-600">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-600 font-semibold hover:underline">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
# Mini Travel Experience Listing Platform 🌍

A full-stack web application that allows users to discover and share unique local travel experiences. Built with Next.js (App Router), MongoDB, and Tailwind CSS.

## 🚀 Live Demo
**[Insert Your Vercel Live Link Here]**

---

## ✨ Features

### Core Features (Completed)
- **User Authentication:** Secure Registration and Login using NextAuth.js (Credentials Provider) and bcrypt for password hashing.
- **Create Listings:** Authenticated users can create new travel experiences with titles, locations, image URLs, descriptions, and optional pricing.
- **Public Feed:** A dynamic homepage displaying all listings sorted by the newest first, featuring relative timestamps (e.g., "2 hours ago").
- **Listing Detail Page:** Dynamic routing (`/listing/[id]`) to view the full details of a specific travel experience.

### Optional Features (Completed)
- **Search Functionality:** Users can search and filter experiences by title or location in real-time.
- **Edit & Delete Listings:** Creators have full CRUD capabilities over their own listings.
- **Responsive UI:** Fully responsive design optimized for mobile, tablet, and desktop using Tailwind CSS.

---

## 🛠️ Tech Stack
- **Frontend:** Next.js 15 (React), Tailwind CSS
- **Backend:** Next.js Route Handlers (API Routes)
- **Database:** MongoDB, Mongoose
- **Authentication:** NextAuth.js
- **Deployment:** Vercel

---

## 🧠 Product Thinking: Scaling to 10,000+ Users

**Question:** *How would you scale this application if it had 10,000+ active users?*

If this platform grows to 10,000+ active users, the main challenges will be database overload, slow image loading, and app security. Here is how I would scale the app in a simple, practical way:

1. **Loading Data in Chunks (Pagination & Indexing):**
   Currently, the app loads all travel experiences at once. For a large user base, I would implement **Pagination** or "Infinite Scroll" (similar to Instagram). It will only load the first 10-15 posts, and fetch more only when the user scrolls down. I will also use **Database Indexing**, which acts like a book's index, helping the database find specific posts instantly without scanning the entire system.

2. **Using a Quick Memory "Snapshot" (Caching):**
   If 5,000 users open the homepage at the exact same second, asking the database for data 5,000 times might crash it. Instead, I would use **Caching** (using Redis or Next.js ISR). This takes a quick "snapshot" of the homepage and shows that to users. The main database is only disturbed when someone adds a *new* post.

3. **Faster Images (Image Optimization & CDN):**
   Travel platforms are heavily reliant on high-quality photos, which can make the app slow. I would use a **CDN (Content Delivery Network)** like AWS S3 or Cloudinary. A CDN stores copies of your images on servers all over the world. So, if a user in Japan opens the app, the image loads from a server in Japan, making it extremely fast.

4. **Protecting the App (Rate Limiting):**
   More users usually bring more bots and spam. I would implement **Rate Limiting** on the APIs. This acts like a security guard, preventing a single user or bot from attempting to "Login" or "Create a Listing" 100 times per second to crash the servers.

---

## 💻 Local Setup Instructions

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install

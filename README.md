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

If this application scales to 10,000+ active users, I would implement the following architectural and code-level optimizations:

1. **Database Optimization & Pagination:**
   - Currently, the feed fetches all listings at once. I would implement **Server-Side Pagination** or Infinite Scrolling (using `limit` and `skip` in MongoDB) to reduce the payload size.
   - I would add **Database Indexing** to frequently queried fields like `createdAt`, `location`, and `creator` to speed up query execution times.

2. **Caching Strategy (Redis & Next.js Cache):**
   - The public feed is read-heavy. I would utilize Next.js **Incremental Static Regeneration (ISR)** or integrate **Redis** to cache the feed. This prevents hitting the MongoDB database for every single page load.

3. **Image Optimization & Storage:**
   - Instead of relying on external Image URLs directly via standard `<img>` tags, I would use the **Next.js `<Image />` component** for automatic resizing, WebP conversion, and lazy loading.
   - For user uploads, I would integrate a dedicated cloud storage/CDN solution like **AWS S3** or **Cloudinary** to serve media assets faster globally.

4. **Security & Rate Limiting:**
   - With higher traffic, the API becomes vulnerable to abuse. I would implement **Rate Limiting** (e.g., using Upstash or standard middleware) on authentication routes and listing creation routes to prevent spam and brute-force attacks.

---

## 💻 Local Setup Instructions

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install

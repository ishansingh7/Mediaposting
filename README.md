# PulsePress MERN Social Article Platform

A MERN stack social media-style article platform with MongoDB, Express, React, Node, Tailwind CSS, and role-based Admin/Visitor UI.

## Run Locally

```bash
npm.cmd install
npm.cmd run dev
```

Frontend: `http://localhost:5173`  
Backend API: `http://localhost:4000`
MongoDB: `mongodb://127.0.0.1:27017/pulsepress`

If PowerShell blocks `npm`, use `npm.cmd` as shown above.

Create a backend environment file from the example:

```bash
copy backend\.env.example backend\.env
```

Make sure MongoDB is running locally, or update `backend\.env` with your MongoDB Atlas connection string.

If you start only the Vite frontend, admin login will fail unless the backend is also running. Start both with `npm.cmd run dev`, or run them in two terminals:

```bash
npm.cmd run server
npm.cmd run client
```

The frontend uses `http://localhost:4000` as the default API URL in development. You can override it with `VITE_API_URL`.

## Features

- Visitor mode: browse posts, like, comment, share, view profile, filter categories.
- Admin login: default local credentials are `admin@pulsepress.com` / `admin123`.
- Admin mode: create posts with image upload, edit, delete, hide/unhide, view dashboard analytics, manage profile, upload avatar and cover photo.
- Social feed: latest-first post cards, animated likes, expandable comments, view increments on open.
- Right sidebar: dynamic categories, most liked, most viewed, and trending posts.
- Profile page: Facebook-style cover, overlapping avatar, tabs for posts/about/activity, admin-only editing.
- Backend: Express REST API with MongoDB/Mongoose models, seeded data, and admin-guarded mutations.

## Structure

```text
frontend/
  src/
    components/   Navbar, sidebars, cards, dashboard, profile, forms
    lib/          API client and formatting helpers
    state/        React Context app state
  package.json    Frontend dependencies and Vite scripts
backend/
  src/
    config/       MongoDB connection
    models/       Mongoose Profile and Post models
    utils/        Database seeding and serializers
    index.js      Express API routes
    seed.js       Initial posts and admin profile
  package.json    Backend dependencies and Node scripts
package.json      Root workspace scripts for running both apps
```

The backend now stores posts, profile data, likes, views, comments, and hidden state in MongoDB. On first startup, it seeds MongoDB from `backend/src/seed.js`.

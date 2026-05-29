# AssamStudentHub — Frontend

The modern web application for AssamStudentHub. Built with Next.js 16 (Turbopack) and React 19, this frontend serves as the public face for students to explore aggregated job notices, university announcements, and scholarships.

It also features a securely protected Admin Dashboard for orchestrating the Python scraper pipelines.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + Framer Motion (Glassmorphism design)
- **Authentication:** Supabase Auth (Google OAuth)
- **Icons:** Lucide React

## Features
- **Dynamic Search & Filtering:** Filter 32+ sources by category (Jobs, Exams, Academic, Scholarships).
- **Server-Side Rendering:** SEO-optimized dynamic pages with automatic JSON-LD structured data generation for Google indexing.
- **Glassmorphism UI:** Premium, animated user interfaces with fully responsive mobile and desktop layouts.
- **Admin Dashboard:** A protected route (`/admin`) guarded by email whitelisting, allowing administrators to manually trigger GitHub Actions workflows via Webhooks.
- **Monitoring Portal:** A live `/monitoring` page connected to the Supabase telemetry tables showing the exact health and execution time of all 32 scraper pipelines.

## Environment Variables

Create a `.env.local` file in this directory before starting the dev server:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Used to fix proxy redirects for Google Auth
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Admin Dashboard Protection
ADMIN_EMAIL=rahulgautam0721@gmail.com

# GitHub Webhook Authentication
GITHUB_ACCESS_TOKEN=your_github_personal_access_token
GITHUB_REPOSITORY=Your_User/Your_Repo
```

## Running Locally

```bash
npm install
npm run dev
```

Then visit [http://localhost:3000](http://localhost:3000) in your browser.

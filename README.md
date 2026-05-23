# AssamStudentHub

AssamStudentHub is a unified, high-performance notice board and student opportunity aggregator designed for aspirants and students in Assam. It aggregates notices, job updates, exam timetables, results, and admissions from dozens of state departments and universities into a single, cohesive feed.

Designed with a focus on web speed, SEO, accessibility, and modern editorial aesthetics, the platform replaces the tedious manual process of checking fragmented, slow-loading official websites.

---

## Key Features

* **Unified Opportunity Feed**: A single-column page structure across all opportunity categories (Jobs, Exams, Scholarships, Admissions) ensuring a clean and consistent reading experience.
* **Typography and Typo-Tolerant Search**: High-speed search leveraging PostgreSQL Trigram indexing and Fuzzy Match RPC functions to handle spelling errors gracefully, completed by search analytics logging.
* **Scraper Telemetry Dashboard**: Live monitoring dashboard at `/monitoring` displaying crawler heartbeats, timing durations, database insertion rates, and error logs for all backend pipelines.
* **Modern Theme System**: Automatic system preference sync and manual theme toggling built on class-based dark mode rules using Tailwind CSS v4. Includes customized accessible Nvidia Green accents.
* **Mobile Responsive Design**: Clean layouts across all screen breakpoints. Fixed sidebar layout conflicts on mobile breakpoints using responsive container rules to prevent scroll conflicts and content clipping.
* **Student Bookmarks**: Dynamic client-side notice saving for offline reference and personal boards.
* **Clickable Announcements**: Fully interactive, layout-integrated alert ribbons highlighted on the homepage and directories for notices tagged as "important".

---

## Technology Stack

* **Framework**: Next.js 16 (App Router, Turbopack)
* **Runtime and Language**: Node.js and TypeScript
* **Styling**: Tailwind CSS v4 and Framer Motion
* **Database and Services**: Supabase (PostgreSQL with custom text search indexing functions, RPCs)
* **Iconography**: Lucide React

---

## Getting Started

### Prerequisites

* Node.js (v18.x or later)
* npm or pnpm
* A Supabase project instance

### 1. Clone the Repository

```bash
git clone https://github.com/rahulv-official/assam-student-hub
cd assam-student-hub
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory and populate your Supabase endpoint and public anon key:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_public_key
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be accessible at [http://localhost:3000](http://localhost:3000).

### 5. Production Build

To build and compile the optimized production bundle, run:

```bash
npm run build
npm run start
```

---

## Project Structure

```
src/
├── app/                  # Next.js App Router (pages and API endpoints)
│   ├── categories/       # Dynamic category pages (Jobs, Exams, Scholarships, etc.)
│   ├── institutions/     # Academic directories & university filters
│   ├── jobs/             # Notice details, attachments, and relative sidebar scrolls
│   ├── monitoring/       # Live crawler telemetry dashboard
│   └── globals.css       # Core Tailwind CSS v4 directives & variable styling
├── components/           # Reusable UI components
│   ├── home/             # Homepage layouts, sliders, and footers
│   ├── layout/           # Global navigation and dark theme controls
│   └── ui/               # Primitive buttons, dialogs, and styling cards
├── services/             # Supabase data retrieval and analytics logs
├── types/                # Core TypeScript interfaces (Notice, ScraperRun, etc.)
└── lib/                  # Utilities (styling merges, date helpers, salary extractors)
```

---

## License

This project is licensed under the MIT License.

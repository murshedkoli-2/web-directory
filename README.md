# WebNexus - Modern Categorized Web Directory & Citizen Portal

A full-stack categorized website and citizen services directory built with **Next.js (React 19)**, **Neon Serverless PostgreSQL**, **Prisma ORM**, and **shadcn/ui**.

![WebNexus Preview](/public/logo.png)

---

## 🌟 Key Features

### 🌐 Public Directory Experience
- **Categorized Navigation**: 11 curated categories including *AI & Machine Learning*, *Developer Tools*, *Design & UI/UX*, *Productivity*, *Govt & Citizen Services*, and *Open Source*.
- **Live Search & Filtering**: Real-time keyword search (with `/` keyboard shortcut), pricing tier filter (`Free`, `Freemium`, `Paid`, `Open Source`), and relational tag chips.
- **Bookmarks & Community Upvoting**: Synchronized upvoting system with local persistence.
- **Detailed Resource Previews**: Modals with feature highlight checklists, verified URLs, and category info.

### 🇧🇩 Bangladeshi Govt & Saudi Visa Services
- **Official Citizen Application Portals**:
  - Bangladesh e-Passport Online Registration (`epassport.gov.bd`)
  - Bangladesh Smart NID Card Services (`services.nidw.gov.bd`)
  - Birth & Death Registration Information System (`bdris.gov.bd`)
  - BMET Manpower & Emigration Clearance (`bmet.gov.bd`, `amiprobashi.com`)
  - BRTA Driving License & Vehicle Fitness (`bsp.brta.gov.bd`)
  - Surokkha QR Vaccine Verification (`surokkha.gov.bd`)
  - NBR e-TIN & Tax Return (`secure.incometax.gov.bd`)
  - Police Clearance Certificate PCC (`pcc.police.gov.bd`)
- **Expatriate & Visa Validity Platforms**:
  - Muqeem Saudi Exit Re-Entry & Iqama Validity (`muqeem.sa`)
  - KSA Visa / MOFA Saudi Visa Platform (`visa.mofa.gov.sa`)
  - Wafid (GAMCA) GCC Medical Check (`wafid.com`)
  - Visit Saudi Official eVisa Portal (`visa.visitsaudi.com`)

### 🛡️ Enterprise Sidebar Admin Dashboard (`/admin`)
- **Responsive Navigation Sidebar**: Collapsible drawer on mobile, persistent on desktop with live metric counters.
- **Multi-Tab Dedicated Views**:
  - 📊 **Dashboard & Metrics**: Visual category distribution progress bars, Top 5 popularity leaderboard, and recent submissions stream.
  - 🌐 **Websites Catalog Table**: Full CRUD data table with instant search, category filtering, inline featured switches, and JSON Export.
  - 📁 **Categories Manager**: Category cards with live website counters.
  - 🏷️ **Tags & Taxonomy**: Tag frequency cloud with item counts.
  - ⚡ **Neon Database Health**: Real-time connection diagnostics, latency ping tester, and table breakdown.
- **🧙‍♂️ 5-Step Website Publishing Wizard (`/admin/websites/new`)**:
  - Step 1: Basic Info & Domain Auto-detection
  - Step 2: Content & Copywriting
  - Step 3: Relational Tags & Dynamic Highlights Builder
  - Step 4: Branding & Color Customizer
  - Step 5: Live Directory Card Preview & Final Publish to Neon DB

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack, React 19)
- **Database**: Neon Serverless PostgreSQL
- **ORM**: Prisma ORM v6
- **Styling**: Tailwind CSS v4 & Lucide Icons
- **UI Components**: shadcn/ui & next-themes (Dark/Light mode)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/murshedkoli-2/web-directory.git
cd web-directory
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://username:password@ep-your-pooler-endpoint.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

### 4. Push Schema & Seed Database
```bash
# Push schema to Neon PostgreSQL
npm run db:push

# Seed categories, websites, and tags
npm run db:seed
```

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public directory, and [http://localhost:3000/admin](http://localhost:3000/admin) for the Admin Dashboard.

---

## 📜 Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local Next.js development server |
| `npm run build` | Builds optimized production bundle |
| `npm run db:push` | Synchronizes Prisma schema directly to Neon DB |
| `npm run db:seed` | Populates curated catalog dataset |
| `npm run db:studio` | Launches Prisma Studio visual database browser |

---

## 📄 License
MIT License.

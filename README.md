# Chasr

Chasr is a modern, open-source accountability and goal-tracking platform for founders and makers. It helps you set ambitious targets, publicly track your progress, and stay accountable to your community.

## 🚀 Features
- **Public Commitments**: Create goals with hard deadlines and public visibility.
- **Progress Tracking**: Log updates, track metrics (like MRR, users, etc.), and watch your progress bar fill up.
- **Leaderboard**: See who's crushing their goals across the community.
- **Founder Dashboard**: A sleek, minimal dashboard to manage your active and past targets.
- **Embeddable Widgets**: Showcase your live goal progress directly on your personal website or product landing page.

## 🛠️ Tech Stack
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Actions)
- **Database**: PostgreSQL
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [Supabase](https://supabase.com/) Auth
- **Styling**: Tailwind CSS
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) & Lucide Icons

## 📂 Project Structure

```text
chasr/
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (public)/       # Public pages (Home, Leaderboard, Public Goal pages)
│   │   ├── dashboard/      # Protected founder dashboard & forms
│   │   └── api/            # Route handlers (e.g., cron jobs)
│   ├── components/         # Reusable React components (UI, charts, sidebars)
│   └── lib/                # Shared utilities, Prisma client, Auth helpers
├── prisma/                 # Database schema and configurations
└── public/                 # Static assets (images, fonts, favicons)
```

## 🚦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) 18+ installed
- A PostgreSQL database (e.g., local, Supabase, Neon)
- A Supabase project (for Authentication)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/chasr.git
cd chasr
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory based on the variables required. You will need:
```env
# Database Connection
DATABASE_URL="postgresql://user:password@localhost:5432/chasr"

# Supabase Auth Keys
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Application URL (Used for absolute links & OpenGraph generation)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database Setup
Push the Prisma schema to your database to easily create the necessary tables:
```bash
npx prisma db push
```

*(Alternatively, you can generate and run migrations using `npx prisma migrate dev`)*

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the app running!

## 🤝 Contributing

Contributions are highly welcome! We strive to keep the codebase clean, organized, and entirely lint-error-free to make contributing as easy as possible.

1. Fork the project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Ensure your code passes all linting rules (`npm run lint`)
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the Branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

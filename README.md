# TinyLink - URL ShortenerThis is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).



A modern, clean URL shortening service built with Next.js, TypeScript, Tailwind CSS, and Prisma.## Getting Started



## FeaturesFirst, run the development server:



- ✨ **Create Short Links**: Shorten any URL with optional custom codes```bash

- 📊 **Analytics**: Track clicks and view detailed statisticsnpm run dev

- 🔍 **Search & Filter**: Find links quickly with search and sorting# or

- 🗑️ **Link Management**: Delete links easilyyarn dev

- 📱 **Responsive Design**: Works seamlessly on all devices# or

- ⚡ **Real-time Updates**: Instant feedback and state updatespnpm dev

# or

## Tech Stackbun dev

```

- **Framework**: Next.js 15 with App Router

- **Language**: TypeScriptOpen [http://localhost:3000](http://localhost:3000) with your browser to see the result.

- **Styling**: Tailwind CSS

- **Database**: PostgreSQL (via Prisma ORM)You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

- **Validation**: Zod

- **Deployment**: Vercel (recommended)This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.



## Getting Started## Learn More



### PrerequisitesTo learn more about Next.js, take a look at the following resources:



- Node.js 18+ - [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

- PostgreSQL database (or use Neon for free cloud PostgreSQL)- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.



### InstallationYou can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!



1. **Clone the repository**## Deploy on Vercel

   ```bash

   git clone <your-repo-url>The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

   cd tinylink

   ```Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your database URL:
   ```
   DATABASE_URL="your-postgresql-connection-string"
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Endpoints

### Health Check
- `GET /healthz` - Returns system health status

### Links Management
- `POST /api/links` - Create a new short link
- `GET /api/links` - Get all links
- `GET /api/links/:code` - Get stats for a specific link
- `DELETE /api/links/:code` - Delete a link

### Redirect
- `GET /:code` - Redirect to target URL (302)

## Routes

- `/` - Dashboard (list all links, create new, delete)
- `/code/:code` - Statistics page for a specific link
- `/:code` - Redirect to target URL
- `/healthz` - Health check endpoint

## Validation Rules

- **URL**: Must be a valid URL format
- **Custom Code**: 
  - Optional (auto-generated if not provided)
  - 6-8 alphanumeric characters `[A-Za-z0-9]{6,8}`
  - Must be globally unique

## Deployment

### Deploy to Vercel

1. **Push your code to GitHub**

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Set up Database**
   - Create a free PostgreSQL database on [Neon](https://neon.tech)
   - Copy the connection string

4. **Add Environment Variables**
   - In Vercel project settings, add:
     - `DATABASE_URL`: Your Neon PostgreSQL connection string
     - `NEXT_PUBLIC_BASE_URL`: Your Vercel deployment URL

5. **Deploy**
   - Vercel will automatically deploy
   - Run migrations on first deployment if needed

### Database Setup for Production

For production, use a managed PostgreSQL service:
- [Neon](https://neon.tech) - Free tier available
- [Supabase](https://supabase.com) - Free tier available
- [Railway](https://railway.app) - Free tier available

Update `prisma/schema.prisma` to use PostgreSQL:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Run migrations:
```bash
npx prisma migrate deploy
```

## Project Structure

```
tinylink/
├── app/
│   ├── api/
│   │   ├── links/
│   │   │   ├── [code]/
│   │   │   │   └── route.ts    # Get/Delete specific link
│   │   │   └── route.ts        # Create/List links
│   │   └── healthz/
│   │       └── route.ts        # Health check
│   ├── code/
│   │   └── [code]/
│   │       └── page.tsx        # Stats page
│   ├── [code]/
│   │   └── route.ts           # Redirect handler
│   ├── page.tsx               # Dashboard
│   └── layout.tsx             # Root layout
├── lib/
│   └── prisma.ts             # Prisma client singleton
├── prisma/
│   └── schema.prisma         # Database schema
└── .env.example              # Environment variables template
```

## Features Checklist

- ✅ Create short links with optional custom codes
- ✅ Validate URLs before saving
- ✅ Check for duplicate codes (return 409)
- ✅ 302 redirect on `/:code`
- ✅ Track click count and last clicked time
- ✅ Delete links (returns 404 after deletion)
- ✅ Dashboard with full link management
- ✅ Stats page for individual links
- ✅ Health check endpoint
- ✅ Search and filter functionality
- ✅ Responsive design
- ✅ Loading states
- ✅ Error states
- ✅ Form validation
- ✅ Empty states

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Database Commands

- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma generate` - Generate Prisma Client
- `npx prisma db push` - Push schema changes (for development)

## License

MIT

## Author

Created as a take-home assignment for TinyLink URL shortener project.

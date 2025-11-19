# Deployment Guide for TinyLink

## Prerequisites

1. GitHub account
2. Vercel account (free tier)
3. Neon PostgreSQL account (free tier)

## Step-by-Step Deployment

### 1. Set Up Database on Neon

1. Go to [https://neon.tech](https://neon.tech)
2. Sign up for a free account
3. Create a new project
4. Create a new database
5. Copy the connection string (it will look like):
   ```
   postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### 2. Prepare Your Code

1. Make sure all your changes are committed:
   ```bash
   git add .
   git commit -m "Initial commit - TinyLink URL shortener"
   ```

2. Create a new repository on GitHub (if not already done)

3. Push your code to GitHub:
   ```bash
   git remote add origin https://github.com/yourusername/tinylink.git
   git branch -M main
   git push -u origin main
   ```

### 3. Update Schema for PostgreSQL

Before deploying, update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite" to "postgresql"
  url      = env("DATABASE_URL")
}
```

Commit this change:
```bash
git add prisma/schema.prisma
git commit -m "Update database provider to PostgreSQL"
git push
```

### 4. Deploy to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: ./
   - **Build Command**: Leave default or use `prisma generate && prisma migrate deploy && next build`
   - **Output Directory**: .next (default)

5. **Add Environment Variables**:
   Click "Environment Variables" and add:
   - **Name**: `DATABASE_URL`
     **Value**: Your Neon connection string
   - **Name**: `NEXT_PUBLIC_BASE_URL`
     **Value**: `https://your-project-name.vercel.app` (you'll update this after first deployment)

6. Click "Deploy"

### 5. Run Database Migrations

After the first deployment:

1. Install Vercel CLI (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Link your project:
   ```bash
   vercel link
   ```

4. Run migrations:
   ```bash
   vercel env pull .env.production
   npx prisma migrate deploy
   ```

   Or use Vercel's online terminal or add a postbuild script.

### 6. Update Base URL

1. After deployment, Vercel will give you a URL like `https://tinylink-xxx.vercel.app`
2. Go to Vercel project settings → Environment Variables
3. Update `NEXT_PUBLIC_BASE_URL` to your actual deployment URL
4. Redeploy (Vercel will auto-redeploy when you update env vars, or trigger manually)

### 7. Test Your Deployment

Visit your deployed URL and test:
- ✅ Health check: `https://your-app.vercel.app/healthz`
- ✅ Create a link from the dashboard
- ✅ Click the short link to test redirect
- ✅ View stats page
- ✅ Delete a link

## Troubleshooting

### Database Connection Issues

If you see database connection errors:
1. Verify your `DATABASE_URL` is correct in Vercel environment variables
2. Make sure it includes `?sslmode=require` for Neon
3. Check that migrations have been run

### Build Fails

If build fails with Prisma errors:
1. Ensure `postinstall` script in `package.json` includes `prisma generate`
2. Verify `prisma` is in `dependencies`, not `devDependencies`
3. Check Vercel build logs for specific errors

### App Doesn't Load

1. Check Vercel function logs
2. Verify all environment variables are set
3. Make sure database is accessible from Vercel's network

## Alternative: One-Click Deploy

You can also use Vercel's one-click deploy:

1. Add a `Deploy to Vercel` button to your README
2. Create a template with pre-configured environment variables
3. Users can deploy with a single click

## Monitoring

After deployment:
- Monitor at Vercel Dashboard → Your Project → Analytics
- Check logs at Vercel Dashboard → Your Project → Logs
- Use Neon dashboard to monitor database usage

## Custom Domain (Optional)

To add a custom domain:
1. Go to Vercel project settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_BASE_URL` environment variable

## Cost Considerations

- **Vercel**: Free tier includes 100GB bandwidth, unlimited requests
- **Neon**: Free tier includes 0.5 GB storage, 1 project
- Both are sufficient for the assignment and small-scale usage

## Support

If you encounter issues:
- Check Vercel documentation: https://vercel.com/docs
- Check Neon documentation: https://neon.tech/docs
- Check Prisma documentation: https://www.prisma.io/docs

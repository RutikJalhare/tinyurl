# Quick Start Guide for Reviewers

This guide will help you quickly set up and test the TinyLink application.

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Git

## 1. Clone & Install (2 minutes)

```bash
# Clone the repository
git clone <repository-url>
cd tinylink

# Install dependencies
npm install

# Set up environment (for local SQLite)
cp .env.example .env
# Edit .env and set:
# DATABASE_URL="file:./dev.db"
# NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

## 2. Database Setup (30 seconds)

```bash
# Generate Prisma client and create database
npx prisma migrate dev
npx prisma generate
```

## 3. Start Development Server (10 seconds)

```bash
npm run dev
```

Visit: http://localhost:3000

## 4. Quick Feature Test (5 minutes)

### Test 1: Health Check
```bash
curl http://localhost:3000/healthz
# Should return: {"ok":true,"version":"1.0",...}
```

### Test 2: Create a Link
1. Open http://localhost:3000
2. Click "+ Add New Link"
3. Enter URL: `https://github.com`
4. Enter Custom Code: `github`
5. Click "Create Short Link"
6. ✅ Link should appear in the table

### Test 3: Test Redirect
1. Open http://localhost:3000/github
2. ✅ Should redirect to GitHub
3. Go back to dashboard
4. ✅ Click count should be 1

### Test 4: View Stats
1. Click "Stats" button for the link
2. ✅ Should show detailed statistics
3. ✅ Shows 1 click and timestamp

### Test 5: Duplicate Code (409 Error)
1. Try to create another link with code `github`
2. ✅ Should show error: "Short code already exists"

### Test 6: Delete Link
1. Click "Delete" button
2. Confirm deletion
3. ✅ Link removed from table
4. Visit http://localhost:3000/github
5. ✅ Should show 404 Not Found

## 5. API Testing with curl

```bash
# Create link
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{"targetUrl":"https://www.google.com","code":"google1"}'

# Get all links
curl http://localhost:3000/api/links

# Get single link stats
curl http://localhost:3000/api/links/google1

# Test redirect (should return 302)
curl -I http://localhost:3000/google1

# Delete link
curl -X DELETE http://localhost:3000/api/links/google1

# Verify 404 after deletion
curl -I http://localhost:3000/google1
```

## 6. Test Responsive Design

1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test on different screen sizes:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1024px+)
4. ✅ Layout should adapt properly

## 7. Browse Database (Optional)

```bash
npx prisma studio
```

Opens database GUI at http://localhost:5555

## Expected Results Checklist

After testing, you should have verified:

- ✅ `/healthz` returns 200 with proper JSON
- ✅ Can create links with auto-generated codes
- ✅ Can create links with custom codes (6-8 chars)
- ✅ Duplicate codes return 409 error
- ✅ Invalid URLs show validation errors
- ✅ `/:code` redirects with 302 status
- ✅ Click count increments on each visit
- ✅ Last clicked timestamp updates
- ✅ Stats page shows detailed information
- ✅ Can delete links
- ✅ Deleted links return 404
- ✅ Dashboard shows all links
- ✅ Search/filter works
- ✅ Sort by date/clicks works
- ✅ Copy buttons work
- ✅ Responsive on all screen sizes
- ✅ Loading states display
- ✅ Error messages are clear
- ✅ Empty state shows when no links

## Troubleshooting

### Port 3000 already in use
```bash
# Kill process on port 3000
npx kill-port 3000
# Or use different port
PORT=3001 npm run dev
```

### Database errors
```bash
# Reset database
rm -rf prisma/dev.db
npx prisma migrate dev
```

### Module not found errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npx prisma generate
```

### Build errors
```bash
# Check TypeScript
npm run build
```

## Performance Test

Create multiple links quickly:
```bash
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/links \
    -H "Content-Type: application/json" \
    -d "{\"targetUrl\":\"https://example.com/page$i\"}" &
done
wait
```

Dashboard should handle 10+ links smoothly.

## Code Quality Check

```bash
# Run linter
npm run lint

# Check TypeScript
npx tsc --noEmit
```

## File Structure Overview

Key files to review:
- `app/page.tsx` - Dashboard UI
- `app/api/links/route.ts` - Create/List API
- `app/api/links/[code]/route.ts` - Get/Delete API
- `app/[code]/route.ts` - Redirect handler
- `app/code/[code]/page.tsx` - Stats page
- `prisma/schema.prisma` - Database schema
- `lib/prisma.ts` - Database client

## Production Deployment

To test production build locally:
```bash
npm run build
npm start
```

Visit: http://localhost:3000

## Automated Tests

Run all API tests:
```bash
# Make script executable
chmod +x test-api.sh

# Run tests (if test-api.sh exists)
./test-api.sh
```

## Clean Up

When done testing:
```bash
# Stop the dev server (Ctrl+C)
# Remove database (optional)
rm -rf prisma/dev.db
```

## Questions During Review?

Check these files:
- `README.md` - Full documentation
- `DEPLOYMENT.md` - Deployment guide
- `TESTING.md` - Detailed test cases
- `SUBMISSION.md` - Project overview

## Estimated Review Time

- Setup: 3 minutes
- Feature testing: 10 minutes
- Code review: 20 minutes
- **Total: ~30 minutes**

## Contact

If you encounter any issues during review, please check:
1. Node.js version (18+)
2. All dependencies installed
3. Database migrations run
4. Server is running on correct port

---

**Happy Testing! 🚀**

# Deployment Guide - Amrutha NextGen Stores

Complete step-by-step guide to make your ecommerce application live on Vercel with Neon Postgres and Cloudinary.

## Prerequisites

1. **GitHub/GitLab Account** - To host your code
2. **Vercel Account** - For hosting (free tier available)
3. **Neon Account** - For Postgres database (free tier available)
4. **Cloudinary Account** - For image storage (free tier available)

## Step 1: Set Up Accounts

### 1.1 Create Neon Database

1. Go to [neon.tech](https://neon.tech) and sign up
2. Create a new project
3. Copy your **connection string** (looks like `postgres://user:pass@host/dbname`)
4. Keep this safe - you'll need it later

### 1.2 Create Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com) and sign up
2. From your dashboard, copy:
   - **Cloud name** (e.g., `dzkqb1cv5`)
   - **API Key** (e.g., `394696275514733`)
   - **API Secret** (copy this - you'll need it)
3. Create an **Unsigned Upload Preset**:
   - Go to Settings → Upload → Upload presets
   - Click "Add upload preset"
   - Set **Signing mode** to "Unsigned"
   - Name it something simple (e.g., `unsigned_ecom`)
   - Save and note the preset name

### 1.3 Prepare Your Code

1. Ensure `prisma/schema.prisma` uses Postgres:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Copy `env.example` to `.env` and fill in your values:
   ```powershell
   Copy-Item env.example .env
   # Then edit .env with your actual credentials
   ```

## Step 2: Initialize Production Database

### 2.1 Push Schema to Neon

```powershell
cd C:\Users\indian\Documents\Cursor\ecommerce

# Set your Neon connection string
$env:DATABASE_URL="postgres://your-neon-connection-string"

# Update .env file
(Get-Content .env) -notmatch '^DATABASE_URL=' | Set-Content .env
Add-Content .env ('DATABASE_URL="' + $env:DATABASE_URL + '"')

# Stop any running servers
taskkill /F /IM node.exe

# Push schema to Neon
npx prisma db push

# Generate Prisma client
npx prisma generate
```

### 2.2 Seed Database (Optional)

```powershell
npm run db:seed
```

This creates sample categories and products. You can also add products via the admin UI later.

### 2.3 Test Locally Against Neon

```powershell
npm run dev
```

Verify:
- Homepage loads: http://localhost:3000
- Products API works: `Invoke-RestMethod http://localhost:3000/api/products`
- Admin unlock: Visit `http://localhost:3000/?admin=Abhinav`
- Create product: Go to `/admin/products/new` and test image upload

## Step 3: Push Code to GitHub

### 3.1 Initialize Git (if not already done)

```powershell
git init
git add .
git commit -m "Initial commit - ready for deployment"
```

### 3.2 Create GitHub Repository

1. Go to [github.com](https://github.com) and create a new repository
2. Don't initialize with README (you already have one)
3. Copy the repository URL

### 3.3 Push Your Code

```powershell
git remote add origin https://github.com/yourusername/your-repo.git
git branch -M main
git push -u origin main
```

## Step 4: Deploy on Vercel

### 4.1 Import Project

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings

### 4.2 Add Environment Variables

In Vercel project settings → Environment Variables, add:

```
DATABASE_URL = postgres://your-neon-connection-string
ADMIN_KEY = Abhinav
CLOUDINARY_CLOUD_NAME = your_cloud_name
CLOUDINARY_API_KEY = your_api_key
CLOUDINARY_API_SECRET = your_api_secret
CLOUDINARY_UPLOAD_PRESET = your_unsigned_preset_name
NEXT_PUBLIC_DEBUG = false
```

**Important:** Add these to **Production**, **Preview**, and **Development** environments.

### 4.3 Deploy

1. Click "Deploy"
2. Wait for build to complete (usually 2-3 minutes)
3. Vercel will provide a URL like `your-app.vercel.app`

## Step 5: Run Migrations in Production

After first deployment, you need to ensure database is set up:

### Option A: Using Vercel CLI (Recommended)

```powershell
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to your project
vercel link

# Run migrations
vercel env pull .env.local
npx prisma migrate deploy
```

### Option B: One-Time Setup via Local Machine

Connect locally to production database and run:

```powershell
$env:DATABASE_URL="your-production-neon-url"
npx prisma db push
npx prisma generate
npm run db:seed  # Optional: seed production data
```

## Step 6: Verify Production Deployment

Visit your Vercel URL and test:

### 6.1 Basic Functionality

- [ ] Homepage loads: `https://your-app.vercel.app`
- [ ] Products API: `https://your-app.vercel.app/api/products` returns JSON
- [ ] Product images display (Cloudinary URLs)
- [ ] Search/filters work

### 6.2 Admin Features

- [ ] Unlock admin: Visit `https://your-app.vercel.app/?admin=Abhinav`
- [ ] Admin links appear in navbar
- [ ] Products list: `/admin/products`
- [ ] Create product: `/admin/products/new`
- [ ] Upload images works (Cloudinary)
- [ ] Edit inventory: `/admin/products/[id]/edit`
- [ ] Orders list: `/admin/orders`
- [ ] Contacts list: `/admin/contacts`

### 6.3 Shopping Flow

- [ ] Add to cart works
- [ ] Cart page shows items
- [ ] Checkout form works
- [ ] Place order succeeds
- [ ] Order appears in admin/orders

### 6.4 Contact Form

- [ ] Submit contact message
- [ ] Message appears in `/admin/contacts`
- [ ] CSV export works

## Step 7: Custom Domain (Optional)

1. In Vercel dashboard → Settings → Domains
2. Add your domain (e.g., `store.example.com`)
3. Follow DNS configuration instructions
4. Vercel automatically enables HTTPS

## Troubleshooting

### Images Not Uploading

- **Issue:** Upload fails with 500 error
- **Fix:** 
  1. Verify `CLOUDINARY_UPLOAD_PRESET` is correct (no spaces)
  2. Ensure preset is set to "Unsigned"
  3. Check environment variables in Vercel
  4. Redeploy after changing env vars

### Database Connection Errors

- **Issue:** Products API returns 500
- **Fix:**
  1. Verify `DATABASE_URL` in Vercel matches Neon connection string
  2. Check Neon dashboard for connection issues
  3. Run `npx prisma db push` to ensure schema is synced

### Admin Links Not Showing

- **Issue:** Can't see admin menu
- **Fix:** Visit `/?admin=Abhinav` once to unlock admin (cookie-based)

### Build Failures

- **Issue:** Vercel build fails
- **Fix:**
  1. Check build logs in Vercel dashboard
  2. Ensure all dependencies in `package.json`
  3. Verify Prisma schema is valid: `npx prisma validate`

### Environment Variables Not Loading

- **Fix:** 
  1. In Vercel → Settings → Environment Variables
  2. Ensure variables are added to correct environment (Production/Preview/Development)
  3. Redeploy after adding/changing variables

## Production Checklist

Before going fully live, ensure:

- [ ] `ADMIN_KEY` is changed from default "Abhinav"
- [ ] `NEXT_PUBLIC_DEBUG` is set to `false`
- [ ] Database has real products (not just seed data)
- [ ] Custom domain configured (optional but recommended)
- [ ] SSL/HTTPS enabled (automatic on Vercel)
- [ ] Test checkout flow end-to-end
- [ ] Test admin product creation
- [ ] Test image uploads
- [ ] Monitor first few orders

## Maintenance

### Adding New Products

1. Unlock admin: Visit `/?admin=Abhinav`
2. Go to `/admin/products/new`
3. Fill form and upload images
4. Products appear immediately

### Updating Inventory

1. Go to `/admin/products`
2. Click "Edit" next to product
3. Update quantity and save

### Viewing Orders

1. Go to `/admin/orders`
2. Click order ID to see details
3. Orders include shipping/billing addresses

### Managing Contacts

1. Go to `/admin/contacts`
2. Filter/search messages
3. Mark as handled
4. Export to CSV

## Support

For issues:
1. Check Vercel build logs
2. Check Neon database dashboard
3. Check Cloudinary dashboard for upload issues
4. Review server logs in Vercel → Functions

## Environment Variables Reference

See `env.example` for complete list. Required variables:

- `DATABASE_URL` - Neon Postgres connection string
- `ADMIN_KEY` - Secret key to unlock admin (change in production!)
- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `CLOUDINARY_UPLOAD_PRESET` - Unsigned upload preset name

Optional:
- `NEXT_PUBLIC_BASE_URL` - Your production URL (for absolute URLs)
- `NEXT_PUBLIC_DEBUG` - Set to "true" for client-side debug logs

---

**Congratulations!** Your ecommerce store is now live! 🎉


# Amrutha NextGen Stores

Modern ecommerce storefront built with Next.js 15, Prisma, and Tailwind CSS.

## Features

- 🛍️ **Product Catalog** - Browse products with search, filters, and categories
- 🛒 **Shopping Cart** - Client-side cart with localStorage
- 💳 **Checkout** - Full checkout flow with address collection
- 📦 **Order Management** - Track orders with inventory updates
- 📸 **Image Upload** - Cloudinary integration for product images
- 👤 **Admin Panel** - Manage products, orders, and contacts
- 📧 **Contact Form** - Customer inquiries with CSV export
- 🎨 **Modern UI** - Clean, colorful design with responsive layout

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** PostgreSQL (via Prisma ORM)
- **Styling:** Tailwind CSS
- **Image Storage:** Cloudinary
- **Language:** TypeScript

## Quick Start

### Prerequisites

- Node.js LTS (install via winget: `winget install OpenJS.NodeJS.LTS`)
- PostgreSQL database (Neon recommended for free tier)

### Setup

1. **Clone and install:**
   ```powershell
   cd C:\Users\indian\Documents\Cursor\ecommerce
   npm install
   ```

2. **Configure environment:**
   ```powershell
   Copy-Item env.example .env
   # Edit .env with your credentials
   ```

3. **Initialize database:**
   ```powershell
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

4. **Start dev server:**
   ```powershell
   npm run dev
   ```

5. **Open browser:**
   - Frontend: http://localhost:3000
   - Unlock admin: http://localhost:3000/?admin=Abhinav

## API Endpoints

- `GET /api/products` - List products (supports pagination, search, filters)
- `GET /api/products?q=tee&page=1&pageSize=20&sort=newest&category=t-shirts&inStock=true`
- `GET /api/health` - Health check
- `POST /api/orders` - Place order
- `POST /api/contact` - Submit contact form
- `POST /api/uploads` - Upload images to Cloudinary
- `POST /api/admin/products` - Create product (admin)
- `PATCH /api/admin/products/[id]` - Update product inventory (admin)

## Admin Pages

After unlocking admin (visit `/?admin=Abhinav`):

- `/admin/products` - List all products
- `/admin/products/new` - Create new product
- `/admin/products/[id]/edit` - Edit product inventory
- `/admin/orders` - View all orders
- `/admin/orders/[id]` - Order details
- `/admin/contacts` - Contact messages with filters and CSV export

## Project Structure

```
app/
├── api/              # API routes
│   ├── products/      # Product listing API
│   ├── orders/       # Order placement API
│   ├── contact/      # Contact form API
│   ├── uploads/      # Image upload API
│   └── admin/        # Admin APIs
├── admin/             # Admin pages
│   ├── products/     # Product management
│   ├── orders/       # Order management
│   └── contacts/     # Contact management
├── product/           # Product detail pages
├── cart/              # Shopping cart
├── checkout/          # Checkout flow
├── contact/           # Contact page
└── components/        # React components
    ├── NavBar.tsx     # Site navigation
    └── AddToCartButton.tsx
```

## Database Schema

Key models:
- `Product` - Product information
- `ProductImage` - Product images (Cloudinary URLs)
- `Inventory` - Stock quantities
- `Category` - Product categories
- `Order` - Customer orders
- `OrderItem` - Items in orders
- `Address` - Shipping/billing addresses
- `ContactMessage` - Contact form submissions
- `Cart` / `CartItem` - Shopping carts

## Development

### Database Commands

```powershell
# Generate Prisma client
npx prisma generate

# Push schema changes
npx prisma db push

# View database (GUI)
npx prisma studio

# Run migrations
npx prisma migrate dev --name migration_name

# Seed database
npm run db:seed
```

### Environment Variables

See `env.example` for required variables:

- `DATABASE_URL` - PostgreSQL connection string
- `ADMIN_KEY` - Admin unlock key
- `CLOUDINARY_*` - Cloudinary credentials
- `NEXT_PUBLIC_DEBUG` - Enable debug logs

## Deployment

See [README-DEPLOY.md](./README-DEPLOY.md) for complete deployment guide to Vercel + Neon + Cloudinary.

Quick steps:
1. Push code to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy
5. Run migrations

## Features Overview

### Product Management
- Create/edit products via admin UI
- Upload images directly (Cloudinary)
- Manage inventory quantities
- Enable/disable products
- Category organization

### Shopping Experience
- Product search and filtering
- Category browsing
- Stock availability display
- Add to cart functionality
- Responsive product cards

### Checkout Flow
- Collect shipping/billing addresses
- Payment method selection (COD/Card)
- Order creation with inventory updates
- Order confirmation

### Admin Features
- Product CRUD operations
- Order tracking and details
- Contact message management
- CSV export functionality
- Inventory management

## Support

For deployment help, see [README-DEPLOY.md](./README-DEPLOY.md).

---

Built with ❤️ for modern ecommerce


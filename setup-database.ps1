# Ecommerce Database Setup Script
# This script sets up the database, runs migrations, and seeds sample data

Write-Host "🗄️ Setting up Ecommerce Database..." -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Gray

# Check if we're in the correct directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this script from the project root directory." -ForegroundColor Red
    exit 1
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Creating one..." -ForegroundColor Yellow
    Set-Content -Path ".env" -Value 'DATABASE_URL="file:./dev.db"'
    Write-Host "✅ Created .env file with DATABASE_URL" -ForegroundColor Green
} else {
    Write-Host "✅ .env file exists" -ForegroundColor Green
}

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
    npm install
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}

# Generate Prisma client
Write-Host "🔧 Generating Prisma client..." -ForegroundColor Blue
try {
    npx prisma generate
    Write-Host "✅ Prisma client generated successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to generate Prisma client: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Run database migrations
Write-Host "🗄️ Running database migrations..." -ForegroundColor Blue
try {
    npx prisma migrate dev --name init
    Write-Host "✅ Database migrations completed" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Migration warning (this is normal if migrations already exist)" -ForegroundColor Yellow
}

# Seed the database
Write-Host "🌱 Seeding database with sample data..." -ForegroundColor Blue
try {
    npm run db:seed
    Write-Host "✅ Database seeded successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to seed database: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Verify database setup
Write-Host "🔍 Verifying database setup..." -ForegroundColor Blue
if (Test-Path "prisma/dev.db") {
    $dbSize = (Get-Item "prisma/dev.db").Length
    Write-Host "✅ Database file exists (Size: $dbSize bytes)" -ForegroundColor Green
} else {
    Write-Host "❌ Database file not found" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "===============================================" -ForegroundColor Gray
Write-Host "🎉 Database Setup Complete!" -ForegroundColor Green
Write-Host "📊 Sample data includes:" -ForegroundColor Cyan
Write-Host "   • 3 Categories: T-Shirts, Shoes, Accessories" -ForegroundColor Gray
Write-Host "   • 3 Products: Classic Cotton Tee, Running Shoes, Leather Belt" -ForegroundColor Gray
Write-Host "   • Inventory tracking for all products" -ForegroundColor Gray
Write-Host ""
Write-Host "🚀 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Run start-dev-server.ps1 to start the development server" -ForegroundColor Gray
Write-Host "   2. Run test-api.ps1 to test the API endpoints" -ForegroundColor Gray
Write-Host "   3. Open http://localhost:3000 in your browser" -ForegroundColor Gray




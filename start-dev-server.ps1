# Ecommerce Development Server Startup Script
# This script starts the Next.js development server with proper environment setup

Write-Host "🚀 Starting Ecommerce Development Server..." -ForegroundColor Green

# Check if we're in the correct directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this script from the project root directory." -ForegroundColor Red
    exit 1
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  Warning: .env file not found. Creating one..." -ForegroundColor Yellow
    Set-Content -Path ".env" -Value 'DATABASE_URL="file:./dev.db"'
    Write-Host "✅ Created .env file with DATABASE_URL" -ForegroundColor Green
}

# Check if database exists
if (-not (Test-Path "prisma/dev.db")) {
    Write-Host "⚠️  Database not found. Running migrations and seeding..." -ForegroundColor Yellow
    
    # Generate Prisma client
    Write-Host "📦 Generating Prisma client..." -ForegroundColor Blue
    npx prisma generate
    
    # Run migrations
    Write-Host "🗄️  Running database migrations..." -ForegroundColor Blue
    npx prisma migrate dev --name init
    
    # Seed the database
    Write-Host "🌱 Seeding database with sample data..." -ForegroundColor Blue
    npm run db:seed
    
    Write-Host "✅ Database setup complete!" -ForegroundColor Green
}

# Kill any existing Node processes to avoid port conflicts
Write-Host "🔄 Stopping any existing Node.js processes..." -ForegroundColor Blue
try {
    taskkill /F /IM node.exe 2>$null
    Write-Host "✅ Stopped existing processes" -ForegroundColor Green
} catch {
    Write-Host "ℹ️  No existing processes to stop" -ForegroundColor Gray
}

# Start the development server
Write-Host "🚀 Starting Next.js development server..." -ForegroundColor Blue
Write-Host "📍 Server will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "📍 Network access: http://192.168.1.6:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "===============================================" -ForegroundColor Gray

# Start the server
npm run dev





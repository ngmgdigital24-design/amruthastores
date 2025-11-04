# Ecommerce API Testing Script
# This script tests the API endpoints and verifies the backend is working

Write-Host "🧪 Testing Ecommerce API Endpoints..." -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Gray

# Check if server is running
Write-Host "🔍 Checking if development server is running..." -ForegroundColor Blue
$serverRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        $serverRunning = $true
        Write-Host "✅ Development server is running on port 3000" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Development server is not running on port 3000" -ForegroundColor Red
    Write-Host "💡 Please run start-dev-server.ps1 first" -ForegroundColor Yellow
    exit 1
}

# Test API endpoints
Write-Host ""
Write-Host "📡 Testing API Endpoints..." -ForegroundColor Blue

# Test 1: Health Check
Write-Host "1️⃣ Testing health endpoint..." -ForegroundColor Cyan
try {
    $healthResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -Method GET
    if ($healthResponse.StatusCode -eq 200) {
        Write-Host "   ✅ Health endpoint working" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Health endpoint returned status: $($healthResponse.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ Health endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Products API
Write-Host "2️⃣ Testing products endpoint..." -ForegroundColor Cyan
try {
    $productsResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/products" -Method GET
    if ($productsResponse.StatusCode -eq 200) {
        $productsData = $productsResponse.Content | ConvertFrom-Json
        Write-Host "   ✅ Products endpoint working" -ForegroundColor Green
        Write-Host "   📊 Found $($productsData.total) products" -ForegroundColor Gray
        Write-Host "   📦 Products:" -ForegroundColor Gray
        foreach ($product in $productsData.items) {
            Write-Host "      • $($product.title) - ₹$([math]::Round($product.priceCents/100, 2))" -ForegroundColor Gray
        }
    } else {
        Write-Host "   ⚠️  Products endpoint returned status: $($productsResponse.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ Products endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Products with query parameters
Write-Host "3️⃣ Testing products with query parameters..." -ForegroundColor Cyan
try {
    $queryResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/products?page=1&pageSize=5&sort=newest" -Method GET
    if ($queryResponse.StatusCode -eq 200) {
        $queryData = $queryResponse.Content | ConvertFrom-Json
        Write-Host "   ✅ Query parameters working" -ForegroundColor Green
        Write-Host "   📊 Page $($queryData.page) of $([math]::Ceiling($queryData.total/$queryData.pageSize))" -ForegroundColor Gray
    } else {
        Write-Host "   ⚠️  Query parameters returned status: $($queryResponse.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ Query parameters failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Frontend page
Write-Host "4️⃣ Testing frontend page..." -ForegroundColor Cyan
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "   ✅ Frontend page loading successfully" -ForegroundColor Green
        if ($frontendResponse.Content -like "*Welcome to Ecommerce*") {
            Write-Host "   ✅ Ecommerce content found" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  Ecommerce content not found" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   ⚠️  Frontend page returned status: $($frontendResponse.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ Frontend page failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "===============================================" -ForegroundColor Gray
Write-Host "🎉 API Testing Complete!" -ForegroundColor Green
Write-Host "🌐 Open http://localhost:3000 in your browser to view the ecommerce site" -ForegroundColor Cyan
Write-Host "📚 API Documentation:" -ForegroundColor Cyan
Write-Host "   • GET /api/products - List products with pagination and filtering" -ForegroundColor Gray
Write-Host "   • GET /api/health - Health check endpoint" -ForegroundColor Gray





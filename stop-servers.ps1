# Ecommerce Server Stop Script
# This script stops all running Node.js processes and development servers

Write-Host "🛑 Stopping Ecommerce Development Servers..." -ForegroundColor Red
Write-Host "===============================================" -ForegroundColor Gray

# Check for running Node.js processes
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue

if ($nodeProcesses) {
    Write-Host "🔍 Found $($nodeProcesses.Count) Node.js process(es) running:" -ForegroundColor Yellow
    foreach ($process in $nodeProcesses) {
        Write-Host "   • PID: $($process.Id) - $($process.ProcessName)" -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "🛑 Stopping all Node.js processes..." -ForegroundColor Blue
    try {
        taskkill /F /IM node.exe
        Write-Host "✅ All Node.js processes stopped successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to stop Node.js processes: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "ℹ️  No Node.js processes found running" -ForegroundColor Gray
}

# Check if port 3000 is still in use
Write-Host ""
Write-Host "🔍 Checking if port 3000 is still in use..." -ForegroundColor Blue
try {
    $portCheck = netstat -ano | findstr ":3000"
    if ($portCheck) {
        Write-Host "⚠️  Port 3000 is still in use:" -ForegroundColor Yellow
        Write-Host $portCheck -ForegroundColor Gray
        Write-Host "💡 You may need to manually stop the process using the PID above" -ForegroundColor Yellow
    } else {
        Write-Host "✅ Port 3000 is now free" -ForegroundColor Green
    }
} catch {
    Write-Host "ℹ️  Could not check port status" -ForegroundColor Gray
}

Write-Host ""
Write-Host "===============================================" -ForegroundColor Gray
Write-Host "🏁 Server Stop Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 To start servers again:" -ForegroundColor Cyan
Write-Host "   • Run start-dev-server.ps1" -ForegroundColor Gray
Write-Host "   • Or run run-all-tests.ps1 for complete setup" -ForegroundColor Gray





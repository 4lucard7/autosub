# AutoSub Backend Startup Script
# Starts MongoDB service then launches the FastAPI server

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AutoSub Backend Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Step 1: Ensure MongoDB is running
Write-Host "`n[1/2] Checking MongoDB..." -ForegroundColor Yellow
$mongoService = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
if ($mongoService -and $mongoService.Status -eq "Running") {
    Write-Host "  MongoDB is already running." -ForegroundColor Green
} elseif ($mongoService) {
    Write-Host "  MongoDB is stopped. Starting..." -ForegroundColor Yellow
    Start-Process powershell -Verb RunAs -ArgumentList "-Command", "Start-Service -Name 'MongoDB'" -Wait
    Start-Sleep -Seconds 2
    $mongoService = Get-Service -Name "MongoDB"
    if ($mongoService.Status -eq "Running") {
        Write-Host "  MongoDB started successfully." -ForegroundColor Green
    } else {
        Write-Host "  ERROR: Failed to start MongoDB." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "  ERROR: MongoDB service not found. Please install MongoDB." -ForegroundColor Red
    exit 1
}

# Step 2: Start FastAPI backend
Write-Host "`n[2/2] Starting FastAPI server on http://127.0.0.1:8000 ..." -ForegroundColor Yellow
Write-Host "  Press Ctrl+C to stop.`n" -ForegroundColor Gray

Set-Location "$PSScriptRoot\BackEnd"
& .\venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload

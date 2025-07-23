# PowerShell script to rename project
Write-Host "🔄 Renaming project folder..." -ForegroundColor Yellow

$oldPath = "Indore-Route-Pathfinder"
$newPath = "Bhubaneswar-Store-Locator"

if (Test-Path $oldPath) {
    try {
        Rename-Item -Path $oldPath -NewName $newPath -ErrorAction Stop
        Write-Host "✅ Successfully renamed to 'Bhubaneswar-Store-Locator'" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error renaming folder: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "💡 Try manually renaming the folder from Windows Explorer" -ForegroundColor Cyan
    }
} else {
    Write-Host "❌ Folder 'Indore-Route-Pathfinder' not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Project transformation completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. cd Bhubaneswar-Store-Locator" -ForegroundColor White
Write-Host "2. cd backend && npm install" -ForegroundColor White
Write-Host "3. cd ../frontend && npm install" -ForegroundColor White
Write-Host "4. Follow SETUP.md for detailed instructions" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to continue..."

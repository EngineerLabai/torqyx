# Prepare a local .env.local from .env.local.example
# This script does NOT write any secrets for you; it copies the example and opens the file for manual editing.
# Run locally when you're ready to paste new rotated secrets.

$example = Join-Path $PSScriptRoot '..\.env.local.example'
$target = Join-Path $PSScriptRoot '..\.env.local'

if (-not (Test-Path $example)) {
    Write-Error "Example file not found: $example"
    exit 1
}

if (Test-Path $target) {
    Write-Host ".env.local already exists at $target. Opening for edit..."
} else {
    Copy-Item -Path $example -Destination $target -Force
    Write-Host "Copied .env.local.example -> .env.local. Open the file and paste rotated secrets."
}

# Open in default editor (uses notepad on Windows)
Start-Process notepad.exe $target

Write-Host "Reminder: do NOT commit .env.local to git. Ensure .gitignore contains .env* and .vercel."
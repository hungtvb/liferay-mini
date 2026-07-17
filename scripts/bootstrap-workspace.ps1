$ErrorActionPreference = "Stop"

$RootDir = Resolve-Path (Join-Path $PSScriptRoot "..")
$WrapperJar = Join-Path $RootDir "gradle\wrapper\gradle-wrapper.jar"
$TempDir = Join-Path $RootDir "bootstrap-workspace-tmp"
$Product = "dxp-2026.q1.1-lts"

if (Test-Path $WrapperJar) {
    Write-Host "Gradle Wrapper is already initialized: $WrapperJar"
    exit 0
}

if (-not (Get-Command blade -ErrorAction SilentlyContinue)) {
    throw "Blade CLI is required. Install Blade CLI, run 'blade update', and retry."
}

if (Test-Path $TempDir) {
    Remove-Item $TempDir -Recurse -Force
}

New-Item $TempDir -ItemType Directory | Out-Null
Push-Location $TempDir

try {
    blade init -v $Product generated-workspace
}
finally {
    Pop-Location
}

$GeneratedWorkspace = Join-Path $TempDir "generated-workspace"
$WrapperDirectory = Join-Path $RootDir "gradle\wrapper"

New-Item $WrapperDirectory -ItemType Directory -Force | Out-Null
Copy-Item (Join-Path $GeneratedWorkspace "gradle\wrapper\gradle-wrapper.jar") $WrapperJar
Copy-Item (Join-Path $GeneratedWorkspace "gradlew") (Join-Path $RootDir "gradlew")
Copy-Item (Join-Path $GeneratedWorkspace "gradlew.bat") (Join-Path $RootDir "gradlew.bat")

Remove-Item $TempDir -Recurse -Force

Write-Host "Workspace wrapper initialized successfully."
Write-Host "Next command: .\gradlew.bat initBundle"

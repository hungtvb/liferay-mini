param(
    [string]$OutputPath = ""
)

$ErrorActionPreference = "Stop"

$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$workspaceRoot = Resolve-Path (Join-Path $scriptDirectory "..\..\..")
$projectDirectory = Join-Path $workspaceRoot "client-extensions\nexcent-landing-elements"
$generatedPackage = Join-Path $projectDirectory "build\fragments\collections-nexcent-components.zip"

Push-Location $projectDirectory

try {
    npm run package:fragments
}
finally {
    Pop-Location
}

if (-not (Test-Path $generatedPackage)) {
    throw "Fragment package was not generated: $generatedPackage"
}

if (-not [string]::IsNullOrWhiteSpace($OutputPath)) {
    if (-not [System.IO.Path]::IsPathRooted($OutputPath)) {
        $OutputPath = Join-Path (Get-Location) $OutputPath
    }

    $outputDirectory = Split-Path -Parent $OutputPath

    if (-not (Test-Path $outputDirectory)) {
        New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null
    }

    Copy-Item $generatedPackage $OutputPath -Force
    Write-Host "Copied Fragment Set package to: $OutputPath"
}
else {
    Write-Host "Created Fragment Set package: $generatedPackage"
}

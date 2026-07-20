param(
    [string]$OutputPath = ""
)

$ErrorActionPreference = "Stop"

$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$fragmentSetDirectory = Resolve-Path (Join-Path $scriptDirectory "..\fragments")

if ([string]::IsNullOrWhiteSpace($OutputPath)) {
    $OutputPath = Join-Path $fragmentSetDirectory "nexcent-training-fragments.zip"
}
elseif (-not [System.IO.Path]::IsPathRooted($OutputPath)) {
    $OutputPath = Join-Path (Get-Location) $OutputPath
}

$collectionFile = Join-Path $fragmentSetDirectory "collection.json"

if (-not (Test-Path $collectionFile)) {
    throw "Missing Fragment Set descriptor: $collectionFile"
}

Get-ChildItem $fragmentSetDirectory -Directory | ForEach-Object {
    $fragmentDirectory = $_.FullName
    $fragmentJsonPath = Join-Path $fragmentDirectory "fragment.json"

    if (-not (Test-Path $fragmentJsonPath)) {
        throw "Missing fragment.json: $fragmentJsonPath"
    }

    $fragmentDefinition = Get-Content $fragmentJsonPath -Raw | ConvertFrom-Json

    @("htmlPath", "cssPath", "jsPath", "configurationPath") | ForEach-Object {
        $propertyName = $_
        $property = $fragmentDefinition.PSObject.Properties[$propertyName]

        if ($null -ne $property -and -not [string]::IsNullOrWhiteSpace([string]$property.Value)) {
            $referencedPath = Join-Path $fragmentDirectory ([string]$property.Value)

            if (-not (Test-Path $referencedPath)) {
                throw "Fragment '$($fragmentDefinition.name)' references missing $propertyName file: $referencedPath"
            }
        }
    }
}

$stagingDirectory = Join-Path ([System.IO.Path]::GetTempPath()) ("nexcent-fragments-" + [guid]::NewGuid().ToString("N"))

try {
    New-Item -ItemType Directory -Path $stagingDirectory | Out-Null

    Copy-Item $collectionFile $stagingDirectory

    Get-ChildItem $fragmentSetDirectory -Directory | ForEach-Object {
        Copy-Item $_.FullName $stagingDirectory -Recurse
    }

    $outputDirectory = Split-Path -Parent $OutputPath

    if (-not (Test-Path $outputDirectory)) {
        New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null
    }

    Remove-Item $OutputPath -Force -ErrorAction SilentlyContinue
    Compress-Archive -Path (Join-Path $stagingDirectory "*") -DestinationPath $OutputPath -CompressionLevel Optimal

    Write-Host "Created Fragment Set package: $OutputPath"
    Write-Host "ZIP root contains collection.json and validated fragment folders."
}
finally {
    Remove-Item $stagingDirectory -Recurse -Force -ErrorAction SilentlyContinue
}

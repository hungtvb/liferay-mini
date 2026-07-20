param(
    [string]$OutputPath = ""
)

$ErrorActionPreference = "Stop"

$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$fragmentSourceDirectory = Resolve-Path (Join-Path $scriptDirectory "..\fragments")
$collectionKey = "nexcent-components"

if ([string]::IsNullOrWhiteSpace($OutputPath)) {
    $OutputPath = Join-Path $fragmentSourceDirectory "collections-nexcent-components.zip"
}
elseif (-not [System.IO.Path]::IsPathRooted($OutputPath)) {
    $OutputPath = Join-Path (Get-Location) $OutputPath
}

$collectionFile = Join-Path $fragmentSourceDirectory "collection.json"

if (-not (Test-Path $collectionFile)) {
    throw "Missing Fragment Set descriptor: $collectionFile"
}

$fragmentDirectories = Get-ChildItem $fragmentSourceDirectory -Directory

if ($fragmentDirectories.Count -eq 0) {
    throw "No fragment directories found in: $fragmentSourceDirectory"
}

$fragmentDirectories | ForEach-Object {
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

$stagingDirectory = Join-Path ([System.IO.Path]::GetTempPath()) ("nexcent-components-" + [guid]::NewGuid().ToString("N"))
$collectionDirectory = Join-Path $stagingDirectory $collectionKey
$fragmentsDirectory = Join-Path $collectionDirectory "fragments"

try {
    New-Item -ItemType Directory -Path $fragmentsDirectory -Force | Out-Null
    Copy-Item $collectionFile $collectionDirectory

    $fragmentDirectories | ForEach-Object {
        Copy-Item $_.FullName $fragmentsDirectory -Recurse
    }

    $outputDirectory = Split-Path -Parent $OutputPath

    if (-not (Test-Path $outputDirectory)) {
        New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null
    }

    Remove-Item $OutputPath -Force -ErrorAction SilentlyContinue
    Compress-Archive -Path $collectionDirectory -DestinationPath $OutputPath -CompressionLevel Optimal

    Write-Host "Created Fragment Set package: $OutputPath"
    Write-Host "ZIP structure: $collectionKey/collection.json and $collectionKey/fragments/<fragment>/..."
}
finally {
    Remove-Item $stagingDirectory -Recurse -Force -ErrorAction SilentlyContinue
}

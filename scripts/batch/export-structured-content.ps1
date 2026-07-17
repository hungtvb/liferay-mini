$ErrorActionPreference = "Stop"

$LiferayHost = if ($env:LIFERAY_HOST) { $env:LIFERAY_HOST } else { "http://localhost:8080" }
$LiferayUser = if ($env:LIFERAY_USER) { $env:LIFERAY_USER } else { "test@liferay.com" }
$LiferayPassword = if ($env:LIFERAY_PASSWORD) { $env:LIFERAY_PASSWORD } else { "test" }
$ErcPrefix = if ($env:LIFERAY_ERC_PREFIX) { $env:LIFERAY_ERC_PREFIX } else { "NXC-" }
$SiteId = $env:LIFERAY_SITE_ID

if (-not $SiteId) {
    throw "Set LIFERAY_SITE_ID to the current site ID or site ERC."
}

foreach ($command in @("curl.exe", "node")) {
    if (-not (Get-Command $command -ErrorAction SilentlyContinue)) {
        throw "Missing required command: $command"
    }
}

$ScriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepositoryRoot = Resolve-Path (Join-Path $ScriptDirectory "../..")
$OutputPath = Join-Path $RepositoryRoot "client-extensions/nexcent-content-batch/batch/10-structured-content.batch-engine-data.json"
$WorkDirectory = Join-Path ([System.IO.Path]::GetTempPath()) ("nexcent-batch-" + [guid]::NewGuid())
$ClassName = "com.liferay.headless.delivery.dto.v1_0.StructuredContent"
$Credential = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${LiferayUser}:${LiferayPassword}"))

New-Item -ItemType Directory -Path $WorkDirectory | Out-Null

try {
    Write-Host "Creating Structured Content export task for site $SiteId..."

    $TaskResponse = curl.exe --fail --silent --show-error `
        "${LiferayHost}/o/headless-batch-engine/v1.0/export-task/${ClassName}/jsont?siteId=${SiteId}" `
        --header "Authorization: Basic $Credential" `
        --header "Content-Type: application/json" `
        --request POST | ConvertFrom-Json

    $TaskId = $TaskResponse.id

    if (-not $TaskId) {
        throw "Unable to read export task ID."
    }

    $Status = $null

    for ($attempt = 1; $attempt -le 60; $attempt++) {
        $TaskResponse = curl.exe --fail --silent --show-error `
            "${LiferayHost}/o/headless-batch-engine/v1.0/export-task/${TaskId}" `
            --header "Authorization: Basic $Credential" | ConvertFrom-Json
        $Status = $TaskResponse.executeStatus

        if ($Status -eq "COMPLETED") {
            break
        }

        if ($Status -eq "FAILED") {
            throw $TaskResponse.errorMessage
        }

        Write-Host "Export status: $Status"
        Start-Sleep -Seconds 2
    }

    if ($Status -ne "COMPLETED") {
        throw "Export task did not complete within 120 seconds."
    }

    $ZipPath = Join-Path $WorkDirectory "export.zip"
    $ExtractPath = Join-Path $WorkDirectory "export"

    curl.exe --fail --silent --show-error `
        "${LiferayHost}/o/headless-batch-engine/v1.0/export-task/${TaskId}/content" `
        --header "Authorization: Basic $Credential" `
        --output $ZipPath

    Expand-Archive -Path $ZipPath -DestinationPath $ExtractPath
    $ExportedFile = Get-ChildItem -Path $ExtractPath -File -Recurse | Select-Object -First 1

    if (-not $ExportedFile) {
        throw "The export ZIP did not contain a payload file."
    }

    node (Join-Path $ScriptDirectory "prepare-structured-content-export.mjs") `
        $ExportedFile.FullName `
        $OutputPath `
        $ErcPrefix

    Write-Host "Batch payload ready: $OutputPath"
    Write-Host "Basic authentication is used only for this local lab script."
}
finally {
    Remove-Item -Path $WorkDirectory -Force -Recurse -ErrorAction SilentlyContinue
}

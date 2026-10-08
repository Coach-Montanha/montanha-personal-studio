<#
.SYNOPSIS
    Zero-bloat Android asset generation and synchronization script for Montanha Personal Studio.

.DESCRIPTION
    Downscales public/icon-512.png into Android mipmap density buckets (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi)
    and synchronizes the splash screen drawable using native Windows .NET System.Drawing.
    Requires zero npm dependencies (no @capacitor/assets, sharp, or libvips).

.PARAMETER SourceIcon
    Path to the source 512x512 PNG icon. Defaults to '<ProjectRoot>/public/icon-512.png'.

.PARAMETER AndroidResDir
    Path to the Android resources directory. Defaults to '<ProjectRoot>/android/app/src/main/res'.

.PARAMETER SplashSource
    Path to the source splash image. Defaults to SourceIcon.

.PARAMETER Force
    Overwrites existing assets without confirmation.

.EXAMPLE
    pwsh scripts/sync-android-assets.ps1
    powershell -ExecutionPolicy Bypass -File scripts/sync-android-assets.ps1
#>

[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [string]$SourceIcon,

    [Parameter(Position = 1)]
    [string]$AndroidResDir,

    [Parameter(Position = 2)]
    [string]$SplashSource,

    [switch]$Force
)

$ErrorActionPreference = "Stop"

# -----------------------------------------------------------------------------
# 1. Path Resolution & Environment Detection
# -----------------------------------------------------------------------------
$scriptDir = $PSScriptRoot
if (-not $scriptDir) {
    $scriptDir = (Get-Location).Path
}

# Resolve project root (parent directory of scripts/, or current directory if run from root)
$projectRoot = (Resolve-Path (Join-Path $scriptDir "..")).Path
if (-not (Test-Path (Join-Path $projectRoot "public\icon-512.png")) -and (Test-Path (Join-Path (Get-Location).Path "public\icon-512.png"))) {
    $projectRoot = (Get-Location).Path
}

if (-not $SourceIcon) {
    $SourceIcon = Join-Path $projectRoot "public\icon-512.png"
}

if (-not (Test-Path $SourceIcon)) {
    Write-Error "[ASSET SYNC ERROR] Source icon does not exist at: $SourceIcon"
    exit 1
}

if (-not $AndroidResDir) {
    $AndroidResDir = Join-Path $projectRoot "android\app\src\main\res"
}

if (-not $SplashSource) {
    $SplashSource = $SourceIcon
}

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "  Montanha Personal Studio - Zero-Bloat Android Asset Sync       " -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host " Source Icon    : $SourceIcon" -ForegroundColor Gray
Write-Host " Android Res Dir: $AndroidResDir" -ForegroundColor Gray
Write-Host " Splash Source  : $SplashSource" -ForegroundColor Gray
Write-Host " Engine         : Windows Native .NET System.Drawing (Zero NPM)" -ForegroundColor Gray
Write-Host "-----------------------------------------------------------------" -ForegroundColor Gray

# -----------------------------------------------------------------------------
# 2. Load .NET System.Drawing Assembly
# -----------------------------------------------------------------------------
try {
    Add-Type -AssemblyName System.Drawing
}
catch {
    Write-Error "[ASSET SYNC ERROR] Failed to load System.Drawing assembly: $_"
    exit 1
}

# -----------------------------------------------------------------------------
# 3. Mipmap Density Specifications
# -----------------------------------------------------------------------------
$mipmapBuckets = @(
    @{ Density = "mdpi";    Scale = "1.0x"; Size = 48 },
    @{ Density = "hdpi";    Scale = "1.5x"; Size = 72 },
    @{ Density = "xhdpi";   Scale = "2.0x"; Size = 96 },
    @{ Density = "xxhdpi";  Scale = "3.0x"; Size = 144 },
    @{ Density = "xxxhdpi"; Scale = "4.0x"; Size = 192 }
)

$targetIconNames = @(
    "ic_launcher.png",
    "ic_launcher_round.png",
    "ic_launcher_foreground.png"
)

# -----------------------------------------------------------------------------
# 4. High-Quality Bicubic Downscaling Function
# -----------------------------------------------------------------------------
function New-DownsampledIcon {
    param(
        [System.Drawing.Image]$SourceImage,
        [int]$TargetSize,
        [string]$DestinationPath,
        [switch]$IsRound
    )

    $destDir = [System.IO.Path]::GetDirectoryName($DestinationPath)
    if (-not (Test-Path $destDir)) {
        $null = New-Item -ItemType Directory -Path $destDir -Force
    }

    # Format32bppArgb guarantees alpha transparency preservation
    $targetBmp = [System.Drawing.Bitmap]::new($TargetSize, $TargetSize, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($targetBmp)

    try {
        # Configure maximum-quality bicubic downsampling
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceOver
        $graphics.Clear([System.Drawing.Color]::Transparent)

        if ($IsRound) {
            $clipPath = [System.Drawing.Drawing2D.GraphicsPath]::new()
            try {
                $clipPath.AddEllipse(0, 0, $TargetSize, $TargetSize)
                $graphics.SetClip($clipPath)
                $graphics.DrawImage($SourceImage, 0, 0, $TargetSize, $TargetSize)
            }
            finally {
                $clipPath.Dispose()
            }
        }
        else {
            $graphics.DrawImage($SourceImage, 0, 0, $TargetSize, $TargetSize)
        }

        # Save cleanly as PNG
        $targetBmp.Save($DestinationPath, [System.Drawing.Imaging.ImageFormat]::Png)
    }
    finally {
        $graphics.Dispose()
        $targetBmp.Dispose()
    }
}

# -----------------------------------------------------------------------------
# 5. Asset Generation Pipeline Execution
# -----------------------------------------------------------------------------
$sw = [System.Diagnostics.Stopwatch]::StartNew()
$generatedFiles = @()

# Read source bytes into MemoryStream to avoid lingering file locks on public/icon-512.png
$sourceBytes = [System.IO.File]::ReadAllBytes($SourceIcon)
$sourceStream = [System.IO.MemoryStream]::new($sourceBytes)

try {
    $sourceBitmap = [System.Drawing.Bitmap]::new($sourceStream)

    try {
        Write-Host " Source Image Dimensions: $($sourceBitmap.Width)x$($sourceBitmap.Height)" -ForegroundColor Green

        # Generate mipmaps across all 5 densities
        foreach ($bucket in $mipmapBuckets) {
            $bucketDir = Join-Path $AndroidResDir ("mipmap-" + $bucket.Density)

            # 1. ic_launcher.png (Square / Canonical launcher icon)
            $launcherPath = Join-Path $bucketDir "ic_launcher.png"
            New-DownsampledIcon -SourceImage $sourceBitmap -TargetSize $bucket.Size -DestinationPath $launcherPath
            $generatedFiles += [PSCustomObject]@{
                Bucket = "mipmap-$($bucket.Density)"
                Icon   = "ic_launcher.png"
                Size   = "$($bucket.Size)x$($bucket.Size)"
                Bytes  = (Get-Item $launcherPath).Length
            }

            # 2. ic_launcher_round.png (Circular clipped launcher icon)
            $roundPath = Join-Path $bucketDir "ic_launcher_round.png"
            New-DownsampledIcon -SourceImage $sourceBitmap -TargetSize $bucket.Size -DestinationPath $roundPath -IsRound
            $generatedFiles += [PSCustomObject]@{
                Bucket = "mipmap-$($bucket.Density)"
                Icon   = "ic_launcher_round.png"
                Size   = "$($bucket.Size)x$($bucket.Size)"
                Bytes  = (Get-Item $roundPath).Length
            }

            # 3. ic_launcher_foreground.png (Adaptive icon foreground layer)
            $fgPath = Join-Path $bucketDir "ic_launcher_foreground.png"
            New-DownsampledIcon -SourceImage $sourceBitmap -TargetSize $bucket.Size -DestinationPath $fgPath
            $generatedFiles += [PSCustomObject]@{
                Bucket = "mipmap-$($bucket.Density)"
                Icon   = "ic_launcher_foreground.png"
                Size   = "$($bucket.Size)x$($bucket.Size)"
                Bytes  = (Get-Item $fgPath).Length
            }
        }
    }
    finally {
        $sourceBitmap.Dispose()
    }
}
finally {
    $sourceStream.Dispose()
}

# -----------------------------------------------------------------------------
# 6. Splash Screen Synchronization
# -----------------------------------------------------------------------------
$drawableDir = Join-Path $AndroidResDir "drawable"
if (-not (Test-Path $drawableDir)) {
    $null = New-Item -ItemType Directory -Path $drawableDir -Force
}

$splashTarget = Join-Path $drawableDir "splash.png"
Copy-Item -Path $SplashSource -Destination $splashTarget -Force
$generatedFiles += [PSCustomObject]@{
    Bucket = "drawable"
    Icon   = "splash.png"
    Size   = "512x512 (source)"
    Bytes  = (Get-Item $splashTarget).Length
}

$sw.Stop()

# -----------------------------------------------------------------------------
# 7. Verification & Summary Output
# -----------------------------------------------------------------------------
Write-Host ""
Write-Host "Generated Assets:" -ForegroundColor Green
$generatedFiles | Format-Table -Property Bucket, Icon, Size, Bytes -AutoSize

Write-Host "-----------------------------------------------------------------" -ForegroundColor Gray
Write-Host " Successfully synced $($generatedFiles.Count) Android assets in $($sw.ElapsedMilliseconds) ms!" -ForegroundColor Green
Write-Host " NPM Dependencies: 0 (Ponytail Minimalism Compliant)" -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Cyan

exit 0

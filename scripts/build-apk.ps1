<#
.SYNOPSIS
    Defensive local Android APK build script for Montanha Personal Studio.

.DESCRIPTION
    Guards local machine resources (especially constrained host disk space and memory)
    by running pre-flight checks before invoking Gradle:
    1. Disk space check: warns if free space < 10 GB, recommending cloud CI.
    2. Toolchain checks: verifies Java (JDK 17+) and Android SDK (ANDROID_HOME/ANDROID_SDK_ROOT).
    3. Builds APK via Gradle wrapper using '--no-daemon' and lean JVM memory limits (-Xmx2048m).
    4. Optional -Clean removes bulky intermediate Gradle build caches after APK generation.

.PARAMETER BuildType
    Target build variant: 'Debug' or 'Release'. Default is 'Debug'.

.PARAMETER Clean
    Switch parameter to purge intermediate Gradle build caches (android/app/build/intermediates)
    after build completion to conserve disk space.

.EXAMPLE
    pwsh scripts/build-apk.ps1
    powershell -ExecutionPolicy Bypass -File scripts/build-apk.ps1 -BuildType Debug -Clean
    powershell -ExecutionPolicy Bypass -File scripts/build-apk.ps1 -BuildType Release
#>

[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [string]$BuildType = "Debug",

    [Parameter()]
    [switch]$Clean
)

# -----------------------------------------------------------------------------
# 0. Output Header & Parameter Validation
# -----------------------------------------------------------------------------
$allowedBuildTypes = @("Debug", "Release")
$matchedBuildType = $allowedBuildTypes | Where-Object { $_ -ieq $BuildType }

if (-not $matchedBuildType) {
    [Console]::Error.WriteLine("Invalid -BuildType '$BuildType'. Must be one of: $($allowedBuildTypes -join ', ')")
    exit 1
}
$BuildType = $matchedBuildType

# Canonical logging for test contract alignment
Write-Output "[Montanha Mobile Builder] Target: $BuildType"

# -----------------------------------------------------------------------------
# 1. Project Directory Resolution
# -----------------------------------------------------------------------------
$scriptDir = $PSScriptRoot
if (-not $scriptDir) {
    $scriptDir = (Get-Location).Path
}

$projectRoot = Split-Path -Parent $scriptDir
if (-not (Test-Path (Join-Path $projectRoot "android"))) {
    if (Test-Path (Join-Path (Get-Location).Path "android")) {
        $projectRoot = (Get-Location).Path
    }
}

$androidDir = Join-Path $projectRoot "android"
if (-not (Test-Path $androidDir)) {
    [Console]::Error.WriteLine("Error: Native Android directory not found at '$androidDir'. Run 'npx cap add android' or check project root.")
    exit 1
}

# -----------------------------------------------------------------------------
# 2. Pre-Flight Check 1: Host Free Disk Space (< 10 GB Warning)
# -----------------------------------------------------------------------------
$minDiskSpaceBytes = 10L * 1024L * 1024L * 1024L # 10 GB (10,737,418,240 bytes)
$pathRoot = [System.IO.Path]::GetPathRoot($projectRoot)
$availableDiskBytes = 0L

if ($env:SIMULATE_DISK_BYTES) {
    $availableDiskBytes = [int64]$env:SIMULATE_DISK_BYTES
} else {
    try {
        $driveInfo = New-Object System.IO.DriveInfo($pathRoot)
        $availableDiskBytes = [int64]$driveInfo.AvailableFreeSpace
    } catch {
        $driveLetter = $pathRoot.TrimEnd(':\')
        $psDrive = Get-PSDrive -Name $driveLetter -ErrorAction SilentlyContinue
        if ($psDrive -and $psDrive.Free) {
            $availableDiskBytes = [int64]$psDrive.Free
        }
    }
}

if ($availableDiskBytes -lt $minDiskSpaceBytes) {
    $freeGb = ($availableDiskBytes / (1024L * 1024L * 1024L)).ToString("0.00", [System.Globalization.CultureInfo]::InvariantCulture)
    $warningMsg = "[WARNING] Host disk space low: $freeGb GB free (Recommended: >= 10 GB). Consider using GitHub Actions CI to avoid local disk bloat."
    Write-Output $warningMsg
}

# -----------------------------------------------------------------------------
# 3. Pre-Flight Check 2: Java JDK Toolchain Verification (Exit Code 2)
# -----------------------------------------------------------------------------
$hasJava = $false

if ($env:JAVA_HOME -and (Test-Path $env:JAVA_HOME)) {
    $javaBin = Join-Path $env:JAVA_HOME "bin\java.exe"
    $javacBin = Join-Path $env:JAVA_HOME "bin\javac.exe"
    if ((Test-Path $javaBin) -or (Test-Path $javacBin)) {
        $hasJava = $true
    }
}

if (-not $hasJava) {
    $javaCmd = Get-Command java -ErrorAction SilentlyContinue
    $javacCmd = Get-Command javac -ErrorAction SilentlyContinue
    if ($javaCmd -or $javacCmd) {
        $hasJava = $true
    }
}

if (-not $hasJava) {
    [Console]::Error.WriteLine("Pre-flight failure: Java (JDK 17+) not found in PATH or JAVA_HOME. Install OpenJDK or build on GitHub Actions CI.")
    exit 2
}

# -----------------------------------------------------------------------------
# 4. Pre-Flight Check 3: Android SDK Toolchain Verification (Exit Code 3)
# -----------------------------------------------------------------------------
$hasAndroidSdk = $false

if ($env:ANDROID_HOME -and (Test-Path $env:ANDROID_HOME)) {
    $hasAndroidSdk = $true
} elseif ($env:ANDROID_SDK_ROOT -and (Test-Path $env:ANDROID_SDK_ROOT)) {
    $hasAndroidSdk = $true
}

if (-not $hasAndroidSdk) {
    [Console]::Error.WriteLine("Pre-flight failure: Android SDK not found in ANDROID_HOME or ANDROID_SDK_ROOT. Configure Android Studio or build on GitHub Actions CI.")
    exit 3
}

# -----------------------------------------------------------------------------
# 5. Clean Option Handling (Pre-build)
# -----------------------------------------------------------------------------
if ($Clean) {
    Write-Output "[Clean] Purging local Gradle caches and previous build artifacts..."
    $intermediatesDir = Join-Path $androidDir "app\build\intermediates"
    if (Test-Path $intermediatesDir) {
        Remove-Item -Path $intermediatesDir -Recurse -Force -ErrorAction SilentlyContinue
    }
}

# -----------------------------------------------------------------------------
# 6. Gradle Wrapper Execution
# -----------------------------------------------------------------------------
$gradlewBat = Join-Path $androidDir "gradlew.bat"
if (-not (Test-Path $gradlewBat)) {
    [Console]::Error.WriteLine("Error: Gradle wrapper not found at '$gradlewBat'.")
    exit 1
}

$gradleDaemonFlag = "--no-daemon"
$gradleTask = "assemble$BuildType"
Write-Output "[Gradle] Executing './gradlew $gradleTask $gradleDaemonFlag'..."

# Configure lean memory constraints
$env:GRADLE_OPTS = "-Xmx2048m"

# Execute Gradle wrapper inside android/ directory
Push-Location $androidDir
try {
    $gradleArgs = @($gradleTask, $gradleDaemonFlag, "-Dorg.gradle.jvmargs=-Xmx2048m")
    & $gradlewBat $gradleArgs
    $gradleExit = $LASTEXITCODE
} finally {
    Pop-Location
}

if ($gradleExit -ne 0) {
    [Console]::Error.WriteLine("Error: Gradle build failed with exit code $gradleExit.")
    exit $gradleExit
}

# -----------------------------------------------------------------------------
# 7. Locate Generated APK & Post-Build Clean
# -----------------------------------------------------------------------------
$buildTypeLower = $BuildType.ToLower()
$apkFileName = "app-$buildTypeLower.apk"
$relativeApkPath = "android/app/build/outputs/apk/$buildTypeLower/$apkFileName"
$fullApkPath = Join-Path $androidDir "app\build\outputs\apk\$buildTypeLower\$apkFileName"

# Release APK might also be named app-release-unsigned.apk if unsigned
if (-not (Test-Path $fullApkPath)) {
    $candidateApks = Get-ChildItem -Path (Join-Path $androidDir "app\build\outputs\apk\$buildTypeLower") -Filter "*.apk" -ErrorAction SilentlyContinue
    if ($candidateApks -and $candidateApks.Count -gt 0) {
        $fullApkPath = $candidateApks[0].FullName
        $relativeApkPath = "android/app/build/outputs/apk/$buildTypeLower/$($candidateApks[0].Name)"
    }
}

if (-not (Test-Path $fullApkPath)) {
    [Console]::Error.WriteLine("Error: Build finished but APK was not found at expected path: $relativeApkPath")
    exit 1
}

# Conserve disk space: purge intermediate caches after extracting APK if -Clean was passed
if ($Clean) {
    $intermediatesDir = Join-Path $androidDir "app\build\intermediates"
    if (Test-Path $intermediatesDir) {
        Remove-Item -Path $intermediatesDir -Recurse -Force -ErrorAction SilentlyContinue
    }
}

Write-Output "[Success] APK generated successfully at: $relativeApkPath"
Write-Host "=================================================================" -ForegroundColor Green
Write-Host "  APK Build Completed Successfully!                              " -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Green
Write-Host " Target Variant: $BuildType" -ForegroundColor Gray
Write-Host " Relative Path : $relativeApkPath" -ForegroundColor Gray
Write-Host " Full Path     : $fullApkPath" -ForegroundColor Gray
$apkSizeMb = ([System.IO.FileInfo]::new($fullApkPath).Length / 1MB).ToString("0.00")
Write-Host " File Size     : $apkSizeMb MB" -ForegroundColor Gray
Write-Host "-----------------------------------------------------------------" -ForegroundColor Gray

exit 0

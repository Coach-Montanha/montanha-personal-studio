#!/usr/bin/env bash
# =============================================================================
# Montanha Personal Studio - Defensive Android APK Build Script (POSIX/Bash)
# =============================================================================
# Guards host resources (especially constrained host disk space and RAM)
# by running pre-flight checks before invoking Gradle:
# 1. Disk space check: warns if free space < 10 GB, recommending cloud CI.
# 2. Toolchain checks: verifies Java (JDK 17+) and Android SDK (ANDROID_HOME).
# 3. Builds APK via Gradle wrapper using '--no-daemon' and -Xmx2048m.
# 4. Optional --clean removes intermediate Gradle build caches to conserve disk.
# =============================================================================

set -e

# Default parameters
BUILD_TYPE="Debug"
CLEAN=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    -BuildType|--build-type|-b)
      BUILD_TYPE="$2"
      shift 2
      ;;
    -Clean|--clean|-c)
      CLEAN=true
      shift 1
      ;;
    -h|--help)
      echo "Usage: ./scripts/build-apk.sh [-BuildType Debug|Release] [-Clean]"
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      exit 1
      ;;
  esac
done

# Normalize and validate BuildType
case "$(echo "$BUILD_TYPE" | tr '[:upper:]' '[:lower:]')" in
  debug)
    BUILD_TYPE="Debug"
    ;;
  release)
    BUILD_TYPE="Release"
    ;;
  *)
    echo "Invalid -BuildType '$BUILD_TYPE'. Must be one of: Debug, Release" >&2
    exit 1
    ;;
esac

echo "[Montanha Mobile Builder] Target: $BUILD_TYPE"

# -----------------------------------------------------------------------------
# 1. Directory Resolution
# -----------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

if [ ! -d "$PROJECT_ROOT/android" ]; then
  if [ -d "$(pwd)/android" ]; then
    PROJECT_ROOT="$(pwd)"
  else
    echo "Error: Native Android directory not found. Ensure 'android/' exists." >&2
    exit 1
  fi
fi

ANDROID_DIR="$PROJECT_ROOT/android"

# -----------------------------------------------------------------------------
# 2. Pre-Flight Check 1: Host Free Disk Space (< 10 GB Warning)
# -----------------------------------------------------------------------------
MIN_DISK_BYTES=$((10 * 1024 * 1024 * 1024)) # 10 GB

if [ -n "$SIMULATE_DISK_BYTES" ]; then
  AVAILABLE_BYTES="$SIMULATE_DISK_BYTES"
else
  # Use POSIX df -Pk (1024-byte blocks)
  AVAILABLE_KB=$(df -Pk "$PROJECT_ROOT" 2>/dev/null | awk 'NR==2 {print $4}')
  if [ -n "$AVAILABLE_KB" ]; then
    AVAILABLE_BYTES=$((AVAILABLE_KB * 1024))
  else
    AVAILABLE_BYTES=0
  fi
fi

if [ "$AVAILABLE_BYTES" -lt "$MIN_DISK_BYTES" ]; then
  FREE_GB=$(awk -v b="$AVAILABLE_BYTES" 'BEGIN { printf "%.2f", b / (1024 * 1024 * 1024) }')
  echo "[WARNING] Host disk space low: ${FREE_GB} GB free (Recommended: >= 10 GB). Consider using GitHub Actions CI to avoid local disk bloat."
fi

# -----------------------------------------------------------------------------
# 3. Pre-Flight Check 2: Java JDK Toolchain Verification (Exit Code 2)
# -----------------------------------------------------------------------------
HAS_JAVA=false

if [ -n "$JAVA_HOME" ] && [ -d "$JAVA_HOME" ]; then
  if [ -x "$JAVA_HOME/bin/java" ] || [ -x "$JAVA_HOME/bin/javac" ]; then
    HAS_JAVA=true
  fi
fi

if [ "$HAS_JAVA" = false ]; then
  if command -v java >/dev/null 2>&1 || command -v javac >/dev/null 2>&1; then
    HAS_JAVA=true
  fi
fi

if [ "$HAS_JAVA" = false ]; then
  echo "Pre-flight failure: Java (JDK 17+) not found in PATH or JAVA_HOME. Install OpenJDK or build on GitHub Actions CI." >&2
  exit 2
fi

# -----------------------------------------------------------------------------
# 4. Pre-Flight Check 3: Android SDK Toolchain Verification (Exit Code 3)
# -----------------------------------------------------------------------------
HAS_ANDROID_SDK=false

if [ -n "$ANDROID_HOME" ] && [ -d "$ANDROID_HOME" ]; then
  HAS_ANDROID_SDK=true
elif [ -n "$ANDROID_SDK_ROOT" ] && [ -d "$ANDROID_SDK_ROOT" ]; then
  HAS_ANDROID_SDK=true
fi

if [ "$HAS_ANDROID_SDK" = false ]; then
  echo "Pre-flight failure: Android SDK not found in ANDROID_HOME or ANDROID_SDK_ROOT. Configure Android Studio or build on GitHub Actions CI." >&2
  exit 3
fi

# -----------------------------------------------------------------------------
# 5. Clean Option Handling (Pre-build)
# -----------------------------------------------------------------------------
if [ "$CLEAN" = true ]; then
  echo "[Clean] Purging local Gradle caches and previous build artifacts..."
  rm -rf "$ANDROID_DIR/app/build/intermediates"
fi

# -----------------------------------------------------------------------------
# 6. Gradle Wrapper Execution
# -----------------------------------------------------------------------------
GRADLEW="$ANDROID_DIR/gradlew"
if [ ! -f "$GRADLEW" ]; then
  echo "Error: Gradle wrapper not found at '$GRADLEW'." >&2
  exit 1
fi
chmod +x "$GRADLEW"

GRADLE_DAEMON_FLAG="--no-daemon"
GRADLE_TASK="assemble$BUILD_TYPE"
echo "[Gradle] Executing './gradlew $GRADLE_TASK $GRADLE_DAEMON_FLAG'..."

export GRADLE_OPTS="-Xmx2048m"

cd "$ANDROID_DIR"
./gradlew "$GRADLE_TASK" "$GRADLE_DAEMON_FLAG" -Dorg.gradle.jvmargs="-Xmx2048m"
cd "$PROJECT_ROOT"

# -----------------------------------------------------------------------------
# 7. Locate Generated APK & Post-Build Clean
# -----------------------------------------------------------------------------
BUILD_TYPE_LOWER="$(echo "$BUILD_TYPE" | tr '[:upper:]' '[:lower:]')"
APK_FILE_NAME="app-${BUILD_TYPE_LOWER}.apk"
RELATIVE_APK_PATH="android/app/build/outputs/apk/${BUILD_TYPE_LOWER}/${APK_FILE_NAME}"
FULL_APK_PATH="$ANDROID_DIR/app/build/outputs/apk/${BUILD_TYPE_LOWER}/${APK_FILE_NAME}"

if [ ! -f "$FULL_APK_PATH" ]; then
  # Fallback search for any .apk in target folder
  CANDIDATE=$(find "$ANDROID_DIR/app/build/outputs/apk/${BUILD_TYPE_LOWER}" -maxdepth 1 -name "*.apk" 2>/dev/null | head -n 1)
  if [ -n "$CANDIDATE" ]; then
    FULL_APK_PATH="$CANDIDATE"
    RELATIVE_APK_PATH="android/app/build/outputs/apk/${BUILD_TYPE_LOWER}/$(basename "$CANDIDATE")"
  fi
fi

if [ ! -f "$FULL_APK_PATH" ]; then
  echo "Error: Build finished but APK was not found at expected path: $RELATIVE_APK_PATH" >&2
  exit 1
fi

# Conserve disk space: purge intermediate caches after extracting APK if --clean was passed
if [ "$CLEAN" = true ]; then
  rm -rf "$ANDROID_DIR/app/build/intermediates"
fi

echo "[Success] APK generated successfully at: $RELATIVE_APK_PATH"
echo "================================================================="
echo "  APK Build Completed Successfully!"
echo "================================================================="
echo " Target Variant: $BUILD_TYPE"
echo " Relative Path : $RELATIVE_APK_PATH"
echo " Full Path     : $FULL_APK_PATH"
echo "-----------------------------------------------------------------"

exit 0

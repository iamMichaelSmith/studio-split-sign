#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUILD_DIR="${BUILD_DIR:-${SCRIPT_DIR}/build-macos}"
CONFIGURATION="${CONFIGURATION:-Release}"
VERSION="${VERSION:-0.1.2}"
DIST_DIR="${DIST_DIR:-${SCRIPT_DIR}/dist-macos}"
STAGING_DIR="${DIST_DIR}/staging"
APP_IDENTITY="${SPLITSHEET_MAC_APP_IDENTITY:-}"
INSTALLER_IDENTITY="${SPLITSHEET_MAC_INSTALLER_IDENTITY:-}"
NOTARY_PROFILE="${SPLITSHEET_NOTARY_PROFILE:-}"

if [[ -z "${APP_IDENTITY}" || -z "${INSTALLER_IDENTITY}" || -z "${NOTARY_PROFILE}" ]]; then
  cat >&2 <<'EOF'
Set these environment variables before packaging:
  SPLITSHEET_MAC_APP_IDENTITY="Developer ID Application: ..."
  SPLITSHEET_MAC_INSTALLER_IDENTITY="Developer ID Installer: ..."
  SPLITSHEET_NOTARY_PROFILE="split-sheet-studio-notary"
EOF
  exit 1
fi

BUILD_DIR="${BUILD_DIR}" CONFIGURATION="${CONFIGURATION}" "${SCRIPT_DIR}/build-macos.sh"

ARTEFACTS_DIR="${BUILD_DIR}/SplitSheetStudio_artefacts/${CONFIGURATION}"
AU_PATH="${ARTEFACTS_DIR}/AU/Split Sheet Studio.component"
VST3_PATH="${ARTEFACTS_DIR}/VST3/Split Sheet Studio.vst3"
APP_PATH="${ARTEFACTS_DIR}/Standalone/Split Sheet Studio.app"
PKG_PATH="${DIST_DIR}/SplitSheetStudio-${VERSION}-macOS.pkg"

rm -rf "${STAGING_DIR}"
mkdir -p \
  "${STAGING_DIR}/Library/Audio/Plug-Ins/Components" \
  "${STAGING_DIR}/Library/Audio/Plug-Ins/VST3" \
  "${STAGING_DIR}/Applications" \
  "${DIST_DIR}"

codesign --force --deep --options runtime --timestamp --sign "${APP_IDENTITY}" "${AU_PATH}"
codesign --force --deep --options runtime --timestamp --sign "${APP_IDENTITY}" "${VST3_PATH}"
codesign --force --deep --options runtime --timestamp --sign "${APP_IDENTITY}" "${APP_PATH}"

codesign --verify --deep --strict --verbose=2 "${AU_PATH}"
codesign --verify --deep --strict --verbose=2 "${VST3_PATH}"
codesign --verify --deep --strict --verbose=2 "${APP_PATH}"

ditto "${AU_PATH}" "${STAGING_DIR}/Library/Audio/Plug-Ins/Components/Split Sheet Studio.component"
ditto "${VST3_PATH}" "${STAGING_DIR}/Library/Audio/Plug-Ins/VST3/Split Sheet Studio.vst3"
ditto "${APP_PATH}" "${STAGING_DIR}/Applications/Split Sheet Studio.app"

pkgbuild \
  --root "${STAGING_DIR}" \
  --identifier "com.blakmarigold.splitsheetstudio.pkg" \
  --version "${VERSION}" \
  --install-location "/" \
  --sign "${INSTALLER_IDENTITY}" \
  "${PKG_PATH}"

xcrun notarytool submit "${PKG_PATH}" --keychain-profile "${NOTARY_PROFILE}" --wait
xcrun stapler staple "${PKG_PATH}"
xcrun stapler validate "${PKG_PATH}"
spctl --assess --type install --verbose=2 "${PKG_PATH}"

echo "Signed and notarized installer: ${PKG_PATH}"

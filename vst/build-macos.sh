#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUILD_DIR="${BUILD_DIR:-${SCRIPT_DIR}/build-macos}"
CONFIGURATION="${CONFIGURATION:-Release}"
DEPLOYMENT_TARGET="${MACOSX_DEPLOYMENT_TARGET:-12.0}"
INSTALL_AFTER_BUILD="${INSTALL_AFTER_BUILD:-0}"

cmake -S "${SCRIPT_DIR}" -B "${BUILD_DIR}" \
  -G Xcode \
  -DCMAKE_OSX_ARCHITECTURES="arm64;x86_64" \
  -DCMAKE_OSX_DEPLOYMENT_TARGET="${DEPLOYMENT_TARGET}"

cmake --build "${BUILD_DIR}" --config "${CONFIGURATION}" --parallel

ARTEFACTS_DIR="${BUILD_DIR}/SplitSheetStudio_artefacts/${CONFIGURATION}"
AU_PATH="${ARTEFACTS_DIR}/AU/Split Sheet Studio.component"
VST3_PATH="${ARTEFACTS_DIR}/VST3/Split Sheet Studio.vst3"
APP_PATH="${ARTEFACTS_DIR}/Standalone/Split Sheet Studio.app"

for artefact in "${AU_PATH}" "${VST3_PATH}" "${APP_PATH}"; do
  if [[ ! -e "${artefact}" ]]; then
    echo "Expected build artefact missing: ${artefact}" >&2
    exit 1
  fi
done

if [[ "${INSTALL_AFTER_BUILD}" == "1" ]]; then
  AU_INSTALL_DIR="${HOME}/Library/Audio/Plug-Ins/Components"
  VST3_INSTALL_DIR="${HOME}/Library/Audio/Plug-Ins/VST3"
  APP_INSTALL_DIR="${HOME}/Applications"

  mkdir -p "${AU_INSTALL_DIR}" "${VST3_INSTALL_DIR}" "${APP_INSTALL_DIR}"
  rm -rf "${AU_INSTALL_DIR}/Split Sheet Studio.component"
  rm -rf "${VST3_INSTALL_DIR}/Split Sheet Studio.vst3"
  rm -rf "${APP_INSTALL_DIR}/Split Sheet Studio.app"
  ditto "${AU_PATH}" "${AU_INSTALL_DIR}/Split Sheet Studio.component"
  ditto "${VST3_PATH}" "${VST3_INSTALL_DIR}/Split Sheet Studio.vst3"
  ditto "${APP_PATH}" "${APP_INSTALL_DIR}/Split Sheet Studio.app"

  killall -9 AudioComponentRegistrar 2>/dev/null || true
  echo "Installed Audio Unit, VST3, and standalone app for the current user."
fi

echo "Build complete."
echo "Audio Unit: ${AU_PATH}"
echo "VST3: ${VST3_PATH}"
echo "Standalone: ${APP_PATH}"
echo "Validate the Audio Unit with: auval -v aufx Ssst Bmss"

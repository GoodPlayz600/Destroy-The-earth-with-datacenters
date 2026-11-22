#!/usr/bin/env bash
set -euo pipefail
project="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
staging="$(mktemp -d)"
trap 'rm -rf -- "$staging"' EXIT
npm pack --silent --pack-destination "$staging" @photonengine/realtime-core@6.0.2
tar -xzf "$staging/photonengine-realtime-core-6.0.2.tgz" -C "$staging"
destination="$project/Assets/WebGLTemplates/Clearcut/PhotonVendor"
mkdir -p "$destination"
cp -R "$staging/package/dist" "$destination/"

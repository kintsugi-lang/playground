#!/bin/sh
set -e
cd "$(dirname "$0")"
mkdir -p public
cp ../kintsugi/web/kintsugi_js.js public/kintsugi_js.js
cp ../kintsugi/assets/logo.png public/logo.png
echo "Synced kintsugi_js.js ($(wc -c < public/kintsugi_js.js) bytes) and logo.png"

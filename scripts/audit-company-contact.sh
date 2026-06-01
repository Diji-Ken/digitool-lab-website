#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "== Company contact references =="
grep -RInE '〒|住所|所在地|電話番号|telephone|tel:|048-606-4504|331-0821|361-0023' . \
  --exclude-dir=.git \
  --exclude-dir=node_modules \
  --exclude='company-contact-inventory.md' \
  --exclude='audit-company-contact.sh' \
  --exclude='*.png' \
  --exclude='*.jpg' \
  --exclude='*.jpeg' \
  --exclude='*.webp' \
  --exclude='*.gif' \
  --exclude='*.csv' || true

echo
echo "== Deprecated address check =="
grep -RInE '110-0004|下谷2丁目23番8号|リベール上野|東京都台東区|台東区|350-0157|下伊草167|川島町|比企郡' . \
  --exclude-dir=.git \
  --exclude-dir=node_modules \
  --exclude='company-contact-inventory.md' \
  --exclude='audit-company-contact.sh' \
  --exclude='*.png' \
  --exclude='*.jpg' \
  --exclude='*.jpeg' \
  --exclude='*.webp' \
  --exclude='*.gif' \
  --exclude='*.csv' || true

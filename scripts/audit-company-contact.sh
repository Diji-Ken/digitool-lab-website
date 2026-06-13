#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "== Company contact references =="
grep -RInE '〒|住所|所在地|電話番号|telephone|tel:|0[0-9]{1,4}-[0-9]{2,4}-[0-9]{3,4}|331-0821|361-0023' . \
  --exclude-dir=.git \
  --exclude-dir=node_modules \
  --exclude-dir=backup_20250703_112022 \
  --exclude-dir=backup_images_20250727_213226 \
  --exclude-dir=backup_images_20250727_213230 \
  --exclude-dir=article-workspace \
  --exclude-dir=posts-management \
  --exclude-dir=scripts \
  --exclude='company-contact-inventory.md' \
  --exclude='audit-company-contact.sh' \
  --exclude='*.bak' \
  --exclude='*.png' \
  --exclude='*.jpg' \
  --exclude='*.jpeg' \
  --exclude='*.webp' \
  --exclude='*.gif' \
  --exclude='*.csv' || true

echo
echo "== Deprecated address check =="
echo "Deprecated address literals are intentionally not stored in this public script."

#!/bin/sh
# Bản local-an-toan: xem tác giả gốc (upstream) có gì mới TRƯỚC khi gộp vào. Script này chỉ đọc, không gộp, không cài.
# Chạy: sh scripts/kiem-tra-cap-nhat.sh
set -eu
cd "$(dirname "$0")/.."
git remote get-url upstream >/dev/null 2>&1 || git remote add upstream https://github.com/khanh020905/my-office.git
git fetch -q upstream main
BASE=$(git merge-base HEAD upstream/main)
N=$(git rev-list --count "$BASE"..upstream/main)
echo "Tác giả có $N commit mới kể từ lần gộp trước."
[ "$N" -eq 0 ] && exit 0
echo
echo "== Commit mới =="
git log --oneline "$BASE"..upstream/main | head -40
echo
echo "== File thay đổi =="
git diff --stat "$BASE" upstream/main | tail -25
echo
echo "== Chỗ cần soi kỹ (thư viện, hook, lệnh hệ thống, mạng, chỗ đã khoá trong bản an toàn) =="
git diff "$BASE" upstream/main -- package.json package-lock.json hooks/ bin/ .claude-plugin/ \
  | grep -E '^\+' | grep -vE '^\+\+\+' \
  | grep -nE 'child_process|execFile|spawn\(|eval\(|new Function|fetch\(|https?://|postinstall|preinstall|"resolved"|OFFICE_OPEN|OFFICE_HOST|OFFICE_TRANSLATE|tunnel|cloudflared|keychain|find-generic-password' \
  | head -60 || echo "(không có dòng đáng ngờ ở package/hook/bin)"
git diff "$BASE" upstream/main -- server/ \
  | grep -E '^\+' | grep -vE '^\+\+\+' \
  | grep -nE 'fetch\(|https?://[a-z]|spawn\(|execFile\(|eval\(|new Function|OFFICE_OPEN|startTunnel|syncLan|TRANSLATE|find-generic-password' \
  | head -60 || echo "(không có dòng đáng ngờ trong server/)"
echo
echo "Chưa gộp gì. Đưa kết quả này cho Claude soi, rồi mới: git merge upstream/main"

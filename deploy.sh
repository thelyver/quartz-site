#!/bin/bash
# 원클릭 동기화 & 배포 (Shell Commands 플러그인용)
cd "$HOME/quartz-site" || exit 1
bash sync-obsidian.sh
git add -A
git commit -m "Update notes $(date '+%Y-%m-%d %H:%M')"
git push origin HEAD:v4
echo "✅ 배포 완료: https://thelyver.github.io/quartz-site/"

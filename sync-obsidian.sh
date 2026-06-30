#!/bin/bash
set -euo pipefail

# Obsidian 특정 폴더 → Quartz content 동기화 스크립트
VAULT="/Users/dunet/Documents/SylverObsidian"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
QUARTZ_CONTENT="$SCRIPT_DIR/content"

echo "🔄 동기화 시작..."
mkdir -p "$QUARTZ_CONTENT"

sync_dir() {
  local source_path="$1"
  local target_name="$2"
  local target_path="$QUARTZ_CONTENT/$target_name"

  rm -rf "$target_path"

  if [[ -d "$source_path" ]]; then
    cp -R "$source_path" "$target_path"
    echo "✅ $target_name 폴더 복사 완료"
  else
    echo "⚠️  $source_path 없음 — $target_name 동기화 건너뜀"
  fi
}

sync_dir "$VAULT/001.Inbox/TYS" "TYS"
sync_dir "$VAULT/200.프로젝트/223.더데어" "더데어"
sync_dir "$VAULT/001.Inbox/데어에이.thereA/AI주류유통플랫폼/AI활용지원_아이디어메모" "AI활용지원_아이디어메모"

# 메인 페이지 수동 노출: Quartz Publisher 자동 index가 아닌 수동 index.md를 쓰고 있어 새 게시 폴더를 직접 링크한다.
INDEX_FILE="$QUARTZ_CONTENT/index.md"
AI_IDEA_LINK="- [AI활용지원_아이디어메모](AI%ED%99%9C%EC%9A%A9%EC%A7%80%EC%9B%90_%EC%95%84%EC%9D%B4%EB%94%94%EC%96%B4%EB%A9%94%EB%AA%A8/) — 데어에이 AI 활용지원 아이디어 메모 31개 + 전체 인덱스"
if [[ -f "$INDEX_FILE" ]] && ! grep -Fq "AI활용지원_아이디어메모" "$INDEX_FILE"; then
  python3 - "$INDEX_FILE" "$AI_IDEA_LINK" <<'PY'
from pathlib import Path
import sys
path = Path(sys.argv[1])
link = sys.argv[2]
text = path.read_text()
text = text.replace("총 **10개** 항목 게시됨.", "총 **11개** 항목 게시됨.")
anchor = "- [How to use AI](400.AI/How%20to%20use%20AI/)\n"
if anchor in text:
    text = text.replace(anchor, anchor + link + "\n", 1)
path.write_text(text)
PY
fi

echo "📁 동기화 완료"
ls -la "$QUARTZ_CONTENT"

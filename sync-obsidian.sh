#!/bin/bash
# Obsidian 특정 폴더 → Quartz content 동기화 스크립트

VAULT="/Users/dunet/Documents/SylverObsidian"
QUARTZ_CONTENT="$HOME/quartz-site/content"

echo "🔄 동기화 시작..."

# content 디렉토리 초기화 (기존 동기화 폴더만 제거)
rm -rf "$QUARTZ_CONTENT/TYS"
rm -rf "$QUARTZ_CONTENT/더데어"

# 폴더 복사
cp -r "$VAULT/001.Inbox/TYS" "$QUARTZ_CONTENT/TYS"
echo "✅ TYS 폴더 복사 완료"

cp -r "$VAULT/200.프로젝트/223.더데어" "$QUARTZ_CONTENT/더데어"
echo "✅ 더데어 폴더 복사 완료"

echo "📁 동기화 완료"
ls -la "$QUARTZ_CONTENT"

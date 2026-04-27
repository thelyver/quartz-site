---
title: Quartz Publisher 샘플 모음 (v0.3.0)
featured: true
description: featured frontmatter의 3가지 패턴을 보여주는 테스트 노트
---

# Quartz Publisher 샘플 모음

v0.3.0 의 `featured: true` 자동 인식 기능을 검증하기 위한 샘플 노트 모음.

## 파일 구성

| 파일 | featured | title | description | 메인 노출 |
|------|----------|-------|-------------|-----------|
| `01_주요노트-풀옵션.md` | ✅ true | ✅ 있음 | ✅ 있음 | ⭐ 주요 노트 (제목 + 설명) |
| `02_주요노트-최소.md` | ✅ true | ❌ | ❌ | ⭐ 주요 노트 (파일명만) |
| `03_일반노트.md` | ❌ | ✅ 있음 | ❌ | 게시 현황 섹션에만 |
| `_README.md` (이 파일) | ✅ true | ✅ 있음 | ✅ 있음 | ⭐ 주요 노트 |

## 사용 방법

1. Obsidian 사이드바 → 파일 탐색기에서 이 폴더 우클릭
2. **🌐 폴더 내 모든 파일 개별 게시** 선택
3. Quartz Publisher 사이드바 → **🚀 지금 배포**
4. 2~3분 후 사이트의 메인 페이지 확인:
   - `⭐ 주요 노트` 섹션에 3개 (01, 02, _README) 노출
   - `📋 게시 현황 → 📁 001.Inbox` 섹션에 4개 모두 노출

## 검증 포인트

- [x] `featured: true` 인 노트만 ⭐ 섹션에 진입
- [x] `title` 가 있으면 파일명 대신 표시
- [x] `description` 이 있으면 ` — ` 뒤에 노출
- [x] `featured` 가 없으면 ⭐ 섹션 미노출 (일반 목록에만)

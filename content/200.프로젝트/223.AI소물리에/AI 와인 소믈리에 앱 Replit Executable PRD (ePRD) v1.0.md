---
created: 2026-01-31T12:46:21
modified: 2026-01-31T12:46:21
type:
  - note
tags:
  - AI소물리에
  - replit_com
author:
  - 강수근
aliases:
index:
related:
source:
  - https://wine-ai.replit.app/
source URL:
  - https://09c87aed-7529-46e2-92e7-49526af69279-00-repyzweoty7i.spock.replit.dev/
description:
---
## AI 와인 소믈리에 앱 Replit Executable PRD (ePRD) v1.0
## 목적
이 문서는 Replit 바이브 코딩 AI가 즉시 실행 가능한 초기 버전(v0)의 AI 와인 소믈리에 앱을 생성하기 위한 Executable PRD이다. 완성형 제품이 아닌, 실제로 동작하는 프로토타입을 목표로 한다.
## 앱 개요
이 앱은 사용자의 자연어 질문에 대해 전문 와인 소믈리에의 말투로 와인을 추천해주며, 버튼 기반의 구조화된 방식으로도 와인을 탐색할 수 있는 하이브리드 와인 추천 서비스다.
## 핵심 기능
- CSV 파일을 관계형 데이터베이스(RDB)로 변환 및 적재
- 자연어 기반 대화형 AI 와인 추천
- 버튼형 네비게이션을 통한 구조화 와인 검색
## 입력 데이터
- WineList.csv
- KeywordLib_occasion.csv
- KeywordLib_use.csv
- KeywordLib_nation.csv
- KeywordLib_type.csv
- KeywordLib_price.csv
- KeywordLib_taste.csv
## 데이터베이스 설계
#### wines 테이블
- id (PK)
- name_kr
- name_en
- nation
- region
- type
- price_range
- alcohol
- degree
- sweet
- acidity
- body
- tannin
- summary
- description
- tasting_note
- pairing
- sample_group
#### occasions 테이블
- wine_id (FK)
- people
- place
- purpose
#### keyword_lib 테이블
- category
- keyword
- mapped_value
## 데이터 적재 규칙
- 앱 실행 시 CSV 파일을 자동으로 읽어 DB에 적재한다.
- WineList.csv → wines, occasions 테이블
- KeywordLib CSV → keyword_lib 테이블
- 모든 데이터는 초기 시드 데이터로 관리한다.
## 자연어 와인 추천 기능
- 사용자는 자유로운 자연어로 상황을 입력한다.
- AI는 키워드 라이브러리를 기준으로 의도를 해석한다.
	- occasion, taste, price, type을 추출한다.
- DB에서 조건에 맞는 와인을 필터링한다.
- 적합도 점수 기준으로 상위 N개를 선택한다.
- 소믈리에 말투로 추천 이유를 설명한다.
## 출력 규칙
- 반드시 DB에 존재하는 와인만 추천한다.
- 존재하지 않는 와인을 생성하지 않는다.
- 상황 중심으로 추천 이유를 설명한다.
## 소믈리에 페르소나
- 1인칭 전문 소믈리에 시점
- 친절하지만 과장되지 않은 톤
- 왜 이 와인이 이 상황에 적합한지 설명
## 버튼형 검색
- Occasion
- Type
- Taste
- Price
- Nation
## 버튼 검색 동작
- 버튼 클릭 시 즉시 필터링
- 선택 조건 상단 표시
- 복수 조건 조합 가능
## 추천 결과 UI
- 카드형 리스트
	- 와인명
	- 한줄 요약
	- 추천 이유
	- 상세 보기 버튼
## 기술 스택
- Frontend: React
- Backend: Node.js
- DB: Replit DB(PostgreSQL)
- LLM: OpenAI API
## MVP 범위
#### 포함
- CSV → RDB 자동 적재
- 자연어 추천 단일 턴
- 버튼형 필터 검색
#### 제외
- 로그인
- 즐겨찾기
- 리뷰
- 결제
## 개발 원칙
- 완성도보다 동작 흐름 우선
- UI는 단순하게
- 추천 정확성과 설명 품질 최우선
## 앱 디자인
#### 디자인 레퍼런스
- 1순위: vivino - https://www.vivino.com/
- 2순위: wine.com - https://www.wine.com/
#### 전체적으로
- VIVINO의 디자인과 상세페이지 네비게이션 구조
- wine.com의 첫페이지 구조를 반영
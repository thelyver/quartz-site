---
share_link: https://share.note.sx/4o75vr5b#NFx9ktDFPIAxYptrfxpsn2YbfQ32Gdi7cXdBfF7oEnc
share_updated: 2025-06-10T14:01:51+09:00
created: 2025-06-10T13:48:53
modified: 2025-12-15T20:04:03
type:
  - note
tags:
  - 와인21닷컴
  - Biz소물리에
  - POS
  - 사업모델
  - 프롬프트
  - 비즈니스다이어그램
  - 수익모델
  - B2B
  - 데이터분석
  - 플랫폼전략
  - 협력모델
  - 디유넷
  - AI추천시스템
  - 와인유통
aliases:
author:
  - 강수근
source:
index:
related_note:
source URL:
description: POS사 대상 Biz소물리에 제안을 위한 자료 작성
Related_Project:
---



![[Pasted image 20250610140927.png]]


```mermaid
   graph TD
       %% 3사 협력 구조
       A[디유넷<br/>AI 기술력] --> D{AI 소믈리에 Tool<br/>개발 및 통합}
       B[와인21<br/>도메인 전문성<br/>• 와인 DB 20만종<br/>• 글로벌 와이너리 네트워크<br/>• 시장 1위 브랜드] --> D
       C[POS사<br/>인프라 및 유통<br/>• POS 단말 보급<br/>• 기술 지원<br/>• 투자 연계] --> D
       
       %% 서비스 개발 단계
       D --> E[AI 소믈리에 Tool<br/>탑재 POS 시스템<br/><br/>• 개인 맞춤 추천<br/>• 실시간 재고 관리<br/>• 고객 분석<br/>• 매출 최적화]
       
       %% 시장 적용
       E --> F[와인 소매점 적용<br/><br/>🏪 프리미엄 와인샵<br/>🏪 중형 와인 매장<br/>🏪 복합 주류 매장]
       
       %% 데이터 수집
       F --> G[실거래 데이터<br/>수집 및 분석<br/><br/>📊 판매 데이터<br/>📊 재고 현황<br/>�� 고객 선호도<br/>📊 시장 트렌드]
       
       %% 수익 사업 전개
       G --> H[1차 수익 사업<br/>POS 기반]
       G --> I[2차 수익 사업(향후)<br/>데이터 기반]
       G --> J[3차 수익 사업(향후)<br/>플랫폼 기반]
       
       %% 1차 수익 상세
       H --> H1[💰 POS 단말 판매<br/>프리미엄 ?%]
       H --> H2[💰 월 서비스 이용료<br/>매장당 ?만원]
       H --> H3[💰 업그레이드 서비스<br/>기능별 과금]
       H --> H4[💰 와인찾기 서비스<br/>기능별 과금]
       
       %% 2차 수익 상세
       I --> I1[💰 B2B 마케팅 서비스<br/>타겟 광고, 프로모션]
       I --> I2[💰 시장 조사 서비스<br/>트렌드 분석 리포트]
       I --> I3[💰 공급업체 수수료<br/>추천 연동 매출]
       
       %% 3차 수익 상세
       J --> J1[💰 와인 큐레이션<br/>개인 맞춤 배송]
       J --> J2[💰 교육 서비스<br/>소믈리에 과정]
       J --> J3[�� 이벤트 플랫폼<br/>와인 테이스팅]
       
       %% 순환 구조 (데이터 피드백)
       H1 -.-> G
       I1 -.-> G
       J1 -.-> G
       
       %% 스타일링
       classDef company fill:#e1f5fe,stroke:#01579b,stroke-width:2px
       classDef service fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
       classDef market fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
       classDef data fill:#fff3e0,stroke:#e65100,stroke-width:2px
       classDef revenue fill:#fce4ec,stroke:#880e4f,stroke-width:2px
       
       class A,B,C company
       class D,E service
       class F market
       class G data
       class H,I,J,H1,H2,H3,I1,I2,I3,J1,J2,J3 revenue
```

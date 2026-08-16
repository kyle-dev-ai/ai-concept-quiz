# Content sources

앱 콘텐츠에 반영한 사용자 원문과 범위를 기록한다. 이 문서는 출처 목록이며 각 설명의 사실성을 자동 보증하지 않는다. 질문은 golden evaluation과 사람 검수를 별도로 통과해야 한다.

## source-2026-08-16-notion-ml-basics

- Source: user-shared Notion page `2026.08`
- Notion page ID: `3be01c17-d0d5-809e-a373-ec4c0b61fbe8`
- Read date: 2026-08-16
- Scope used: 8/16 ML 기본 개념과 같은 날 작성한 Transformer 메모
- Added question IDs:
  - `ml-feature-label-prediction`
  - `ml-self-supervised-signal`
  - `ml-parameter-hyperparameter`
  - `ml-loss-vs-metric`
  - `transformer-causal-mask`
- Existing IDs preserved instead of duplicating: AI/ML/DL, supervised/unsupervised, train/validation/test, regression/classification, overfitting/underfitting
- Added only as distinct deeper prompts: MSE와 MAE 비교, cross entropy의 negative log-likelihood, BERT와 GPT 구조 비교
- Review note: 원문의 `Casual Mask` 표기는 표준 용어인 `Causal Mask`로 바로잡았다.

## source-2026-08-16-notion-study-plan

- Source: user-shared Notion page `2026 Plan`
- Notion page ID: `3be01c17-d0d5-803a-ad1b-d1aca8accc62`
- Read date: 2026-08-16
- Scope used: 8~11월 Math, ML, DL, Transformer, LLM, RAG, Agent, AI System 학습·구술 로드맵
- Output: `src/content/roadmap-questions/`의 83개 추가 문항
- Dataset result: version `1.1.0`, 8개 category, 총 127개 질문
- Math coverage: vector·matrix, basis·dimension, orthogonality·projection, rank·null space,
  determinant·inverse·pseudoinverse, eigen·SVD, gradient·Jacobian·Hessian, probability·Bayes,
  covariance·Gaussian, entropy·KL divergence

## source-2026-08-16-public-admissions-research

공식 공개 기출문항은 확인되지 않았다. 아래 자료에서 전형 사실과 공개 후기에 반복되는 범위만 추출했고, 문항과 답변은 새로 작성했다. 특정 학교의 실제 기출이라고 표시하지 않는다.

### Official, high confidence for process and curriculum only

- [연세대학교 인공지능융합대학원 입학안내](https://gcomputing.yonsei.ac.kr/gcomputing/Admission.do): 1단계 서류, 2단계 대면 구술
- [연세대학교 2026학년도 전기 모집요강](https://rus.yonsei.ac.kr/gcomputing/community/noticeBoard.do?articleNo=455337&attachNo=196964&mode=download): 평가 내용은 비공개이며 구술 세부사항은 서류 합격 발표 시 안내
- [고려대학교 SW·AI융합대학원 2026학년도 후기 구술 안내](https://gscit.korea.ac.kr/gscit/board/notice_master.do?articleNo=807240&mode=view&totalNoticeYn=N): 대면 구술과 지원 학과별 대기 안내
- [고려대학교 인공지능융합학과 교수요목](https://gscit.korea.ac.kr/gscit/department/ai_outline.do): 선형대수, 확률통계, 최적화, ML, DL, NLP 범위
- [성균관대학교 인공지능대학원 입학안내](https://ai.skku.edu/ai/admission.do): 1차 합격자 대상 2차 면접

### Public first-person reports, medium confidence for patterns only

- [2025년 후기 연세대·고려대 합격 수기](https://bl-nk.tistory.com/124): 그룹 면접, 자기소개, 전공 개괄 질문 뒤 꼬리질문 패턴
- [연세대 인공지능융합대학원 합격 후기](https://jooniland.tistory.com/35): ML·DL·LLM 기초와 본인 AI 경력의 이론 연결을 준비했다는 회고
- [여러 AI 대학원 면접 후기](https://aigraduate-record.tistory.com/1): 선형대수, 확률통계, foundation model, AI 기초와 서류·연구 경험 질문
- [2025 전기 성균관대 인공지능융합학과 후기](https://happy-support.tistory.com/54): 공개된 연구실 면담 범위로 autoregressive model과 GAN, 면접에서는 프로젝트 모델 선택·학습과 연구 목표 언급
- [고려대 SW·AI융합대학원 합격 후기](https://hjjworld.tistory.com/entry/%EA%B3%A0%EB%A0%A4%EB%8C%80%ED%95%99%EA%B5%90-SW-AI-%EC%9C%B5%ED%95%A9%EB%8C%80%ED%95%99%EC%9B%90-%ED%95%A9%EA%B2%A9-%ED%9B%84%EA%B8%B0/): 선형대수, 확률통계, 프로그래밍 중심 구술 회고

### Editorial boundary

- 유료 자료, 비공개 자료, 평가위원의 비밀 정보, 원문 장문을 복제하지 않는다.
- 후기 한 건의 질문을 출제 경향으로 일반화하지 않는다.
- 학교명은 source note에만 남기고 앱 문항은 학교 독립적인 `대학원 구술 대비` 콘텐츠로 제공한다.
- 공개 후기 기반 topic도 textbook-level 설명으로 재작성하고 deterministic golden case와 사람 사실 검수를 거친다.

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
- Dataset result: version `1.1.0`, 8개 category, 총 127개 질문 (당시 기준)
- Math coverage: vector·matrix, basis·dimension, orthogonality·projection, rank·null space,
  determinant·inverse·pseudoinverse, eigen·SVD, gradient·Jacobian·Hessian, probability·Bayes,
  covariance·Gaussian, entropy·KL divergence

## source-2026-08-16-graduate-oral-coverage-expansion

- Source: 대학원 구술 커버리지 리뷰(2026-08-16)에서 확인한 공백 — CNN 계열, RNN/LSTM,
  MLE/MAP, 고전 ML 알고리즘(logistic regression, SVM, tree ensemble, kNN), 생성모델(VAE, diffusion)
- Author: Claude(AI candidate)가 작성, 표준 교과 내용 기준. 사람 사실 검수 대기
- Output: `math-mle-map`, `ml-logistic-regression`, `ml-svm-margin-kernel`,
  `ml-tree-bagging-boosting`, `ml-knn-curse-of-dimensionality`,
  `dl-cnn-convolution-parameter-sharing`, `dl-cnn-pooling-receptive-field`,
  `dl-rnn-lstm-gates`, `dl-autoencoder-vae`, `dl-diffusion-model` — 10개 질문과
  질문별 golden case 10개
- 같은 batch에서 기존 문항 정밀도 수정 6건: eigenvector 방향·부호, 연속분포 적분,
  attention mask 큰 음수 표현, FFN SwiGLU 변형 주석, double descent 주석, epoch당 iteration 수
- Dataset result: version `1.2.0`, 8개 category, 총 137개 질문 (당시 기준)

## source-2026-08-17-ai-common-practice-concepts

- Source: 사용자의 에이전트 플랫폼·학습 자료에서 확인한 개념 중 공개 문서로 검증 가능한 일반 지식만 추출
- Author: Claude(AI candidate)가 작성, 표준 문서·교과 수준으로 재작성. 사람 사실 검수 대기
- 검토 문서: `~/IdeaProjects/study/APPS_IN_TOSS_CONTENT_REAL_20260817.md` (앱 반영 후보 25문항)
- 제외 기준: 회사·서비스·프로젝트 식별자, 내부 API 계약, 저장소 키 규칙, 프롬프트 원문,
  위협 탐지 규칙과 임계값, 실측 성능 수치, 인프라 주소, 개인정보 관련 도메인은 반영하지 않는다.
  스트리밍 프로토콜·큐·배포·부하테스트 등 AI 공통 지식이 아닌 실무 문항도 앱에서 제외했다.
- Output: RAG 5문항(비대칭 임베딩, 차원 절단·정규화, 한국어 어휘 검색, 컨텍스트 예산, 인덱스 신선도),
  Agent 7문항(메모리 저장·요약·검색·망각, 도구 결과 예산, 도구 표준 프로토콜, 계단식 라우팅),
  LLM 5문항(구조화 출력, 프롬프트 접두 캐싱, TTFT·TPOT, 프롬프트 규칙 비용, 가드 배치),
  AI System 8문항(오프라인·온라인 평가, LLM-as-judge, 평가 증거, 기준선 게이트, 트레이스 계층,
  프롬프트 버전 관리, 비용 귀속, 임계값 측정) — 질문별 golden case 25개
- Dataset result: version `1.3.0`, 8개 category, 총 162개 질문 (당시 기준)

## source-2026-08-17-notion-ml-dl-study-gap

- Source: 사용자가 붙여넣은 Notion 학습 노트 (8/16 ML 기초, 8/17 DL·Neural Network)
- Read date: 2026-08-17
- 대조 결과: 노트가 다룬 개념(AI/ML/DL 관계, BERT vs GPT, 지도·비지도·자기지도, Feature/Label,
  Train/Validation/Test, Parameter/Hyperparameter, Overfitting/Underfitting, Loss·MSE·MAE·
  Cross Entropy, Gradient·Gradient Descent·Learning Rate, Perceptron·Weight/Bias·Activation,
  Forward/Backpropagation·Chain Rule, SGD/Adam, PyTorch 학습 loop)는 **기존 문항에 모두 존재**해
  중복 추가하지 않았다.
- Author: Claude(AI candidate)가 작성, 표준 교과 수준. 사람 사실 검수 대기
- Output: 노트의 학습 흐름이 끝나는 지점 바로 다음의 공백 12문항
  - DL 7: `dl-early-stopping`, `dl-weight-decay-adamw`, `dl-learning-rate-schedule`,
    `dl-momentum-optimization`, `dl-gradient-clipping`, `dl-representation-learning`,
    `dl-transfer-learning`
  - Math 2: `math-convexity-saddle-point`, `math-central-limit-theorem`
  - ML 3: `ml-feature-scaling`, `ml-data-augmentation`, `ml-dimensionality-reduction-compare`
  - 질문별 golden case 12개
- 근거: 노트가 optimizer를 SGD/Adam 소개까지만 다루고 AdamW·스케줄·momentum·clipping을
  남겨둔 점, "DL은 유용한 표현을 직접 학습"이라는 서술이 표현 학습·전이학습으로 이어지지 않은 점,
  통계와 최적화 이론(중심극한정리, convexity·안장점)이 비어 있던 점
- Dataset result: version `1.4.0`, 8개 category, 총 174개 질문 (당시 기준)

## source-2026-08-17-transformer-paper-and-modern

- Source: 학습 일정의 8/23~27 "Transformer 원서" 구간을 선행 보강. 원 논문(Attention Is All You
  Need, 2017)에서 구술로 자주 묻는 항목과, 원서 이후 표준이 된 현대 구조를 함께 다룬다.
- Author: Claude(AI candidate)가 작성, 논문·공식 문서 수준. 사람 사실 검수 대기
- 중복 회피: √dₖ scaling과 multi-head 표현 부분공간, positional encoding 방식 비교, 제곱 비용,
  RoPE, residual, pre/post-norm, cross-attention, BERT vs GPT는 기존 문항에 이미 존재해 제외했다.
- Output 11문항
  - 원 논문 5: `transformer-layer-complexity-comparison`(층당 복잡도·순차 연산·최대 경로 길이),
    `transformer-padding-mask`, `transformer-weight-tying`, `transformer-label-smoothing`,
    `transformer-dropout-placement`
  - 현대 구조 6: `transformer-gqa-mqa`, `transformer-flash-attention`,
    `transformer-mixture-of-experts`, `transformer-rmsnorm`,
    `transformer-sliding-window-attention`, `llm-scaling-laws`
  - 질문별 golden case 11개
- 서술 원칙: FlashAttention은 근사가 아니라 IO 최적화, sliding window는 결과가 달라지는 근사로
  명확히 구분했다. Scaling law는 특정 조건의 경험 법칙임을 명시했다.
- Dataset result: version `1.5.0`, 8개 category, 총 185개 질문

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

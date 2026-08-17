import type { StudyQuestion } from '../../domain/learning/question'

export const aiSystemRoadmapQuestions = [
  {
    id: 'system-exact-semantic-cache',
    category: 'ai-system',
    difficulty: 'intermediate',
    term: 'Exact Cache · Semantic Cache',
    prompt: 'LLM 서비스에서 Exact Cache와 Semantic Cache는 hit 조건과 위험이 어떻게 다른가요?',
    shortAnswer:
      'Exact cache는 같은 정규화 입력과 설정일 때만 재사용하고, semantic cache는 embedding이 비슷한 질문에도 과거 응답을 재사용합니다. Semantic 방식은 hit를 늘리지만 다른 의도의 답을 잘못 돌려줄 위험이 큽니다.',
    deepAnswer:
      'Model·prompt·retrieval index·권한·locale version을 cache key에 반영하고 TTL과 invalidation을 설계합니다. 개인정보나 사용자별 context가 섞인 응답은 공유 cache에서 분리하며 hit rate뿐 아니라 stale·wrong-hit 품질을 측정합니다.',
    keyPoints: [
      'Cache key에 결과를 바꾸는 version과 권한 포함',
      'Semantic similarity가 task equivalence를 보장하지 않음',
    ],
    followUp: '사내 정책이 바뀐 직후 오래된 RAG 답변 cache를 어떻게 무효화하나요?',
    prerequisites: ['system-latency-cost', 'rag-embedding-model-index'],
  },
  {
    id: 'system-model-routing-fallback',
    category: 'ai-system',
    difficulty: 'advanced',
    term: 'Model Routing · Fallback',
    prompt: '작은 모델과 큰 모델을 Routing할 때 품질과 비용을 어떻게 함께 관리하나요?',
    shortAnswer:
      '간단하고 저위험한 요청은 작은 모델로, 복잡하거나 confidence가 낮은 요청은 큰 모델이나 사람에게 보냅니다. Router 자체의 오분류가 전체 품질을 해치므로 task별 성공률과 비용을 함께 평가합니다.',
    deepAnswer:
      'Fallback은 timeout, rate limit, 품질 검증 실패별로 다르게 설계하고 model마다 prompt와 output contract 호환성을 확인합니다. 큰 모델을 정답처럼 사용하지 말고 사람이 검수한 routing dataset과 online outcome으로 threshold를 조정합니다.',
    keyPoints: ['Task 난이도·위험에 따라 model 선택', 'Router 오류와 fallback 품질을 별도 측정'],
    followUp:
      '작은 모델이 자신 있게 틀리는 경우 confidence routing만으로 부족한 이유는 무엇인가요?',
    prerequisites: ['system-latency-cost', 'ml-probability-calibration'],
  },
  {
    id: 'system-batching-throughput',
    category: 'ai-system',
    difficulty: 'advanced',
    term: 'Batching · Throughput · Tail Latency',
    prompt:
      'LLM Serving에서 Batching이 throughput을 높이지만 latency를 늘릴 수 있는 이유는 무엇인가요?',
    shortAnswer:
      '여러 요청을 묶으면 GPU 병렬성을 높여 단위 시간당 token을 더 처리할 수 있습니다. 하지만 batch를 모으는 대기와 긴 sequence에 맞춘 처리 때문에 개별 요청, 특히 tail latency가 늘 수 있습니다.',
    deepAnswer:
      'Continuous batching은 decode 중인 batch에 새 요청을 동적으로 넣어 활용도를 높입니다. Prompt 길이와 생성 길이가 다양한 workload에서 평균만 보지 말고 p95·p99, time to first token, tokens per second, memory를 함께 측정합니다.',
    keyPoints: [
      'Batching은 hardware utilization과 throughput 개선',
      'Queue 대기와 길이 편차가 tail latency 증가',
    ],
    followUp: '평균 latency는 그대로인데 p99가 크게 나빠졌다면 사용자는 어떤 문제를 겪나요?',
    prerequisites: ['system-latency-cost', 'llm-kv-cache-prefill-decode'],
  },
  {
    id: 'system-rate-limit-backpressure',
    category: 'ai-system',
    difficulty: 'advanced',
    term: 'Rate Limit · Backpressure · Load Shedding',
    prompt:
      'AI API가 감당할 수 없는 요청을 받을 때 Backpressure와 Load Shedding이 필요한 이유는 무엇인가요?',
    shortAnswer:
      '무제한 queue는 대기시간과 memory를 계속 늘려 결국 전체 장애를 만듭니다. 사용자·tenant별 rate limit, bounded queue, concurrency limit으로 부하를 전달하고 저우선 요청을 빠르게 거절해야 핵심 요청을 보호할 수 있습니다.',
    deepAnswer:
      '429와 Retry-After 같은 명확한 contract를 제공하고 client retry에는 jitter를 넣어 재시도 폭주를 막습니다. Token 수와 tool 비용처럼 요청별 무게가 다르므로 단순 request count 외에 동시 실행과 비용 quota도 고려합니다.',
    keyPoints: ['Bounded resource로 overload를 격리', '빠른 거절이 무한 대기보다 복구에 유리'],
    followUp: '모든 client가 같은 간격으로 즉시 재시도하면 어떤 현상이 생기나요?',
    prerequisites: ['system-latency-cost', 'agent-timeout-retry-idempotency'],
  },
  {
    id: 'system-versioned-trace-reproducibility',
    category: 'ai-system',
    difficulty: 'advanced',
    term: 'Experiment Fingerprint · Trace Replay',
    prompt: 'AI 응답을 재현하려면 Trace에 어떤 Version과 실행 정보를 남겨야 하나요?',
    shortAnswer:
      'Model, prompt, parameter, tool schema, retrieval index와 dataset version, 입력 식별자, 실행 단계와 결과를 연결해야 합니다. 비결정적 sampling이면 seed와 반복 trial도 함께 기록합니다.',
    deepAnswer:
      '원문 개인정보를 무조건 저장하지 않고 hash, redaction, 접근 통제와 보존 기간을 적용합니다. Trace replay로 변경 전후를 같은 입력에 실행하고 fingerprint로 실험 구성을 고정해야 원인과 회귀를 설명할 수 있습니다.',
    keyPoints: [
      'Model부터 data·tool까지 전체 configuration version 기록',
      'Trace 재현성과 개인정보 최소화를 함께 설계',
    ],
    followUp: '같은 prompt인데 결과가 달라졌다면 어떤 version부터 비교하나요?',
    prerequisites: ['system-evaluation-observability', 'llm-temperature-top-p'],
  },
  {
    id: 'system-privacy-telemetry',
    category: 'ai-system',
    difficulty: 'advanced',
    term: 'PII Redaction · Telemetry Retention',
    prompt: 'LLM Prompt와 Tool Trace를 관측성 목적으로 전부 저장하면 왜 위험한가요?',
    shortAnswer:
      'Prompt에는 이름, 연락처, 회사 기밀, 인증정보가 들어갈 수 있고 tool 결과에는 더 민감한 정보가 포함될 수 있습니다. 목적에 필요한 최소 field만 수집하고 전송 전 redaction과 보존 기간을 적용해야 합니다.',
    deepAnswer:
      'Access control, encryption, tenant 분리, 삭제 요청과 incident audit를 설계하고 error message에도 원문이 섞이지 않게 합니다. Debug 편의와 privacy를 trade-off로만 보지 말고 synthetic replay와 구조화된 안전 지표로 대체할 수 있습니다.',
    keyPoints: [
      '관측성 데이터도 민감한 production data',
      '수집 최소화·redaction·retention·access control 필요',
    ],
    followUp:
      'Sentry 같은 오류 추적 도구에 free-text 목표를 보내지 않으려면 어디서 scrub해야 하나요?',
    prerequisites: ['system-evaluation-observability'],
  },
  {
    id: 'system-project-evaluation-defense',
    category: 'ai-system',
    difficulty: 'advanced',
    term: 'Project Evaluation · Oral Defense',
    prompt:
      '구술에서 “프로젝트 성능을 어떻게 평가했나”라는 질문에 Accuracy 하나보다 무엇을 답해야 하나요?',
    shortAnswer:
      '사용자 task의 성공 기준과 baseline을 먼저 정의하고 offline golden set, component metric, end-to-end 성공률, latency·cost·안전 지표를 함께 말합니다. 실패 유형과 개선 전후 수치도 포함합니다.',
    deepAnswer:
      'Dataset 출처와 split, 대표성, 반복 trial, version을 설명하고 online feedback이 실제 목표와 어떻게 연결되는지 말해야 합니다. 좋은 결과만 제시하지 않고 한계와 다음 falsifiable experiment를 제시하면 연구·운영 사고를 보여줄 수 있습니다.',
    keyPoints: ['문제 목표와 baseline에 연결된 다차원 평가', '실패·한계·다음 검증 실험까지 설명'],
    followUp: 'Offline 점수는 올랐는데 사용자 완료율이 떨어졌다면 무엇을 의심하나요?',
    prerequisites: ['system-evaluation-observability', 'rag-failure-diagnosis'],
  },
  {
    id: 'system-offline-online-eval',
    category: 'ai-system',
    difficulty: 'intermediate',
    term: 'Offline Eval · Online Eval',
    prompt: '오프라인 평가와 온라인 평가는 각각 무엇을 확인하고 왜 둘 다 필요한가요?',
    shortAnswer:
      '오프라인 평가는 고정된 데이터셋에서 배포 전에 회귀를 잡고, 온라인 평가는 실제 사용자 트래픽에서 진짜 목표가 달성되는지 봅니다. 오프라인 점수가 올라도 실제 사용자 성공률은 떨어질 수 있어 둘을 연결해야 합니다.',
    deepAnswer:
      '오프라인 데이터셋은 만든 시점의 사용 패턴을 반영하므로 시간이 지나면 실제 트래픽과 어긋납니다. 그래서 온라인에서 관찰된 실패 사례를 다시 오프라인 데이터셋에 넣는 순환이 중요합니다. 온라인 지표는 사용자 만족을 직접 재기 어려워 완료율, 재질문율, 이탈처럼 간접 지표를 조합해 해석하며, 단일 지표만 보면 왜곡되기 쉽습니다.',
    keyPoints: [
      '오프라인은 회귀 방지, 온라인은 실제 목표 달성 확인',
      '온라인 실패를 오프라인 세트로 되먹이는 순환이 핵심',
    ],
    followUp: '오프라인 점수와 온라인 지표가 반대로 움직이면 무엇을 의심하나요?',
    prerequisites: ['system-evaluation-observability', 'rag-answer-evaluation'],
  },
  {
    id: 'system-llm-as-judge',
    category: 'ai-system',
    difficulty: 'advanced',
    term: 'LLM-as-Judge',
    prompt: 'LLM에게 다른 LLM의 답을 채점시키는 방식의 장점과 한계는 무엇인가요?',
    shortAnswer:
      '사람 채점보다 빠르고 저렴해 대량 평가가 가능하고, 정답이 하나로 정해지지 않는 답변 품질을 다룰 수 있습니다. 다만 긴 답변이나 앞에 놓인 답변을 선호하는 편향이 보고되고, 자기 스타일과 비슷한 답을 후하게 주는 경향도 있습니다.',
    deepAnswer:
      '채점 기준을 문장으로만 주면 일관성이 낮으므로, 항목별 채점 기준과 예시를 제시하고 점수를 매기기 전에 근거를 먼저 쓰게 하는 편이 안정적입니다. 무엇보다 사람 라벨 일부와 대조해 채점자 자체의 정확도를 먼저 검증해야 하며, 이 검증 없이 나온 점수는 근거가 약합니다. 두 답 중 하나를 고르는 비교 방식이 절대 점수보다 안정적인 경우가 많지만, 모든 쌍을 비교하면 횟수가 후보 수의 제곱으로 늘고 절대 점수에는 없던 순서 편향이 새로 생기므로, 순서를 바꿔 두 번 묻고 평균 내는 처리가 사실상 필수입니다.',
    keyPoints: [
      '확장성은 크지만 길이·순서·스타일 편향이 존재',
      '사람 라벨로 채점자 자체를 먼저 검증해야 함',
    ],
    followUp: '채점 모델과 답변 생성 모델이 같으면 어떤 문제가 생길 수 있나요?',
    prerequisites: ['rag-answer-evaluation', 'ml-loss-vs-metric'],
  },
  {
    id: 'system-eval-evidence-vs-run',
    category: 'ai-system',
    difficulty: 'advanced',
    term: 'Evaluation Evidence',
    prompt: '평가 스크립트가 통과했다는 것이 곧 품질이 검증됐다는 뜻이 아닌 이유는 무엇인가요?',
    shortAnswer:
      '스크립트가 실제 모델을 호출하지 않고 형식만 검사했다면, 채점 코드가 동작한다는 것만 증명됩니다. 품질 증거는 모델을 실제로 호출한 실행 결과나 실제 응답에 대한 사람 검토에서 나옵니다.',
    deepAnswer:
      '빠르고 무료라서 자주 도는 검사는 대개 형식 검사이고, 실제 호출 평가는 느리고 비싸서 자주 돌기 어렵다는 구조적 차이가 이 착각을 만듭니다. 그래서 두 종류를 이름부터 구분하고, 배포 승인에는 실제 실행 결과를 요구하는 편이 안전합니다. 통과한 항목이 무엇을 검사했는지 평가 항목별로 보고하지 않으면, 검사하지 않은 영역까지 검증된 것으로 착각하게 됩니다.',
    keyPoints: [
      '형식 검사와 실제 호출 평가는 증명하는 것이 다름',
      '무엇을 검사하지 않았는지도 함께 보고해야 함',
    ],
    followUp: '평가가 100% 통과했는데 사용자 불만이 늘었다면 무엇을 먼저 의심하나요?',
    prerequisites: ['system-offline-online-eval'],
  },
  {
    id: 'system-eval-baseline-gate',
    category: 'ai-system',
    difficulty: 'intermediate',
    term: 'Baseline · Regression Gate',
    prompt: '평가 결과의 기준선을 저장해두고 매번 비교하면 무엇이 달라지나요?',
    shortAnswer:
      '이번 변경이 이전보다 나빠졌는지를 자동으로 판정할 수 있고, 기준선이 바뀌는 것 자체가 검토 대상이 됩니다. 점수가 조금씩 떨어지는 변화도 누적되기 전에 걸러집니다.',
    deepAnswer:
      'LLM 응답은 매번 달라 소폭 변동이 정상이므로 허용 범위를 정해야 하며, 너무 좁으면 매번 실패해 무시하게 되고 너무 넓으면 실제 하락을 놓칩니다. 기준선을 쉽게 갱신할 수 있으면 나빠진 결과를 새 기준으로 덮어버리는 일이 생기므로 갱신에는 이유 설명을 요구하는 편이 좋습니다. 전체 평균만 게이트로 쓰면 특정 유형만 무너지는 것을 놓치므로 유형별로도 봐야 합니다.',
    keyPoints: [
      'LLM 응답은 본래 변동하므로 허용 범위 없이는 게이트가 성립하지 않음',
      '기준선 갱신에 이유를 요구해야 하락을 덮어쓰지 않음',
    ],
    followUp: '기준선을 갱신해야 할 정당한 경우와 그렇지 않은 경우는 어떻게 구분하나요?',
    prerequisites: ['system-offline-online-eval'],
  },
  {
    id: 'system-trace-span-generation',
    category: 'ai-system',
    difficulty: 'intermediate',
    term: 'Trace · Span · Generation',
    prompt: 'LLM 앱의 실행 기록에서 트레이스, 스팬, 생성 기록은 각각 무엇을 담나요?',
    shortAnswer:
      '트레이스는 사용자 요청 하나의 전체 흐름이고, 스팬은 그 안의 검색·도구 호출 같은 개별 단계입니다. 생성 기록은 실제 모델 호출로 입력·출력·모델명·토큰 사용량처럼 비용과 품질을 분석할 정보를 담습니다.',
    deepAnswer:
      '계층 구조로 남겨야 느린 요청의 어느 단계가 느렸는지, 비싼 요청이 어떤 호출 때문이었는지를 나눠 볼 수 있습니다. 트레이스와 스팬은 분산 추적의 일반 개념이고, 모델 호출을 따로 구분해 부르는 이름은 도구마다 다르므로 용어보다 무엇을 남기는지가 중요합니다. 로그를 문자열로만 남기면 집계가 불가능하므로 단계 이름, 입력·출력, 지연, 토큰 수를 구조화해 남기고, 대화 식별자를 붙이되 개인정보는 그대로 저장되지 않게 가공해야 합니다.',
    keyPoints: [
      '요청, 단계, 모델 호출의 계층으로 원인 분리',
      '구조화 없이 문자열 로그만 남기면 집계·비교가 불가능',
    ],
    followUp: '평균 응답 시간은 정상인데 일부 사용자만 느리다면 무엇부터 확인하나요?',
    prerequisites: ['system-evaluation-observability'],
  },
  {
    id: 'system-prompt-versioning',
    category: 'ai-system',
    difficulty: 'intermediate',
    term: 'Prompt Versioning',
    prompt: '프롬프트를 코드에 하드코딩하지 않고 버전 관리하면 무엇이 좋아지나요?',
    shortAnswer:
      '어떤 프롬프트로 만든 응답인지 기록에 남아 품질 변화의 원인을 추적할 수 있습니다. 나빠지면 이전 버전으로 되돌리거나 두 버전을 비교 실험하기도 쉬워집니다.',
    deepAnswer:
      '단, 프롬프트는 모델과 함께 동작하므로 프롬프트만 버전 관리하고 모델·파라미터를 기록하지 않으면 재현이 안 됩니다. 배포 없이 바꿀 수 있다는 것은 검토 없이 운영이 바뀔 수 있다는 뜻이기도 해서 변경 이력과 승인 절차가 오히려 더 필요합니다. 프롬프트 변경은 눈으로 보고 좋아 보이는 것과 실제 지표가 다른 경우가 많아 고정된 평가 세트와 함께 가야 합니다.',
    keyPoints: [
      '응답과 프롬프트 버전을 묶어야 원인 추적과 되돌리기가 가능',
      '모델·파라미터를 함께 기록하지 않으면 재현되지 않음',
    ],
    followUp: '프롬프트를 바꿨더니 특정 유형 질문만 나빠졌다면 어떻게 확인하나요?',
    prerequisites: ['system-versioned-trace-reproducibility'],
  },
  {
    id: 'system-cost-attribution',
    category: 'ai-system',
    difficulty: 'intermediate',
    term: 'Cost Attribution',
    prompt: 'LLM 서비스의 비용을 총액이 아니라 어떤 단위로 쪼개 봐야 하나요?',
    shortAnswer:
      '요청 하나, 기능 하나, 사용자 한 명처럼 의사결정을 내릴 수 있는 단위로 나눠 봐야 합니다. 총 비용만 보면 어떤 기능이 비용을 끌어올리는지 알 수 없어 최적화 대상을 고를 수 없습니다.',
    deepAnswer:
      '입력 토큰과 출력 토큰은 단가가 다르고 캐시 적중 여부에 따라서도 달라지므로 분리해 기록해야 합니다. 특히 모델이 내부적으로 생각하는 데 쓰는 토큰은 사용자에게 보이지 않으면서 출력 단가로 과금되어 예상 밖 비용의 주범이 되기 쉽습니다. 평균만 보면 소수의 아주 비싼 요청을 놓치기 쉬워 분포와 상위 구간을 함께 봐야 하고, 비용과 품질을 같은 화면에서 보지 않으면 비용을 줄이다 품질이 무너지는 것을 놓칩니다.',
    keyPoints: ['의사결정 가능한 단위로 비용을 분해', '평균이 아니라 분포와 상위 구간을 확인'],
    followUp: '비용을 절반으로 줄였는데 사용자 만족도가 떨어졌다면 무엇을 잘못 본 것인가요?',
    prerequisites: ['system-latency-cost'],
  },
  {
    id: 'system-threshold-tuning-data',
    category: 'ai-system',
    difficulty: 'intermediate',
    term: 'Threshold Tuning · Sweep',
    prompt: '유사도나 확신도의 임계값을 정할 때 감으로 정하면 안 되는 이유는 무엇인가요?',
    shortAnswer:
      '임계값 하나가 놓치는 비율과 잘못 잡는 비율을 동시에 결정하기 때문입니다. 라벨이 붙은 표본에서 값을 조금씩 바꿔가며 두 오류가 어떻게 움직이는지 재보고, 어느 쪽 비용이 큰지에 따라 골라야 합니다.',
    deepAnswer:
      '모델마다 유사도 점수가 몰리는 구간이 달라 남이 쓰는 숫자는 그대로 옮겨지지 않습니다. 또 임계값은 모델이나 임베딩을 교체하면 점수 분포 자체가 달라져 함께 무효가 되므로, 모델을 바꿀 때 다시 측정해야 하는 값으로 관리해야 합니다. 임계값을 고른 표본과 성능을 확인하는 표본은 분리해야 그 표본에만 맞는 값을 고르는 과적합을 피할 수 있습니다.',
    keyPoints: [
      '임계값은 놓침과 오탐을 맞바꾸는 지점이라 측정이 필요',
      '모델·임베딩을 바꾸면 임계값도 다시 정해야 함',
    ],
    followUp: '모델을 새 버전으로 교체했는데 기존 임계값을 그대로 두면 무엇이 달라질 수 있나요?',
    prerequisites: ['ml-confusion-matrix-threshold', 'system-offline-online-eval'],
  },
  {
    id: 'system-llm-service-difference',
    category: 'ai-system',
    difficulty: 'foundation',
    term: 'LLM Service · Design Difference',
    prompt: 'LLM을 쓰는 기능은 일반적인 API 기능과 무엇이 구조적으로 다른가요?',
    shortAnswer:
      '응답이 초 단위로 느리고, 같은 입력에도 매번 다른 답이 나올 수 있으며, 요청마다 비용이 달라집니다. 그래서 기다리게 하지 않는 화면 설계, 결과가 흔들린다는 전제의 검증, 요청 단위 비용 관리가 처음부터 필요합니다.',
    deepAnswer:
      '일반 API는 빠르고 같은 입력에 같은 출력을 주며 요청당 비용이 거의 일정해서, 성공 여부만 보면 대체로 충분합니다. LLM 기능은 HTTP 200이어도 내용이 틀릴 수 있어 성공률과 품질을 따로 봐야 합니다. 비용은 입력 길이에 비례하는데, 멀티턴에서는 매 턴 이전 대화를 다시 보내므로 대화가 길어질수록 누적 요금이 턴 수에 비례 이상으로 커집니다. 실패도 예외가 아니라 일상이라 대체 응답이나 기권 경로를 기본값으로 준비해야 합니다.',
    keyPoints: ['느림·비결정성·가변 비용이라는 세 가지 차이', 'HTTP 성공과 답이 맞다는 것은 별개'],
    followUp: '응답이 몇 초 걸린다는 사실은 화면 설계를 어떻게 바꾸나요?',
    prerequisites: [],
  },
  {
    id: 'system-token-cost-latency-unit',
    category: 'ai-system',
    difficulty: 'foundation',
    term: 'Token · Cost and Latency Unit',
    prompt: 'LLM 서비스에서 토큰이 왜 비용과 시간을 함께 재는 단위가 되나요?',
    shortAnswer:
      '모델은 토큰 단위로 입력을 읽고 토큰 단위로 답을 만들기 때문에, 토큰 수가 요금과 처리 시간을 동시에 결정합니다. 그래서 프롬프트를 줄이거나 답변 길이를 제한하는 것이 비용 절감이자 속도 개선이 됩니다.',
    deepAnswer:
      '입력 토큰과 출력 토큰은 성격이 달라 단가도 보통 다르고, 출력은 하나씩 순서대로 만들어지므로 길이가 늘수록 지연이 거의 비례해 커집니다. 반면 입력은 한 번에 처리돼 같은 토큰 수라도 시간에 미치는 영향이 다릅니다. 한글은 같은 의미라도 영어보다 토큰 수가 더 나올 수 있어 글자 수로 비용을 어림하면 어긋납니다.',
    keyPoints: [
      '토큰이 요금과 처리 시간을 함께 결정하는 공통 단위',
      '입력과 출력은 단가도 지연에 미치는 영향도 다름',
    ],
    followUp: '답변 최대 길이를 절반으로 줄이면 비용과 지연 중 어느 쪽이 더 크게 줄어드나요?',
    prerequisites: ['llm-tokenization-context-window'],
  },
  {
    id: 'system-nondeterminism-testing',
    category: 'ai-system',
    difficulty: 'foundation',
    term: 'Non-Determinism · Testing Strategy',
    prompt: '같은 입력에 매번 다른 답이 나오는 기능은 어떻게 테스트하나요?',
    shortAnswer:
      '기대 문장과 정확히 같은지 비교하는 방식은 쓸 수 없으므로, 반드시 포함해야 할 내용과 절대 나오면 안 되는 내용, 형식과 길이 같은 성질을 검사합니다. 한 번의 결과로 판단하지 않고 여러 번 실행한 통과 비율로 봅니다.',
    deepAnswer:
      '무작위성을 없애는 설정을 써도 완전히 같은 출력이 보장되지는 않는데, 계산 순서나 실행 환경, 모델 버전 갱신에 따라 결과가 미세하게 달라질 수 있기 때문입니다. 그래서 테스트를 통과·실패의 이분법보다 통과율과 허용 범위로 다루고, 실패한 사례는 지우지 말고 검사 사례로 모아둡니다. 결정론적으로 만들 수 있는 부분은 코드로 고정해 검사할 표면을 줄이는 것도 중요한 전략입니다.',
    keyPoints: [
      '정확 일치 대신 필수·금지 내용과 형식을 검사',
      '무작위성을 꺼도 완전한 재현은 보장되지 않음',
    ],
    followUp: '테스트가 열 번 중 아홉 번 통과한다면 이 기능은 통과인가요, 실패인가요?',
    prerequisites: ['llm-temperature-top-p'],
  },
] as const satisfies readonly StudyQuestion[]

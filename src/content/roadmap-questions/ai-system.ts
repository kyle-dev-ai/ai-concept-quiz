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
] as const satisfies readonly StudyQuestion[]

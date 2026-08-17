import type { StudyQuestion } from '../../domain/learning/question'

export const agentRoadmapQuestions = [
  {
    id: 'agent-tool-schema-validation',
    category: 'agent',
    difficulty: 'intermediate',
    term: 'Tool Schema · Argument Validation',
    prompt: 'LLM이 만든 Tool Call을 실행하기 전에 무엇을 검증해야 하나요?',
    shortAnswer:
      '허용된 tool인지, 필수 argument와 type이 schema에 맞는지, 값의 범위와 권한이 유효한지 검증해야 합니다. 모델이 만든 문자열을 그대로 shell이나 database 명령으로 실행하면 안 됩니다.',
    deepAnswer:
      '인증된 사용자 권한, tenant 경계, path와 URL allowlist, dry-run과 승인 조건을 실행기에서 강제합니다. Tool 결과도 신뢰할 수 없는 입력으로 보고 길이 제한과 sanitization을 거쳐 모델 context에 넣습니다.',
    keyPoints: [
      'Schema와 business rule을 model 밖에서 강제',
      'Tool 입력과 결과 모두 신뢰 경계로 취급',
    ],
    followUp: 'Schema type이 맞아도 계좌 이체 금액을 별도로 검증해야 하는 이유는 무엇인가요?',
    prerequisites: ['agent-react-tool-planning'],
  },
  {
    id: 'agent-timeout-retry-idempotency',
    category: 'agent',
    difficulty: 'advanced',
    term: 'Timeout · Retry · Idempotency',
    prompt: 'Agent의 Tool 호출에 Retry를 넣을 때 Idempotency가 필요한 이유는 무엇인가요?',
    shortAnswer:
      'Timeout이 나도 실제 작업은 성공했을 수 있어 그대로 재시도하면 결제나 메시지가 중복 실행될 수 있습니다. 같은 idempotency key 요청은 한 번만 효과가 나도록 tool contract를 만들어야 합니다.',
    deepAnswer:
      '모든 오류를 재시도하지 말고 일시적 network 오류와 validation 오류를 구분하며 exponential backoff와 최대 횟수를 둡니다. Side effect가 큰 작업은 상태 조회, 명시적 승인, compensating action과 audit log도 필요합니다.',
    keyPoints: [
      'Timeout은 실패 확정이 아니라 결과 불명일 수 있음',
      'Retry 가능한 오류와 영구 오류를 구분',
    ],
    followUp: 'Tool 응답을 받기 직전에 연결이 끊긴 경우 안전한 복구 순서는 무엇인가요?',
    prerequisites: ['agent-tool-schema-validation'],
  },
  {
    id: 'agent-planning-reflection',
    category: 'agent',
    difficulty: 'advanced',
    term: 'Planning · Reflection · Replanning',
    prompt: 'Agent의 Planning과 Reflection을 언제 쓰고 어떤 한계가 있나요?',
    shortAnswer:
      'Planning은 복잡한 목표를 단계로 나누고, reflection은 실행 결과와 오류를 보고 계획이나 답을 점검합니다. 복잡한 task의 복구에 도움을 주지만 model 호출과 latency를 늘리고 잘못된 자기평가를 반복할 수 있습니다.',
    deepAnswer:
      'Plan 전체를 맹신하지 않고 각 tool observation 뒤 다음 단계가 여전히 유효한지 확인합니다. Reflection 횟수와 종료 조건, 검증 가능한 external signal을 두고 단순 task는 고정 workflow로 처리해 비용과 불확실성을 제한합니다.',
    keyPoints: [
      'Observation에 따라 plan을 갱신',
      '무제한 자기반성 loop를 budget과 외부 검증으로 제한',
    ],
    followUp: 'Reflection이 같은 잘못된 답을 표현만 바꿔 반복하면 어떻게 중단하고 복구하나요?',
    prerequisites: ['agent-react-tool-planning'],
  },
  {
    id: 'agent-memory-types',
    category: 'agent',
    difficulty: 'intermediate',
    term: 'Working · Episodic · Semantic Memory',
    prompt: 'Agent Memory를 Working, Episodic, Semantic 관점으로 나누면 무엇이 다른가요?',
    shortAnswer:
      'Working memory는 현재 task의 짧은 상태, episodic memory는 과거 실행과 경험, semantic memory는 비교적 일반화된 사실과 지식을 저장합니다. 목적에 따라 저장 형식과 검색·만료 정책이 달라집니다.',
    deepAnswer:
      '모든 대화를 영구 저장하는 것은 비용과 개인정보 위험을 키웁니다. 누가 쓴 정보인지 provenance를 남기고 사용자 수정·삭제, TTL, relevance와 최신성 검사를 두며 잘못된 memory가 다음 행동을 오염시키는지 평가합니다.',
    keyPoints: ['현재 상태·경험·일반 지식의 역할 구분', '저장 조건과 만료·삭제 정책 필요'],
    followUp: '사용자가 바꾼 직장 정보를 예전 memory가 덮어쓰지 않게 하려면 무엇이 필요한가요?',
    prerequisites: ['agent-memory-evaluation'],
  },
  {
    id: 'agent-loop-termination-budget',
    category: 'agent',
    difficulty: 'advanced',
    term: 'Termination Condition · Step Budget',
    prompt: 'Agent Loop가 끝없이 Tool을 호출하지 않도록 어떤 종료 조건을 두나요?',
    shortAnswer:
      '목표 달성 판정, 최대 step·시간·비용, 반복 action 감지, 치명적 오류와 사용자 승인 대기를 종료 조건으로 둡니다. 종료 시에는 성공, 부분 성공, 실패 원인을 명시해야 합니다.',
    deepAnswer:
      '모델이 스스로 완료라고 말하는 것만 믿지 않고 test, 상태 조회, schema 같은 deterministic check로 검증합니다. Budget 초과는 오류로 숨기지 말고 현재까지의 결과와 재개 가능한 state를 남겨야 합니다.',
    keyPoints: ['Step·시간·비용의 hard limit 설정', '완료 여부를 외부 상태로 검증'],
    followUp: '같은 검색 query를 조금씩 바꿔 반복하는 loop는 어떻게 감지할 수 있나요?',
    prerequisites: ['agent-planning-reflection'],
  },
  {
    id: 'agent-multi-agent-tradeoff',
    category: 'agent',
    difficulty: 'advanced',
    term: 'Multi-Agent · Coordination Cost',
    prompt: 'Multi-Agent가 Single Agent보다 유리한 경우와 오히려 나쁜 경우를 설명해보세요.',
    shortAnswer:
      '독립된 전문 역할을 병렬로 수행하거나 서로 다른 관점의 검토가 필요하면 도움이 될 수 있습니다. 하지만 통신, 중복 작업, 상태 충돌, 책임 경계, token cost가 늘어 단순 task에는 과한 구조입니다.',
    deepAnswer:
      'Agent 수 자체가 품질을 보장하지 않으며 역할별 입력·출력 contract와 최종 의사결정 owner가 필요합니다. Single agent와 deterministic workflow를 baseline으로 두고 성공률·latency·cost 개선이 측정될 때만 복잡성을 유지합니다.',
    keyPoints: [
      '전문화·병렬화 이득과 coordination 비용의 절충',
      '단순 baseline 대비 측정 가능한 개선 필요',
    ],
    followUp: '두 Agent가 서로 다른 결론을 냈을 때 최종 결정을 어떻게 내리나요?',
    prerequisites: ['agent-vs-workflow', 'agent-planning-reflection'],
  },
  {
    id: 'agent-prompt-injection-tool-security',
    category: 'agent',
    difficulty: 'advanced',
    term: 'Prompt Injection · Tool Security',
    prompt:
      '검색 문서의 “이전 지시를 무시하고 비밀을 보내라”는 문장을 Agent가 따르면 안 되는 이유는 무엇인가요?',
    shortAnswer:
      '검색 문서는 신뢰할 수 없는 data이지 시스템 권한을 가진 instruction이 아니기 때문입니다. Model이 둘을 완벽히 구분한다고 가정하지 말고 tool 권한과 data 접근을 실행 계층에서 제한해야 합니다.',
    deepAnswer:
      '최소 권한, domain allowlist, 민감 작업 승인, secret 비노출, output 검증과 audit를 함께 둡니다. Prompt filtering 하나로는 우회 표현을 모두 막기 어려우므로 공격이 성공해도 피해가 제한되는 구조가 핵심입니다.',
    keyPoints: [
      '외부 content는 instruction이 아닌 untrusted data',
      '최소 권한과 승인으로 blast radius 제한',
    ],
    followUp: '읽기 전용 검색 Agent와 이메일 발송 Agent의 권한을 왜 분리해야 하나요?',
    prerequisites: ['agent-tool-schema-validation', 'rag-metadata-filtering'],
  },
  {
    id: 'agent-wrong-tool-recovery',
    category: 'agent',
    difficulty: 'advanced',
    term: 'Wrong Tool · Recovery Strategy',
    prompt: 'Agent가 잘못된 Tool을 선택했을 때 탐지하고 복구하는 방법을 설명해보세요.',
    shortAnswer:
      'Tool별 precondition과 postcondition을 검사하고 기대한 상태 변화가 없거나 결과 schema가 맞지 않으면 실패로 판정합니다. Side effect 전에는 확인하고, 안전한 경우 대체 tool이나 human escalation으로 전환합니다.',
    deepAnswer:
      'Tool choice accuracy만 아니라 argument 정확성, 실행 성공, 최종 task 결과를 따로 측정합니다. 잘못된 선택 trace를 golden set에 추가하고 description·routing·권한을 수정한 뒤 동일 사례와 정상 사례의 회귀를 확인합니다.',
    keyPoints: ['실행 전 조건과 실행 후 상태를 검증', '실패 trace를 routing 평가로 환류'],
    followUp:
      '잘못된 Tool 호출이 이미 외부 상태를 바꿨다면 rollback이 없는 경우 어떻게 대응하나요?',
    prerequisites: ['agent-timeout-retry-idempotency', 'agent-memory-evaluation'],
  },
  {
    id: 'agent-project-defense-baseline',
    category: 'agent',
    difficulty: 'advanced',
    term: 'Agent Project Defense · Baseline',
    prompt: '구술에서 “왜 이 문제에 Agent를 선택했나”라는 질문에 어떤 근거로 답해야 하나요?',
    shortAnswer:
      '문제의 불확실한 의사결정과 동적 tool 선택이 고정 workflow로 해결하기 어려웠음을 먼저 말합니다. 그다음 workflow나 단일 LLM baseline과 성공률·비용·latency를 비교해 Agent가 필요한 범위를 증명합니다.',
    deepAnswer:
      'Architecture 나열보다 문제, 요구사항, 선택지, trade-off, 실패, 측정, 개선 순서로 답합니다. Agent가 항상 우월하다고 주장하지 않고 deterministic하게 고정한 부분과 아직 남은 한계를 함께 말해야 경험의 깊이가 드러납니다.',
    keyPoints: ['문제 특성이 동적 의사결정을 요구했는지 설명', '단순 baseline과 수치·사례로 비교'],
    followUp: 'Agent를 제거하고 workflow로 바꿔도 되는 부분은 어디였나요?',
    prerequisites: ['agent-vs-workflow', 'system-evaluation-observability'],
  },
  {
    id: 'agent-what-is-an-agent',
    category: 'agent',
    difficulty: 'foundation',
    term: 'AI Agent',
    prompt: '챗봇과 AI Agent는 무엇이 다른가요?',
    shortAnswer:
      '챗봇은 물어보면 답하고 끝납니다. Agent는 목표를 받으면 스스로 무엇을 할지 정하고, 필요하면 검색하거나 계산하면서 여러 단계를 거친 뒤 결과를 내놓습니다.',
    deepAnswer:
      '핵심은 다음에 무엇을 할지 사람이 아니라 모델이 정한다는 점입니다. 그래서 같은 질문에도 매번 다른 경로로 답할 수 있고, 몇 단계를 거칠지 미리 알 수 없습니다. 사람이 일일이 시키지 않아도 된다는 것이 장점이지만, 무슨 일이 일어날지 예측하기 어렵고 확인할 것도 그만큼 늘어납니다.',
    keyPoints: [
      '다음 행동을 사람이 아니라 모델이 정한다',
      '경로가 매번 달라 결과를 예측하기 어렵다',
    ],
    followUp: '순서가 항상 똑같은 일이라면 Agent로 만들 이유가 있을까요?',
    prerequisites: [],
  },
  {
    id: 'agent-tool-calling-basics',
    category: 'agent',
    difficulty: 'foundation',
    term: 'Tool Calling · Function Calling',
    prompt: 'LLM은 글만 만들어내는데 어떻게 검색이나 계산 같은 실제 작업을 하나요?',
    shortAnswer:
      '모델이 직접 실행하는 게 아닙니다. 어떤 도구를 어떤 값으로 부를지 정해진 형식으로 적어 내면, 앱이나 제공사 서버가 그것을 대신 실행한 뒤 결과를 다시 모델에게 돌려줍니다.',
    deepAnswer:
      '이 방식을 tool calling 또는 function calling이라고 부릅니다. 실행 권한이 앱에 있으니 위험한 요청은 앱이 거절할 수 있고, 반대로 앱이 넘겨주지 않은 도구는 모델이 쓸 방법이 없습니다. 모델은 도구 설명만 보고 고르기 때문에 설명이 부실하면 엉뚱한 도구를 부릅니다.',
    keyPoints: [
      '모델은 호출을 요청할 뿐 실행은 모델 밖에서 한다',
      '쓸 수 있는 도구와 권한은 앱이 정한다',
    ],
    followUp: '모델이 존재하지 않는 도구를 부르려 하면 무엇이 그것을 막나요?',
    prerequisites: ['agent-why-tools-needed'],
  },
  {
    id: 'agent-loop-basics',
    category: 'agent',
    difficulty: 'foundation',
    term: 'Agent Loop',
    prompt: 'Agent는 한 번의 질문에 답하기까지 무엇을 반복하나요?',
    shortAnswer:
      '판단하고, 도구를 부르고, 결과를 본 뒤 다시 판단합니다. 한 번에 답할 수 있으면 바로 끝나고, 정보가 더 필요하면 이 과정을 몇 바퀴 돕니다.',
    deepAnswer:
      '이 반복을 agent loop라고 하며, 도는 횟수가 미리 정해져 있지 않고 상황에 따라 달라집니다. 그래서 답이 늦어지거나 비용이 예상보다 커질 수 있고, 잘못된 방향으로 계속 돌 수도 있습니다. 최대 횟수나 시간 같은 제동 장치를 함께 두는 이유입니다.',
    keyPoints: ['필요한 만큼 돌고 스스로 멈춘다', '반복 횟수가 고정이 아니라 제동 장치가 필요'],
    followUp: '같은 검색을 계속 반복하는 Agent는 무엇이 잘못된 걸까요?',
    prerequisites: ['agent-what-is-an-agent', 'agent-tool-calling-basics'],
  },
  {
    id: 'agent-why-tools-needed',
    category: 'agent',
    difficulty: 'foundation',
    term: 'Model Limitation · Tool',
    prompt: '똑똑한 LLM에게 왜 굳이 외부 도구를 붙이나요?',
    shortAnswer:
      '모델은 학습한 시점까지의 내용만 알기 때문입니다. 오늘 날씨나 우리 회사 문서처럼 모델 안에 없는 정보는 가져와야 하고, 메일 발송처럼 바깥 세상을 바꾸는 일은 도구만 할 수 있습니다.',
    deepAnswer:
      '그래서 도구는 능력을 더하는 장식이 아니라 모델이 구조적으로 못 하는 일을 메우는 통로입니다. 도구를 붙이면 답의 근거가 남아 검증도 쉬워집니다. 다만 도구가 틀린 값을 주면 모델은 그것을 사실로 받아들이므로, 도구 자체의 신뢰도도 함께 봐야 합니다.',
    keyPoints: [
      '학습 이후 정보와 외부 상태 변경은 모델 혼자 못 함',
      '도구가 틀리면 답도 함께 틀린다',
    ],
    followUp: '도구가 잘못된 값을 돌려줬을 때 모델은 그것을 알아챌 수 있을까요?',
    prerequisites: [],
  },
  {
    id: 'agent-memory-write-policy',
    category: 'agent',
    difficulty: 'advanced',
    term: 'Memory Write Policy',
    prompt: '대화 내용 중 무엇을 장기 메모리에 저장할지 어떤 기준으로 정하나요?',
    shortAnswer:
      '"다음 대화에서도 다시 쓸 정보인가"가 기준입니다. 사용자의 지속적인 선호나 제약처럼 반복 참조될 사실은 저장하고, 그 순간에만 의미 있는 잡담이나 이미 처리된 요청은 저장하지 않습니다.',
    deepAnswer:
      '전부 저장하면 검색 품질이 떨어지고 비용만 늘며, 틀린 정보까지 오래 살아남아 계속 잘못된 답을 유도합니다. 그래서 저장 시점에 무엇을 저장할지 모델이나 규칙으로 한 번 거르고, 시간이 지나 바뀔 수 있는 사실에는 갱신 경로를 둡니다. 사용자가 무엇이 기억됐는지 보고 지울 수 있게 하는 것도 신뢰와 품질 양쪽에 도움이 됩니다.',
    keyPoints: [
      '재사용 가능성이 저장 여부의 기준',
      '무분별한 저장은 검색 품질과 오류 지속성을 악화',
    ],
    followUp: '저장된 사실이 나중에 바뀌었을 때 이전 기억과 충돌하면 어떻게 처리하나요?',
    prerequisites: ['agent-memory-types', 'llm-context-vs-memory'],
  },
  {
    id: 'agent-memory-summarization-loss',
    category: 'agent',
    difficulty: 'advanced',
    term: 'Conversation Summarization · Information Loss',
    prompt: '긴 대화를 요약해 압축할 때 생기는 정보 손실은 어떻게 다루나요?',
    shortAnswer:
      '요약은 되돌릴 수 없는 압축이라 숫자, 고유명사, 사용자의 명시적 제약처럼 정확도가 중요한 정보가 먼저 사라집니다. 그래서 이런 항목은 요약문에 넣지 말고 구조화된 필드로 따로 보존하고, 원본은 검색 가능한 형태로 남겨둡니다.',
    deepAnswer:
      '요약을 요약하는 방식을 반복하면 오류가 누적되고 초기 맥락이 왜곡되므로, 재요약 사슬을 길게 만들지 않는 것이 핵심입니다. 구간별 요약을 원문에서 한 번씩만 만들어 계층으로 쌓고 필요한 구간만 펼치는 방식이 대표적입니다. 이전 요약에 새 대화를 이어 붙여 갱신하는 방식은 비용이 싸지만 매 턴 재요약이 쌓이므로 원문을 다시 참조할 경로를 함께 남겨야 합니다. 요약 품질은 "요약만 보고 원래 질문에 답할 수 있는가"처럼 과제 기반으로 평가하는 것이 좋습니다.',
    keyPoints: [
      '정확도가 중요한 항목은 요약문이 아니라 구조화 필드로 보존',
      '요약의 재요약은 오류 누적을 일으킴',
    ],
    followUp: '요약 품질이 나빠졌다는 것을 사용자 불만 전에 어떻게 감지할 수 있나요?',
    prerequisites: ['agent-memory-types'],
  },
  {
    id: 'agent-memory-retrieval-injection',
    category: 'agent',
    difficulty: 'intermediate',
    term: 'Memory Retrieval · Injection Point',
    prompt: '장기 메모리를 검색해 프롬프트에 넣을 때 무엇을 조심해야 하나요?',
    shortAnswer:
      '관련 없는 기억이 딸려 들어오면 모델이 그것을 현재 맥락으로 착각해 엉뚱한 답을 합니다. 그래서 유사도만 보지 말고 최근성을 함께 고려하고, 개수 상한과 유사도 하한을 두며, 기억이라는 것을 명시해 현재 질문과 구분되게 넣습니다.',
    deepAnswer:
      '검색된 기억은 사실이 아니라 "과거에 이렇게 저장했다"는 기록이므로, 현재 요청과 충돌하면 현재 요청이 이긴다는 우선순위를 지시문에 밝혀야 합니다. 임계값 없이 항상 상위 k개를 넣으면 관련 없는 기억이 늘 포함되므로 하한을 두는 편이 안전합니다. 어떤 기억이 주입돼 답이 바뀌었는지 추적할 수 있어야 원인 분석이 가능합니다.',
    keyPoints: [
      '유사도만으로 고르면 무관한 기억이 혼입',
      '기억과 현재 요청의 우선순위를 지시문에서 명시',
    ],
    followUp: '검색된 기억이 현재 사용자의 요청과 모순될 때 무엇을 우선해야 하나요?',
    prerequisites: ['rag-end-to-end-pipeline', 'agent-memory-types'],
  },
  {
    id: 'agent-memory-forgetting-update',
    category: 'agent',
    difficulty: 'advanced',
    term: 'Forgetting · Memory Update',
    prompt: '메모리에 망각이나 만료 정책이 필요한 이유는 무엇인가요?',
    shortAnswer:
      '사실은 시간이 지나면 바뀌는데 오래된 기억이 그대로 남으면 계속 틀린 답을 유도하기 때문입니다. 그래서 시간이 지나면 만료시키거나, 새 정보가 들어오면 기존 항목을 갱신·대체하는 경로를 둡니다.',
    deepAnswer:
      '망각은 저장 공간 문제가 아니라 정확도 문제로 봐야 합니다. 변하지 않는 사실과 변하는 상태를 구분해 후자에만 유효기간을 두는 방식이 실용적이고, 최근에 참조되지 않은 항목의 우선순위를 낮추는 방법도 있습니다. 시스템이 스스로 판단한 만료는 되돌릴 수 있게 비활성 표시 후 정리하는 편이 안전하지만, 사용자가 직접 삭제를 요청한 항목은 즉시 지우는 것이 신뢰와 개인정보 측면에서 맞습니다.',
    keyPoints: [
      '망각은 용량이 아니라 정확도를 위한 장치',
      '불변 사실과 가변 상태를 구분해 만료 정책을 다르게 적용',
    ],
    followUp: '"작년에 이직 준비 중"이라는 기억은 언제까지 유효하다고 봐야 하나요?',
    prerequisites: ['agent-memory-write-policy'],
  },
  {
    id: 'agent-tool-output-context-budget',
    category: 'agent',
    difficulty: 'intermediate',
    term: 'Tool Output · Context Budget',
    prompt: '도구가 돌려준 긴 결과를 컨텍스트에 그대로 넣으면 어떤 문제가 생기고 어떻게 다루나요?',
    shortAnswer:
      '결과가 길면 컨텍스트를 다 써버려 이전 대화나 지시문이 밀려나고 비용과 지연도 커집니다. 그래서 필요한 필드만 추리거나 요약해 넣고, 원문은 따로 저장해두고 참조 키만 남기는 방식을 씁니다.',
    deepAnswer:
      '도구 결과는 길이가 예측되지 않으므로 상한을 두고 잘라내되, 잘렸다는 사실을 모델이 알 수 있게 표시해야 없는 정보를 지어내지 않습니다. 표나 JSON은 불필요한 키를 제거하고 필요한 열만 남기는 것만으로 큰 절감이 되며, 반복 호출에서 같은 결과가 다시 들어오지 않게 중복 제거도 효과적입니다. 무엇을 남기고 버릴지는 결국 그 다음 단계에서 어떤 판단을 해야 하는지가 결정합니다.',
    keyPoints: [
      '긴 도구 결과는 컨텍스트·비용·지연을 동시에 악화',
      '절단 사실을 표시해야 환각을 막을 수 있음',
    ],
    followUp: '요약해서 넣었을 때 뒤 단계가 필요한 정보를 잃었다면 어떻게 진단하나요?',
    prerequisites: ['llm-tokenization-context-window', 'agent-tool-schema-validation'],
  },
  {
    id: 'agent-tool-protocol-standard',
    category: 'agent',
    difficulty: 'intermediate',
    term: 'Model Context Protocol · Tool Interoperability',
    prompt: 'Agent와 외부 도구를 연결할 때 표준 프로토콜을 쓰면 무엇이 좋아지나요?',
    shortAnswer:
      'MCP(Model Context Protocol) 같은 표준을 쓰면 도구를 앱마다 다시 구현하지 않고, 같은 규격을 지키는 도구 서버를 여러 앱이 그대로 붙여 쓸 수 있습니다. 도구 목록과 사용법을 실행 중에 물어볼 수 있어 새 도구를 추가할 때 앱을 다시 배포하지 않아도 됩니다.',
    deepAnswer:
      '반대로 외부 도구 서버가 어떤 도구를 노출할지 결정하게 되므로, 신뢰할 수 있는 출처인지와 도구 설명이 모델 지시문에 그대로 들어간다는 점을 함께 고려해야 합니다. 프로토콜은 아직 발전 중이라 통신 방식이 바뀌기도 하므로 버전 호환성 확인이 필요하고, 표준을 쓰더라도 도구 실패·타임아웃 처리는 여전히 앱의 책임입니다. 도구 수가 늘면 목록 자체가 컨텍스트를 차지한다는 비용도 봐야 합니다.',
    keyPoints: [
      '도구를 앱 간 재사용하고 실행 중에 발견할 수 있음',
      '도구 설명이 곧 지시문이므로 출처 신뢰가 전제',
    ],
    followUp: '연결한 도구가 200개라면 어떤 문제가 새로 생기나요?',
    prerequisites: ['agent-tool-schema-validation'],
  },
  {
    id: 'agent-routing-cascade',
    category: 'agent',
    difficulty: 'intermediate',
    term: 'Cascade Routing · Cheap-First',
    prompt: '모든 요청을 큰 모델에 보내지 않고 단계를 나누는 방식은 어떤 원리인가요?',
    shortAnswer:
      '규칙이나 작은 모델처럼 싸고 빠른 판정을 먼저 시도하고, 확신이 낮을 때만 비싼 모델로 넘기는 방식입니다. 대부분의 쉬운 요청이 앞 단계에서 끝나 평균 비용과 지연이 크게 줄어듭니다.',
    deepAnswer:
      '핵심은 각 단계가 "모르겠다"고 말할 수 있어야 한다는 점이며, 확신 임계값을 잘못 잡으면 틀린 답을 싸게 많이 만들어내는 결과가 됩니다. 작은 모델은 확신도가 잘 보정되지 않아 틀리면서도 자신 있는 경우가 많으므로 점수를 그대로 쓰기보다 별도 판정기를 두기도 합니다. 또 뒤 단계로 넘어간 요청은 두 단계 비용과 지연을 모두 부담하므로 평균은 좋아져도 꼬리 지연은 나빠질 수 있어, 단계별 정확도와 통과 비율을 따로 측정해야 합니다.',
    keyPoints: ['앞 단계 임계값이 곧 오답을 싸게 양산할 위험', '각 단계가 기권할 수 있어야 성립'],
    followUp: '앞 단계 임계값을 낮춰 더 많이 통과시키면 무엇이 좋아지고 무엇이 나빠지나요?',
    prerequisites: ['system-model-routing-fallback'],
  },
] as const satisfies readonly StudyQuestion[]

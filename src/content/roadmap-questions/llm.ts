import type { StudyQuestion } from '../../domain/learning/question'

export const llmRoadmapQuestions = [
  {
    id: 'llm-subword-tokenization-oov',
    category: 'llm',
    difficulty: 'foundation',
    term: 'Subword Tokenization · Out-of-Vocabulary',
    prompt: 'LLM이 단어 전체보다 Subword token을 사용하는 이유는 무엇인가요?',
    shortAnswer:
      '자주 쓰는 문자열은 하나의 token으로, 드문 단어는 더 작은 조각으로 나눠 제한된 vocabulary로 다양한 문장을 표현할 수 있기 때문입니다. 완전히 모르는 단어 문제를 줄이면서 sequence 길이도 조절합니다.',
    deepAnswer:
      'Vocabulary가 크면 embedding과 output layer가 커지고, 너무 작으면 같은 문장이 많은 token으로 늘어납니다. Token 경계는 언어와 model마다 달라 글자 수가 같아도 비용과 context 사용량이 달라질 수 있습니다.',
    keyPoints: ['유한 vocabulary로 새로운 문자열을 조합', 'Vocabulary 크기와 sequence 길이의 절충'],
    followUp: '한국어 문장이 영어보다 token을 더 많이 쓸 수 있는 이유를 어떻게 확인하나요?',
    prerequisites: ['llm-tokenization-context-window'],
  },
  {
    id: 'llm-logits-softmax-probability',
    category: 'llm',
    difficulty: 'foundation',
    term: 'Vocabulary Logits · Token Probability',
    prompt: 'LLM의 마지막 hidden state가 다음 token 확률분포로 바뀌는 과정을 설명해보세요.',
    shortAnswer:
      '마지막 hidden state를 vocabulary 크기로 선형 투영해 각 token의 logit을 만듭니다. Temperature를 반영한 뒤 softmax를 적용하면 합이 1인 다음 token 확률분포가 됩니다.',
    deepAnswer:
      'Logit은 정규화되지 않은 상대 점수이며 같은 상수를 모두 더해도 softmax 분포는 변하지 않습니다. Decoding은 이 분포에서 하나를 고르는 과정이고, 선택된 token을 입력에 붙여 다음 step을 반복합니다.',
    keyPoints: ['Logit은 확률 이전의 비정규화 점수', 'Softmax가 vocabulary 분포를 생성'],
    followUp: '가장 높은 확률 token만 계속 고르는 방식은 무엇이라고 부르나요?',
    prerequisites: ['llm-pretraining-next-token', 'math-log-exp-softmax'],
  },
  {
    id: 'llm-sft-instruction-tuning',
    category: 'llm',
    difficulty: 'intermediate',
    term: 'Supervised Fine-Tuning · Instruction Tuning',
    prompt: 'Pretraining 뒤에 SFT와 Instruction Tuning을 하는 목적은 무엇인가요?',
    shortAnswer:
      'Pretraining이 언어 패턴과 일반 지식을 학습한다면 SFT는 입력과 바람직한 응답 예시로 특정 행동을 학습합니다. Instruction tuning은 여러 지시 형식에 맞춰 유용하게 답하는 능력을 키우는 SFT입니다.',
    deepAnswer:
      'SFT는 여전히 next-token loss를 사용할 수 있지만 학습 데이터가 지시와 답변 구조로 바뀝니다. 데이터 품질이 낮으면 잘못된 스타일과 사실을 모방하며, 선호 정렬이나 안전 정책의 모든 문제를 SFT 하나로 해결할 수는 없습니다.',
    keyPoints: [
      'Pretraining의 일반 능력을 지시 수행 행동으로 조정',
      '학습 objective보다 데이터 구성의 역할이 큼',
    ],
    followUp: 'SFT와 RLHF는 어떤 종류의 feedback을 각각 사용하나요?',
    prerequisites: ['llm-pretraining-next-token'],
  },
  {
    id: 'llm-context-vs-memory',
    category: 'llm',
    difficulty: 'intermediate',
    term: 'Context Window · External Memory',
    prompt: '긴 Context Window와 Agent의 외부 Memory는 왜 같은 개념이 아닌가요?',
    shortAnswer:
      'Context window는 한 번의 추론에서 모델이 직접 볼 수 있는 token 범위입니다. 외부 memory는 과거 정보를 저장했다가 필요할 때 검색해 context에 다시 넣는 시스템 구성요소입니다.',
    deepAnswer:
      'Context가 길어도 어떤 정보가 어디 있는지 모델이 안정적으로 활용한다는 보장은 없고 비용도 늘어납니다. Memory에는 저장 조건, 검색 relevance, 최신성, 삭제와 개인정보 정책이 필요하며 결국 선택된 내용만 context로 들어갑니다.',
    keyPoints: ['Context는 추론 입력 한도', 'Memory는 저장·검색 정책을 가진 외부 상태'],
    followUp: 'Context window가 커졌다고 모든 대화 기록을 항상 넣으면 어떤 문제가 생기나요?',
    prerequisites: ['llm-tokenization-context-window', 'agent-memory-evaluation'],
  },
  {
    id: 'llm-greedy-beam-sampling',
    category: 'llm',
    difficulty: 'intermediate',
    term: 'Greedy · Beam Search · Sampling',
    prompt: 'Greedy decoding, Beam Search, Sampling은 다음 token을 고르는 방식이 어떻게 다른가요?',
    shortAnswer:
      'Greedy는 매 step 최고 확률 token 하나를 고릅니다. Beam search는 누적 점수가 높은 여러 sequence 후보를 유지하고, sampling은 확률분포에 따라 무작위로 token을 뽑습니다.',
    deepAnswer:
      'Greedy는 빠르고 재현성이 높지만 전체 sequence 최적을 보장하지 않습니다. Beam은 번역 같은 제한된 출력에 유용할 수 있지만 비용이 늘고 열린 대화에서는 반복적 문장을 만들 수 있습니다. Sampling은 다양성을 얻는 대신 변동성이 생깁니다.',
    keyPoints: ['Greedy는 국소 최고 선택', 'Beam은 여러 sequence, sampling은 분포 기반 선택'],
    followUp: 'Temperature 0에 가까운 sampling과 greedy가 비슷해지는 이유는 무엇인가요?',
    prerequisites: ['llm-temperature-top-p', 'llm-logits-softmax-probability'],
  },
  {
    id: 'llm-quantization',
    category: 'llm',
    difficulty: 'advanced',
    term: 'Quantization · Precision',
    prompt: 'LLM Quantization은 memory와 속도를 줄이면서 어떤 품질 위험을 만드나요?',
    shortAnswer:
      'Weight나 activation을 FP16보다 낮은 bit 정밀도로 표현해 model memory와 memory bandwidth를 줄입니다. 근사 오차가 쌓이면 특히 민감한 layer나 어려운 task의 품질이 떨어질 수 있습니다.',
    deepAnswer:
      'Post-training quantization은 학습 후 calibration data로 scale을 정하고, quantization-aware training은 학습 중 오차를 반영합니다. 낮은 bit가 실제 hardware에서 항상 빠른 것은 아니므로 latency, memory, 정확도를 같은 target 환경에서 측정해야 합니다.',
    keyPoints: ['낮은 정밀도로 저장·연산 비용 절감', '근사 오차와 hardware 지원을 함께 평가'],
    followUp: 'Model 파일 크기가 절반이 됐는데 latency가 그대로일 수 있는 이유는 무엇인가요?',
    prerequisites: ['math-log-sum-exp-stability', 'llm-pretraining-next-token'],
  },
  {
    id: 'llm-perplexity-task-evaluation',
    category: 'llm',
    difficulty: 'advanced',
    term: 'Perplexity · Task Evaluation',
    prompt: 'Perplexity가 낮다는 것과 사용자 task를 잘한다는 것은 왜 같지 않나요?',
    shortAnswer:
      'Perplexity는 정답 token sequence에 모델이 부여한 평균 negative log-likelihood의 지수로 다음 token 예측의 불확실성을 나타냅니다. 사실성, 지시 준수, 안전, tool 성공을 직접 측정하지는 않습니다.',
    deepAnswer:
      'Tokenization과 평가 corpus가 다르면 모델 간 perplexity를 단순 비교하기 어렵습니다. 실제 제품에서는 task별 golden set, factuality와 groundedness, 사람 판단, latency와 cost를 함께 보고 모델 변경의 회귀를 판단해야 합니다.',
    keyPoints: [
      'Perplexity는 language modeling objective 지표',
      '제품 품질은 task별 다차원 평가 필요',
    ],
    followUp:
      '서로 다른 tokenizer를 쓰는 두 모델의 perplexity를 그대로 비교하기 어려운 이유는 무엇인가요?',
    prerequisites: ['llm-pretraining-next-token', 'ml-loss-vs-metric'],
  },
  {
    id: 'llm-grounding-abstention',
    category: 'llm',
    difficulty: 'advanced',
    term: 'Grounding · Abstention · Factuality',
    prompt: 'Hallucination을 줄이기 위해 Grounding과 Abstention을 어떻게 함께 설계하나요?',
    shortAnswer:
      '검색 문서나 tool 결과처럼 확인 가능한 근거에 답을 묶고, 충분한 근거가 없거나 충돌하면 모른다고 답하도록 합니다. 답변율만 높이기보다 잘못 답하는 비용을 반영해 거절 기준을 정합니다.',
    deepAnswer:
      '출처를 표시하는 것만으로 그 출처가 주장을 실제로 지지한다는 보장은 없습니다. Retrieval relevance, citation entailment, 답변 사실성, 적절한 abstention을 분리 평가하고 공격적 prompt나 오래된 문서에서도 경계를 지키는지 봐야 합니다.',
    keyPoints: ['외부 근거와 생성 주장을 연결', '근거 부족 시 답하지 않는 선택도 품질'],
    followUp: '정답이 없는 질문을 포함하지 않은 평가셋으로는 어떤 능력을 측정하기 어렵나요?',
    prerequisites: ['llm-rlhf-dpo-hallucination', 'rag-vs-fine-tuning'],
  },
  {
    id: 'llm-teacher-forcing-exposure-bias',
    category: 'llm',
    difficulty: 'advanced',
    term: 'Teacher Forcing · Exposure Bias',
    prompt:
      'Autoregressive 모델의 Training과 Inference 입력 차이가 Exposure Bias를 만드는 이유는 무엇인가요?',
    shortAnswer:
      '학습에서는 정답 이전 token을 조건으로 다음 token을 예측하지만, 추론에서는 모델이 방금 생성한 token을 다시 입력합니다. 초기 실수가 이후 context에 누적될 수 있는데 학습 때는 그 상황을 충분히 보지 못합니다.',
    deepAnswer:
      '이를 teacher forcing과 autoregressive rollout의 분포 차이라고 볼 수 있습니다. Sequence-level training이나 데이터 구성으로 완화할 수 있지만 완전한 해결은 아니며 실제 생성 길이와 error propagation을 평가해야 합니다.',
    keyPoints: [
      '학습은 정답 prefix, 추론은 모델 생성 prefix 사용',
      '초기 오류가 이후 생성에 누적 가능',
    ],
    followUp:
      'Next-token accuracy가 높아도 긴 문장 생성이 무너질 수 있는 이유를 이 개념으로 설명해보세요.',
    prerequisites: ['llm-pretraining-next-token', 'transformer-causal-mask'],
  },
  {
    id: 'llm-kv-cache-prefill-decode',
    category: 'llm',
    difficulty: 'advanced',
    term: 'Prefill · Decode · KV Cache',
    prompt: 'LLM Inference의 Prefill과 Decode 단계, KV Cache의 역할을 설명해보세요.',
    shortAnswer:
      'Prefill은 prompt token을 한꺼번에 처리해 첫 token과 각 layer의 key·value를 계산합니다. Decode는 한 token씩 생성하며 KV cache에 저장한 이전 key·value를 재사용해 과거 전체를 매번 다시 계산하지 않습니다.',
    deepAnswer:
      'KV cache는 연산을 줄이는 대신 sequence 길이, layer 수, batch에 비례하는 memory를 사용합니다. Time to first token은 prefill에, token 간 속도는 decode에 더 영향을 받아 두 latency를 분리 측정해야 합니다.',
    keyPoints: ['Prefill은 prompt 병렬 처리', 'KV cache는 이전 attention K·V 재계산을 절약'],
    followUp:
      '긴 context에서 KV cache가 serving 동시 사용자 수를 제한할 수 있는 이유는 무엇인가요?',
    prerequisites: ['transformer-qkv', 'transformer-quadratic-attention-cost'],
  },
  {
    id: 'llm-in-context-learning',
    category: 'llm',
    difficulty: 'intermediate',
    term: 'In-Context Learning · Few-Shot Prompting',
    prompt: 'Few-shot In-Context Learning은 Fine-tuning과 무엇이 다른가요?',
    shortAnswer:
      'In-context learning은 prompt에 몇 개의 예시를 넣어 이번 추론의 행동을 유도하며 model weight를 바꾸지 않습니다. Fine-tuning은 학습을 통해 parameter나 adapter를 실제로 업데이트합니다.',
    deepAnswer:
      'Few-shot은 빠르게 바꿀 수 있지만 context token을 소비하고 예시 순서와 표현에 민감합니다. Fine-tuning은 반복 task에서 형식과 행동을 안정화할 수 있지만 데이터 제작, 학습, 배포와 회귀 평가 비용이 듭니다.',
    keyPoints: ['Prompt 예시는 weight를 변경하지 않음', '빠른 적응과 지속 학습의 비용 구조가 다름'],
    followUp: '매 요청마다 동일한 긴 예시를 넣는 방식의 비용과 latency 단점은 무엇인가요?',
    prerequisites: ['llm-sft-instruction-tuning', 'llm-tokenization-context-window'],
  },
  {
    id: 'llm-autoregressive-factorization',
    category: 'llm',
    difficulty: 'intermediate',
    term: 'Autoregressive Model · Chain Rule',
    prompt:
      'Autoregressive Language Model은 문장 전체 확률을 어떻게 다음 token 확률의 곱으로 나타내나요?',
    shortAnswer:
      '문장 token들의 joint probability를 각 token이 이전 token들에 조건부인 확률의 곱으로 분해합니다. 그래서 왼쪽 context가 주어졌을 때 다음 token을 예측하는 학습으로 전체 sequence 분포를 모델링할 수 있습니다.',
    deepAnswer:
      '확률의 chain rule을 이용한 분해이며 decoder-only Transformer는 causal mask로 미래 token을 보지 못하게 합니다. 생성 시에는 한 token씩 순차적으로 sample해야 하므로 training의 병렬 next-token 계산보다 decode가 순차적입니다.',
    keyPoints: [
      'Joint probability를 조건부 확률의 곱으로 분해',
      'Causal mask와 순차 generation이 연결',
    ],
    followUp:
      'Autoregressive training은 여러 위치를 병렬 계산하면서 inference는 왜 한 token씩 진행하나요?',
    prerequisites: ['math-conditional-probability-bayes', 'transformer-causal-mask'],
  },
] as const satisfies readonly StudyQuestion[]

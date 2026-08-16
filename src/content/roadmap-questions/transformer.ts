import type { StudyQuestion } from '../../domain/learning/question'

export const transformerRoadmapQuestions = [
  {
    id: 'transformer-end-to-end-data-flow',
    category: 'transformer',
    difficulty: 'foundation',
    term: 'Transformer End-to-End Flow',
    prompt: '문장이 Transformer에 들어가 다음 token logit이 되기까지의 흐름을 말해보세요.',
    shortAnswer:
      '문장을 token으로 나누고 embedding에 위치 정보를 더한 뒤 여러 Transformer block을 통과시킵니다. 각 block은 attention과 feed-forward 변환을 수행하고 마지막 hidden state를 vocabulary 크기의 logit으로 투영합니다.',
    deepAnswer:
      '각 sublayer 주변에는 residual connection과 normalization이 있어 정보와 gradient 흐름을 돕습니다. Decoder-only 모델은 causal mask로 미래 token을 가리고, 마지막 위치의 logit을 softmax해 다음 token 분포를 얻은 뒤 생성 과정을 반복합니다.',
    keyPoints: [
      'Token → embedding → blocks → logits',
      'Block은 attention과 feed-forward를 중심으로 구성',
    ],
    followUp: 'Vocabulary 크기의 logit은 확률과 무엇이 다른가요?',
    prerequisites: ['transformer-embedding', 'transformer-encoder-decoder'],
  },
  {
    id: 'transformer-attention-matrix-shapes',
    category: 'transformer',
    difficulty: 'intermediate',
    term: 'Attention Score Matrix · Tensor Shape',
    prompt: 'Sequence 길이 n에서 QKᵀ와 attention output의 shape를 설명해보세요.',
    shortAnswer:
      '한 head에서 Q와 K가 각각 n×dₖ라면 QKᵀ는 n×n score matrix입니다. 각 query 위치가 모든 key 위치와 비교되며, softmax weight n×n에 V n×dᵥ를 곱하면 output은 n×dᵥ가 됩니다.',
    deepAnswer:
      'Batch와 head 축까지 쓰면 흔히 (B, H, N, dₖ)와 (B, H, N, N) 형태로 추적합니다. Mask도 score에 broadcast 가능한 shape여야 하며 shape 추적은 transpose와 head 분할 오류를 찾는 가장 빠른 방법입니다.',
    keyPoints: [
      'QKᵀ는 token 쌍마다 score를 만들어 n×n',
      'Attention weight와 V의 곱은 token별 표현을 생성',
    ],
    followUp: '왜 K가 아니라 Kᵀ를 곱해야 각 query-key 쌍의 내적을 얻나요?',
    prerequisites: ['transformer-qkv', 'math-matrix-multiplication-shape'],
  },
  {
    id: 'transformer-attention-softmax-axis',
    category: 'transformer',
    difficulty: 'intermediate',
    term: 'Attention Softmax · Normalization Axis',
    prompt: 'Attention score에 Softmax를 어느 축으로 적용하고 그 행의 합은 무엇을 뜻하나요?',
    shortAnswer:
      '각 query가 바라보는 key 축에 softmax를 적용합니다. 따라서 한 query 행의 attention weight 합은 1이고, 그 query가 여러 value에서 정보를 얼마나 가져올지 정하는 가중치가 됩니다.',
    deepAnswer:
      'Mask된 key 위치에는 softmax 전에 매우 작은 값을 넣어 weight가 0에 가깝게 되도록 합니다. 다른 축에 softmax를 적용하면 key마다 query를 정규화하는 전혀 다른 연산이 되어 의도한 weighted sum이 깨집니다.',
    keyPoints: ['Query별로 key 축을 정규화', '각 행은 value 가중합의 확률형 weight'],
    followUp: 'Causal mask를 softmax 이후에 단순히 0으로 만들면 어떤 정규화 문제가 남나요?',
    prerequisites: ['transformer-attention-matrix-shapes', 'math-log-exp-softmax'],
  },
  {
    id: 'transformer-head-concat-projection',
    category: 'transformer',
    difficulty: 'advanced',
    term: 'Head Concatenation · Output Projection',
    prompt: 'Multi-Head Attention의 여러 head 결과는 마지막에 어떻게 하나의 표현으로 합쳐지나요?',
    shortAnswer:
      '각 head가 독립된 projection 공간에서 attention output을 만든 뒤 feature 축으로 concatenate합니다. 이어서 output projection Wᴼ를 곱해 모델 hidden dimension으로 섞어 다음 sublayer에 전달합니다.',
    deepAnswer:
      'Head 수를 늘린다고 총 hidden dimension이 자동으로 커지는 것은 아니며 보통 head dimension을 나눠 전체 크기를 유지합니다. 각 head가 반드시 사람이 해석 가능한 고정 역할을 갖는다는 보장도 없습니다.',
    keyPoints: ['Head output을 feature 축으로 연결', 'Wᴼ가 head 정보를 다시 혼합'],
    followUp: 'd_model이 768이고 head가 12개라면 일반적인 head dimension은 얼마인가요?',
    prerequisites: ['transformer-scaled-multi-head', 'math-matrix-multiplication-shape'],
  },
  {
    id: 'transformer-residual-connection',
    category: 'transformer',
    difficulty: 'intermediate',
    term: 'Residual Connection · Skip Path',
    prompt:
      'Residual Connection이 깊은 Transformer에서 정보와 gradient 흐름을 돕는 이유는 무엇인가요?',
    shortAnswer:
      'Sublayer 출력에 입력을 그대로 더해 변환을 거치지 않는 짧은 경로를 만듭니다. 모델은 전체 표현을 매번 새로 만들기보다 필요한 변화량을 학습할 수 있고 gradient도 skip path로 전달됩니다.',
    deepAnswer:
      '더하려는 tensor shape가 같아야 하며 residual만으로 안정성이 모두 해결되지는 않아 normalization과 초기화가 함께 쓰입니다. 매우 깊은 모델에서는 residual scale과 normalization 위치도 학습 안정성에 영향을 줍니다.',
    keyPoints: ['입력 identity path를 보존', '변화량을 학습해 깊은 network 최적화 지원'],
    followUp: 'Residual로 더하는 두 tensor의 hidden dimension이 달라지면 무엇이 필요한가요?',
    prerequisites: ['transformer-end-to-end-data-flow', 'dl-vanishing-exploding-gradient'],
  },
  {
    id: 'transformer-pre-norm-post-norm',
    category: 'transformer',
    difficulty: 'advanced',
    term: 'Pre-Norm · Post-Norm',
    prompt: 'Transformer의 Pre-Norm과 Post-Norm은 normalization 위치가 어떻게 다른가요?',
    shortAnswer:
      'Pre-norm은 attention이나 FFN sublayer에 들어가기 전에 layer normalization을 적용하고 residual을 더합니다. Post-norm은 sublayer와 residual 합 이후에 normalization을 적용합니다.',
    deepAnswer:
      '원래 Transformer는 post-norm을 사용했지만 깊은 모델에서 pre-norm이 gradient 흐름과 학습 안정성에 유리해 널리 쓰입니다. 다만 최종 성능과 scale 특성은 architecture와 training recipe에 따라 달라 어느 쪽도 무조건 우수하지 않습니다.',
    keyPoints: ['Norm이 sublayer 전인지 후인지가 차이', '위치는 residual gradient 경로에 영향'],
    followUp:
      'Pre-norm block에서 residual identity path가 normalization을 거치지 않는다는 점은 왜 중요할까요?',
    prerequisites: ['transformer-residual-connection', 'dl-batchnorm-layernorm'],
  },
  {
    id: 'transformer-position-wise-ffn',
    category: 'transformer',
    difficulty: 'intermediate',
    term: 'Position-Wise Feed-Forward Network',
    prompt: 'Attention 뒤의 Position-Wise FFN은 token 간 정보를 섞는 대신 무엇을 하나요?',
    shortAnswer:
      '같은 두 개의 선형 변환과 비선형 activation을 각 token 위치에 독립적으로 적용합니다. Attention이 token 간 정보를 모았다면 FFN은 각 위치의 hidden feature를 더 큰 공간에서 변환합니다.',
    deepAnswer:
      '일반적으로 hidden dimension을 중간에서 확장한 뒤 다시 d_model로 줄이며 모든 위치가 같은 weight를 공유합니다. 따라서 sequence 상호작용은 attention이 맡고 channel 방향의 비선형 표현력은 FFN이 크게 담당합니다.',
    keyPoints: ['각 token 위치에 같은 MLP 적용', 'Feature dimension을 확장·압축하며 비선형 변환'],
    followUp: 'FFN만 여러 층 쌓고 attention을 제거하면 token 사이 정보가 전달될 수 있나요?',
    prerequisites: ['transformer-end-to-end-data-flow', 'dl-weight-bias-activation'],
  },
  {
    id: 'transformer-cross-attention',
    category: 'transformer',
    difficulty: 'intermediate',
    term: 'Cross-Attention · Encoder Memory',
    prompt: 'Encoder-Decoder Transformer의 Cross-Attention에서 Q, K, V는 어디에서 오나요?',
    shortAnswer:
      'Query는 decoder의 현재 hidden state에서 오고, key와 value는 encoder가 만든 입력 표현에서 옵니다. Decoder가 지금 생성할 내용에 필요한 입력 부분을 선택해 참고하는 구조입니다.',
    deepAnswer:
      'Decoder self-attention은 causal mask로 이전 출력끼리 연결하고, cross-attention은 source sequence 전체를 볼 수 있습니다. Decoder-only LLM은 별도 encoder memory가 없으므로 prompt token을 같은 causal self-attention 문맥 안에서 처리합니다.',
    keyPoints: ['Q는 decoder, K와 V는 encoder output', 'Self-attention과 source 참조 역할을 분리'],
    followUp: '기계번역 decoder의 cross-attention에는 왜 일반적인 causal mask가 필요하지 않나요?',
    prerequisites: ['transformer-qkv', 'transformer-encoder-decoder'],
  },
  {
    id: 'transformer-bert-vs-gpt',
    category: 'transformer',
    difficulty: 'foundation',
    term: 'BERT · GPT Architecture',
    prompt: 'BERT와 GPT를 구조, attention 방향, 대표 학습 목표로 비교해보세요.',
    shortAnswer:
      'BERT는 encoder-only로 양쪽 문맥을 보는 self-attention과 masked language modeling을 대표적으로 사용합니다. GPT 계열은 decoder-only causal attention으로 이전 token에서 다음 token을 예측합니다.',
    deepAnswer:
      '전통적으로 BERT는 문장 이해·표현과 분류에, GPT는 autoregressive 생성에 강점이 있습니다. 다만 실제 최신 모델의 task 범위는 학습법과 규모에 따라 넓어졌으므로 encoder는 이해, decoder는 생성이라는 문구를 절대적 제한처럼 보면 안 됩니다.',
    keyPoints: ['BERT는 encoder-only 양방향 문맥', 'GPT는 decoder-only causal next-token 학습'],
    followUp: 'BERT가 masked token을 예측할 때 실제 입력 문장의 어떤 정보까지 볼 수 있나요?',
    prerequisites: ['transformer-encoder-decoder', 'transformer-causal-mask'],
  },
  {
    id: 'transformer-quadratic-attention-cost',
    category: 'transformer',
    difficulty: 'advanced',
    term: 'Quadratic Attention Cost · Sequence Length',
    prompt: '기본 Self-Attention의 비용이 sequence 길이에 대해 제곱으로 커지는 이유는 무엇인가요?',
    shortAnswer:
      '길이 n의 모든 query가 n개의 모든 key와 점수를 계산해 n×n attention matrix를 만들기 때문입니다. Sequence가 두 배면 score 원소 수는 약 네 배가 됩니다.',
    deepAnswer:
      '정확한 시간·memory 병목은 hidden dimension, head 수, 구현과 training·inference에 따라 다르지만 긴 context에서 attention matrix가 큰 부담입니다. Sparse·local attention, chunking, kernel 최적화는 서로 다른 방식으로 이 비용을 줄입니다.',
    keyPoints: [
      '모든 token 쌍 비교가 n² score 생성',
      '긴 context는 memory와 latency를 빠르게 증가',
    ],
    followUp:
      'Sequence 길이를 1,024에서 2,048로 늘리면 attention score 원소 수는 약 몇 배가 되나요?',
    prerequisites: ['transformer-attention-matrix-shapes'],
  },
  {
    id: 'transformer-rope-relative-position',
    category: 'transformer',
    difficulty: 'advanced',
    term: 'RoPE · Relative Position',
    prompt: 'Rotary Positional Embedding은 Q와 K에 위치 정보를 어떻게 반영하나요?',
    shortAnswer:
      'RoPE는 Q와 K의 feature 쌍을 위치별 각도로 회전시킵니다. 회전된 Q와 K의 내적이 두 token의 절대 위치보다 상대적 거리 정보를 자연스럽게 포함하도록 만듭니다.',
    deepAnswer:
      '학습 parameter를 크게 늘리지 않고 attention score에 위치를 반영하며 decoder-only LLM에서 널리 쓰입니다. 하지만 학습 범위를 훨씬 넘는 context로 확장하면 회전 주파수와 분포가 달라져 별도 scaling과 평가가 필요합니다.',
    keyPoints: ['Q·K feature를 position-dependent rotation', '내적에 상대 위치 차이를 반영'],
    followUp: 'RoPE를 V가 아니라 주로 Q와 K에 적용하는 이유를 attention score 관점에서 말해보세요.',
    prerequisites: ['transformer-positional-encoding', 'transformer-qkv'],
  },
] as const satisfies readonly StudyQuestion[]

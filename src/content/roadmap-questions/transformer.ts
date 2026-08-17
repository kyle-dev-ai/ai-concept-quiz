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
      'Mask된 key 위치에는 softmax 전에 매우 큰 음수(−∞에 가까운 값)를 더해 weight가 0에 가깝게 되도록 합니다. 다른 축에 softmax를 적용하면 key마다 query를 정규화하는 전혀 다른 연산이 되어 의도한 weighted sum이 깨집니다.',
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
      '일반적으로 hidden dimension을 중간에서 확장한 뒤 다시 d_model로 줄이며 모든 위치가 같은 weight를 공유합니다. 따라서 sequence 상호작용은 attention이 맡고 channel 방향의 비선형 표현력은 FFN이 크게 담당합니다. 원 논문은 두 선형 변환 구조지만 최신 LLM은 SwiGLU처럼 gate가 있는 세 행렬 변형을 흔히 사용합니다.',
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
  {
    id: 'transformer-layer-complexity-comparison',
    category: 'transformer',
    difficulty: 'advanced',
    term: 'Layer Complexity · Sequential Ops · Path Length',
    prompt:
      'Self-Attention, RNN, Convolution을 층당 계산량·순차 연산 수·최대 경로 길이로 비교해보세요.',
    shortAnswer:
      'Self-attention은 층당 계산이 길이의 제곱에 비례하지만 순차 연산이 상수이고 임의의 두 위치가 한 층에서 직접 연결됩니다. RNN은 층당 계산이 길이에 선형이지만 순차 연산과 정보 경로가 모두 길이에 비례해 병렬화와 장거리 학습이 불리합니다.',
    deepAnswer:
      'Convolution은 순차 연산은 상수지만 한 층의 수용 영역이 커널 크기로 제한돼 먼 위치를 잇는 데 여러 층이 필요합니다. 경로가 짧을수록 gradient가 먼 위치까지 잘 전달되므로, 이 표가 Transformer 선택의 근거가 됩니다. 다만 self-attention의 층당 계산은 길이의 제곱에 표현 차원을 곱한 형태고 RNN은 길이에 차원의 제곱을 곱한 형태라, 문장처럼 길이가 표현 차원보다 짧은 구간에서는 self-attention이 오히려 더 쌉니다. 길이가 아주 길어지면 이 관계가 뒤집히므로 국소 attention 같은 제한이 등장합니다.',
    keyPoints: [
      'Self-attention은 순차 연산 상수, 최대 경로 길이 상수',
      '길이가 표현 차원보다 짧으면 self-attention이 RNN보다 오히려 저렴',
    ],
    followUp: '문장 길이가 표현 차원보다 훨씬 길어지면 어느 쪽이 유리해지나요?',
    prerequisites: ['transformer-attention-vs-rnn', 'transformer-quadratic-attention-cost'],
  },
  {
    id: 'transformer-padding-mask',
    category: 'transformer',
    difficulty: 'intermediate',
    term: 'Padding Mask · Causal Mask',
    prompt: 'Padding Mask와 Causal Mask는 무엇을 막기 위한 것이고 어떻게 다른가요?',
    shortAnswer:
      'Padding mask는 길이를 맞추려고 채워 넣은 의미 없는 자리를 attention에서 제외합니다. Causal mask는 미래 token을 보지 못하게 막는 것이라 목적이 다르고, 학습에서는 둘을 함께 적용하는 경우가 많습니다.',
    deepAnswer:
      'Padding을 막지 않으면 채움 자리가 attention weight를 나눠 가져 실제 token의 비중이 줄고, 배치 구성에 따라 같은 문장의 결과가 달라지는 이상한 현상이 생깁니다. 두 mask 모두 softmax 이전에 매우 큰 음수를 더하는 방식으로 구현하며, 손실 계산에서도 padding 위치는 제외해야 학습 신호가 오염되지 않습니다. 한 행이 전부 가려지면 softmax 분모가 무너질 수 있어 구현에서 예외 처리가 필요합니다.',
    keyPoints: [
      'Padding mask는 빈 자리 제외, causal mask는 미래 차단',
      'Attention뿐 아니라 손실 계산에서도 padding을 제외해야 함',
    ],
    followUp:
      'Padding을 막지 않으면 같은 문장이 배치 구성에 따라 다른 결과를 내는 이유는 무엇인가요?',
    prerequisites: ['transformer-causal-mask', 'transformer-attention-softmax-axis'],
  },
  {
    id: 'transformer-weight-tying',
    category: 'transformer',
    difficulty: 'advanced',
    term: 'Weight Tying · Embedding Sharing',
    prompt: '입력 embedding과 출력 projection의 가중치를 공유하면 무엇이 좋아지나요?',
    shortAnswer:
      '어휘 크기가 크면 두 행렬이 전체 파라미터의 상당 부분을 차지하는데, 하나로 묶으면 그중 한 행렬 분량을 통째로 줄일 수 있습니다. 또 어떤 token을 입력으로 이해하는 공간과 출력으로 예측하는 공간을 같은 공간으로 묶어 규제 효과도 얻습니다.',
    deepAnswer:
      '원 논문은 두 embedding 층과 softmax 직전 선형 변환의 가중치를 공유하고, embedding 쪽에는 스케일을 곱해 크기를 맞췄습니다. 다만 모델이 커지고 어휘가 매우 커지면 두 역할을 분리하는 편이 성능에 유리하다는 보고도 있어, 최근 모델은 묶는 경우와 푸는 경우가 모두 존재합니다. 파라미터 절감이 목적인지 성능이 목적인지에 따라 선택이 달라집니다.',
    keyPoints: [
      '큰 어휘에서 파라미터를 크게 줄이고 규제 효과',
      '모델 규모에 따라 분리가 유리할 수 있어 항상 묶지는 않음',
    ],
    followUp: '입력 공간과 출력 공간을 같게 묶는 것이 부적절할 수 있는 경우는 언제인가요?',
    prerequisites: ['transformer-embedding', 'llm-logits-softmax-probability'],
  },
  {
    id: 'transformer-label-smoothing',
    category: 'transformer',
    difficulty: 'advanced',
    term: 'Label Smoothing · Confidence',
    prompt: 'Label Smoothing은 무엇을 바꾸고 왜 perplexity와 실제 성능이 반대로 움직이나요?',
    shortAnswer:
      '정답에 확률 1을 전부 몰아주는 대신 아주 작은 확률을 나머지 후보에도 나눠 주는 방식입니다. 모델이 정답에 극단적으로 확신하지 못하게 만들어 perplexity 같은 확률 지표는 나빠지지만, 번역 품질이나 정확도는 오히려 좋아지는 경우가 보고됩니다.',
    deepAnswer:
      '한 후보에 확률을 전부 몰면 logit 격차를 무한정 키우는 방향으로 학습이 흘러 과확신과 과적합이 생기는데, 목표 분포를 살짝 눕히면 이 압력이 줄어듭니다. 확률값 자체를 의사결정에 쓰는 서비스에서는 확신도의 절대 수준이 눌려 임계값을 다시 맞춰야 하지만, 과확신이 줄어 calibration 지표는 오히려 개선되는 것이 보통입니다. 다만 정도가 지나치면 정답과 오답의 구분이 흐려집니다.',
    keyPoints: [
      '목표 분포를 눕혀 과확신과 과적합을 억제',
      '확률 지표는 나빠지고 과제 성능은 좋아질 수 있음',
    ],
    followUp: '확률값을 그대로 의사결정에 쓰는 서비스에서는 무엇을 확인해야 하나요?',
    prerequisites: ['ml-cross-entropy-nll', 'ml-probability-calibration'],
  },
  {
    id: 'transformer-dropout-placement',
    category: 'transformer',
    difficulty: 'intermediate',
    term: 'Residual Dropout · Placement',
    prompt: 'Transformer에서 Dropout을 어느 지점에 넣는지와 그 이유는 무엇인가요?',
    shortAnswer:
      '각 sub-layer의 출력을 residual에 더하기 전에 적용하고, embedding과 위치 정보를 합한 직후에도 적용합니다. 잔차 경로 자체를 끊지 않으면서 각 sub-layer가 특정 경로에만 의존하지 않게 만드는 위치입니다.',
    deepAnswer:
      'Attention weight에 dropout을 거는 변형도 있지만 위치마다 효과가 달라 무작정 많이 넣으면 학습이 느려지고 성능이 떨어집니다. 모델과 데이터가 커질수록 필요한 dropout은 줄어드는 경향이 있어, 대규모 사전학습에서는 아주 낮게 두거나 쓰지 않기도 합니다. 추론에서는 반드시 꺼야 하며 켜둔 채 평가하면 같은 입력에도 결과가 흔들립니다.',
    keyPoints: [
      'Sub-layer 출력과 embedding 합 지점에 적용',
      '모델·데이터가 커질수록 필요한 dropout은 줄어드는 경향',
    ],
    followUp: '대규모 사전학습에서 dropout을 거의 쓰지 않기도 하는 이유는 무엇인가요?',
    prerequisites: ['dl-dropout-train-eval', 'transformer-residual-connection'],
  },
  {
    id: 'transformer-gqa-mqa',
    category: 'transformer',
    difficulty: 'advanced',
    term: 'Multi-Query · Grouped-Query Attention',
    prompt: 'Query head는 그대로 두고 Key·Value head 수만 줄이는 방식은 무엇을 해결하나요?',
    shortAnswer:
      '생성 단계에서는 이전 token의 Key와 Value를 계속 들고 있어야 하는데, head 수만큼 쌓이면 메모리와 읽는 대역폭이 병목이 됩니다. Key·Value head를 여러 query head가 공유하면 저장량과 읽는 양이 그만큼 줄어 생성이 빨라집니다.',
    deepAnswer:
      '모든 query head가 하나의 Key·Value를 공유하는 극단이 가장 가볍지만 품질 손실이 생길 수 있어, 몇 개의 그룹으로 묶어 절충하는 방식이 널리 쓰입니다. 이 최적화는 학습 계산량보다 생성 시 메모리 대역폭을 겨냥한 것이라, 문맥이 길고 동시 요청이 많을수록 이득이 커집니다. 이미 학습된 모델을 그룹형으로 바꾸려면 Key·Value를 병합한 뒤 추가 학습이 필요합니다.',
    keyPoints: [
      'KV 캐시 크기와 메모리 대역폭이 생성 단계의 병목',
      '공유 정도가 클수록 가볍지만 품질 손실 위험',
    ],
    followUp: '이 방식의 이득이 문맥이 짧을 때보다 길 때 커지는 이유는 무엇인가요?',
    prerequisites: ['llm-kv-cache-prefill-decode', 'transformer-scaled-multi-head'],
  },
  {
    id: 'transformer-flash-attention',
    category: 'transformer',
    difficulty: 'advanced',
    term: 'IO-Aware Attention · Memory Bandwidth',
    prompt:
      'Attention을 근사하지 않고도 빠르고 메모리를 적게 쓰는 구현이 가능한 이유는 무엇인가요?',
    shortAnswer:
      '기본 구현은 n×n attention 행렬을 통째로 메모리에 만들었다가 다시 읽는데, 이 데이터 이동이 실제 병목이기 때문입니다. 입력을 블록으로 나눠 빠른 메모리 안에서 계산하고 softmax를 누적 방식으로 처리하면 큰 행렬을 만들지 않고도 같은 결과를 얻습니다.',
    deepAnswer:
      '핵심은 계산량을 줄이는 것이 아니라 느린 메모리와 주고받는 양을 줄이는 것이라, 수학적으로는 정확히 같은 attention이고 근사가 아닙니다. 역전파에서는 저장하지 않은 중간값을 다시 계산하는데, 메모리 이동이 줄어드는 이득이 재계산 비용보다 커서 전체가 빨라집니다. 이 관점은 attention에 국한되지 않고 GPU 연산 최적화의 일반적인 사고방식입니다.',
    keyPoints: [
      '병목은 계산량이 아니라 메모리 이동량',
      '근사가 아니라 같은 결과를 다른 순서로 계산',
    ],
    followUp:
      '역전파에서 중간값을 저장하지 않고 다시 계산하는 편이 빠를 수 있는 이유는 무엇인가요?',
    prerequisites: ['transformer-quadratic-attention-cost', 'transformer-attention-matrix-shapes'],
  },
  {
    id: 'transformer-mixture-of-experts',
    category: 'transformer',
    difficulty: 'advanced',
    term: 'Mixture of Experts · Sparse Activation',
    prompt: 'Mixture of Experts는 파라미터를 크게 늘리면서 계산량은 왜 비슷하게 유지되나요?',
    shortAnswer:
      'FFN을 여러 전문가로 복제해두고 router가 token마다 그중 소수만 골라 통과시키기 때문입니다. 복제된 FFN 몫이 전문가 수만큼 불어나 전체 파라미터는 크게 늘지만, 한 token이 지나는 경로는 몇 개뿐이라 연산량은 크게 늘지 않습니다.',
    deepAnswer:
      '문제는 router가 특정 전문가에만 몰리는 쏠림이라, 보조 손실이나 용량 제한으로 균형을 맞춰야 학습이 됩니다. 또 계산은 희소해도 전문가 파라미터는 전부 메모리에 있어야 하므로 저장 공간과 분산 학습의 통신 비용은 그대로 늘고, router의 선택이 조금만 바뀌어도 결과가 달라져 학습이 불안정할 수 있습니다. 같은 연산량으로 더 큰 용량을 얻는 대신 시스템 복잡도를 지불하는 구조입니다.',
    keyPoints: [
      '토큰마다 일부 전문가만 활성화해 연산량 유지',
      '쏠림 방지와 메모리·통신 비용이 실제 난점',
    ],
    followUp: 'Router가 특정 전문가에만 몰리면 어떤 문제가 생기나요?',
    prerequisites: ['transformer-position-wise-ffn'],
  },
  {
    id: 'transformer-rmsnorm',
    category: 'transformer',
    difficulty: 'intermediate',
    term: 'RMSNorm · LayerNorm',
    prompt: 'RMSNorm은 LayerNorm에서 무엇을 덜어냈고 왜 그래도 동작하나요?',
    shortAnswer:
      'LayerNorm은 평균을 빼고 표준편차로 나눈 뒤 스케일과 이동을 학습하는데, RMSNorm은 평균 빼기와 이동을 생략하고 제곱평균제곱근으로만 크기를 맞춥니다. 정규화의 실질적 효과 대부분이 크기 조절에서 오기 때문에 성능은 비슷하면서 연산은 줄어듭니다.',
    deepAnswer:
      '연산이 단순해지면 큰 모델에서 층마다 반복되는 비용과 메모리 접근이 줄어 학습·추론 속도에 도움이 됩니다. 다만 평균을 제거하지 않으므로 입력 분포에 큰 편향이 있으면 동작이 달라질 수 있어, 무조건 대체 가능하다기보다 최근 대형 언어 모델에서 널리 채택된 선택으로 보는 편이 정확합니다. 정규화를 어디에 두느냐와는 별개의 문제입니다.',
    keyPoints: [
      '평균 빼기와 이동 항을 생략하고 크기만 정규화',
      '성능은 비슷하면서 층마다 반복되는 비용을 절감',
    ],
    followUp: '정규화 방식 선택과 정규화 위치 선택은 왜 서로 다른 문제인가요?',
    prerequisites: ['dl-batchnorm-layernorm', 'transformer-pre-norm-post-norm'],
  },
  {
    id: 'transformer-sliding-window-attention',
    category: 'transformer',
    difficulty: 'advanced',
    term: 'Sliding Window · Sparse Attention',
    prompt: '각 token이 가까운 이웃만 보게 제한해도 먼 문맥을 반영할 수 있는 이유는 무엇인가요?',
    shortAnswer:
      '한 층에서는 창 크기만큼만 보지만 층을 쌓으면 이웃의 이웃을 통해 정보가 간접적으로 전달되어, 깊이에 비례해 실질적으로 보는 범위가 넓어지기 때문입니다. 비용은 길이의 제곱이 아니라 길이에 창 크기를 곱한 수준으로 줄어듭니다.',
    deepAnswer:
      '다만 간접 전달은 직접 연결보다 정보가 희석되므로, 문서 전체를 봐야 하는 소수의 위치를 전역으로 열어 두는 혼합 방식이 흔합니다. 어떤 위치를 열지는 구조가 미리 정하는 가정이라 그 가정이 과제와 맞지 않으면 손해가 되고, 정확히 같은 결과를 주는 최적화와 달리 이것은 결과가 달라지는 근사라는 점을 구분해야 합니다.',
    keyPoints: [
      '층을 쌓으면 실질 수용 범위가 넓어짐',
      '결과가 달라지는 근사이므로 정확 최적화와 구분',
    ],
    followUp: '전체를 봐야 하는 질문에서 국소 attention만 쓰면 어떤 실패가 나타날까요?',
    prerequisites: ['transformer-quadratic-attention-cost', 'transformer-causal-mask'],
  },
] as const satisfies readonly StudyQuestion[]

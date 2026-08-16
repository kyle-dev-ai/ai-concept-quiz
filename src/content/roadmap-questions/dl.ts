import type { StudyQuestion } from '../../domain/learning/question'

export const dlRoadmapQuestions = [
  {
    id: 'dl-computational-graph-autograd',
    category: 'dl',
    difficulty: 'intermediate',
    term: 'Computational Graph · Autograd',
    prompt: '계산 그래프는 Autograd가 gradient를 계산하는 데 어떻게 도움을 주나요?',
    shortAnswer:
      '계산 그래프는 tensor 연산과 의존 관계를 노드와 간선으로 기록합니다. Autograd는 loss에서 시작해 그래프를 역순으로 따라가며 각 연산의 local derivative를 chain rule로 곱해 gradient를 계산합니다.',
    deepAnswer:
      '동일한 중간 결과가 여러 경로에 쓰이면 각 경로의 gradient가 합쳐집니다. 학습에 필요 없는 그래프를 계속 보관하면 memory가 늘어나므로 inference에서는 gradient 추적을 끄고, in-place 연산은 backward에 필요한 값을 훼손하지 않게 주의합니다.',
    keyPoints: ['연산 의존성을 그래프로 기록', '역방향에서 chain rule과 gradient 합산'],
    followUp: '같은 parameter가 계산 그래프의 두 경로에서 쓰이면 gradient는 어떻게 되나요?',
    prerequisites: ['math-chain-rule', 'dl-forward-loss'],
  },
  {
    id: 'dl-batch-epoch-iteration',
    category: 'dl',
    difficulty: 'foundation',
    term: 'Batch · Epoch · Iteration',
    prompt: 'Batch, Iteration, Epoch를 데이터 1,000개와 batch size 100으로 설명해보세요.',
    shortAnswer:
      'Batch는 한 번에 처리하는 100개 샘플 묶음이고 iteration은 그 batch로 한 번 parameter를 갱신하는 단계입니다. 1 epoch은 1,000개 전체를 한 번 사용한 것이므로 약 10 iterations입니다.',
    deepAnswer:
      '마지막 batch가 작을 수 있고 distributed training에서는 worker별 local batch와 전체 global batch를 구분해야 합니다. Epoch가 늘면 학습 기회가 늘지만 validation 성능이 꺾인 뒤 계속 학습하면 overfitting이 커질 수 있습니다.',
    keyPoints: ['Iteration은 한 번의 update 단계', 'Epoch는 전체 train set을 한 바퀴 사용'],
    followUp: 'Batch size를 두 배로 늘리면 한 epoch의 iteration 수는 어떻게 변하나요?',
    prerequisites: ['ml-train-validation-test'],
  },
  {
    id: 'dl-mini-batch-gradient',
    category: 'dl',
    difficulty: 'intermediate',
    term: 'Mini-Batch Gradient · Stochasticity',
    prompt: 'Full-batch 대신 Mini-batch로 gradient를 계산하는 이유는 무엇인가요?',
    shortAnswer:
      'Mini-batch는 전체 데이터보다 memory와 계산량이 작아 자주 update할 수 있고 GPU 병렬 연산도 활용합니다. 일부 샘플로 추정한 gradient에는 noise가 있지만 전체 gradient 방향의 근사로 학습할 수 있습니다.',
    deepAnswer:
      'Batch가 너무 작으면 gradient 분산이 커지고 hardware 활용이 나빠질 수 있으며, 너무 크면 memory를 많이 쓰고 update 횟수가 줄어듭니다. Batch size를 크게 바꾸면 learning rate와 normalization 동작도 함께 재조정해야 합니다.',
    keyPoints: ['계산 효율과 gradient 추정의 절충', 'Batch size는 learning rate와 함께 조정'],
    followUp: 'Gradient accumulation은 작은 GPU에서 큰 batch를 어떻게 흉내 내나요?',
    prerequisites: ['dl-batch-epoch-iteration', 'dl-gradient-descent-learning-rate'],
  },
  {
    id: 'dl-activation-output-choice',
    category: 'dl',
    difficulty: 'foundation',
    term: 'ReLU · Sigmoid · Tanh · Softmax',
    prompt: 'ReLU, Sigmoid, Tanh, Softmax는 어느 위치와 문제에서 주로 쓰이나요?',
    shortAnswer:
      'ReLU 계열은 hidden layer에 비선형성을 주는 데 흔히 쓰입니다. Sigmoid는 이진 확률, softmax는 상호 배타적인 다중 class 확률에 주로 쓰고 tanh는 값을 −1과 1 사이로 만듭니다.',
    deepAnswer:
      'Sigmoid와 tanh는 큰 절댓값에서 포화되어 gradient가 작아질 수 있습니다. Softmax는 벡터 전체를 합 1인 분포로 묶는 반면 sigmoid는 각 출력을 독립적으로 0과 1 사이에 두므로 multi-label과 multi-class를 구분해야 합니다.',
    keyPoints: [
      'Hidden activation과 output activation의 역할 구분',
      'Sigmoid는 독립 출력, softmax는 경쟁하는 분포',
    ],
    followUp: '한 이미지에 여러 태그가 동시에 붙을 수 있다면 sigmoid와 softmax 중 무엇이 맞나요?',
    prerequisites: ['dl-weight-bias-activation', 'ml-regression-classification'],
  },
  {
    id: 'dl-weight-initialization',
    category: 'dl',
    difficulty: 'intermediate',
    term: 'Xavier · He Initialization',
    prompt: '모든 weight를 0으로 초기화하면 안 되는 이유와 Xavier·He 초기화의 목적은 무엇인가요?',
    shortAnswer:
      '같은 층의 weight를 모두 0으로 두면 뉴런들이 같은 gradient를 받아 계속 같은 특징만 학습합니다. Xavier와 He 초기화는 층을 지날 때 activation과 gradient의 분산이 지나치게 커지거나 작아지지 않게 scale을 정합니다.',
    deepAnswer:
      'Xavier는 tanh 같은 activation, He는 ReLU 계열의 활성 비율을 고려한 초기화로 자주 사용합니다. 좋은 초기화는 학습을 안정시키지만 normalization, residual connection, optimizer를 대신하지는 않습니다.',
    keyPoints: ['0 초기화는 뉴런의 대칭성을 깨지 못함', '초기화 scale은 신호 분산 보존을 목표'],
    followUp: 'Bias는 0으로 초기화해도 weight와 같은 대칭성 문제가 덜한 이유는 무엇인가요?',
    prerequisites: ['dl-weight-bias-activation', 'math-mean-variance-standard-deviation'],
  },
  {
    id: 'dl-vanishing-exploding-gradient',
    category: 'dl',
    difficulty: 'intermediate',
    term: 'Vanishing · Exploding Gradient',
    prompt: '깊은 신경망에서 gradient가 사라지거나 폭발하는 원리를 설명해보세요.',
    shortAnswer:
      'Backpropagation은 여러 층의 local derivative를 연속해서 곱합니다. 이 값들이 반복해서 1보다 작으면 gradient가 0에 가까워지고, 크면 매우 커져 앞쪽 층이 학습하지 못하거나 update가 불안정해집니다.',
    deepAnswer:
      '적절한 initialization과 activation, normalization, residual connection이 gradient 흐름을 돕고 exploding gradient에는 clipping도 사용할 수 있습니다. Gradient clipping은 증상을 제한하지만 잘못된 learning rate나 구조의 근본 원인을 함께 찾아야 합니다.',
    keyPoints: ['Chain rule의 반복 곱에서 발생', '초기화·activation·residual이 흐름에 영향'],
    followUp:
      'Sigmoid가 깊은 hidden layer에서 vanishing gradient를 키울 수 있는 이유는 무엇인가요?',
    prerequisites: ['math-chain-rule', 'dl-weight-initialization'],
  },
  {
    id: 'dl-batchnorm-layernorm',
    category: 'dl',
    difficulty: 'advanced',
    term: 'Batch Normalization · Layer Normalization',
    prompt:
      'Batch Normalization과 Layer Normalization은 어느 축의 통계를 쓰는지가 어떻게 다른가요?',
    shortAnswer:
      'Batch normalization은 보통 batch의 여러 샘플에서 feature별 평균과 분산을 계산합니다. Layer normalization은 각 샘플 내부의 feature 차원에서 정규화해 batch 크기와 다른 샘플에 덜 의존합니다.',
    deepAnswer:
      'Batch norm은 train과 inference에서 쓰는 통계가 달라 running statistics를 관리합니다. Layer norm은 token별 hidden feature를 정규화하기 쉬워 가변 길이 sequence와 작은 batch를 다루는 Transformer에서 널리 사용됩니다.',
    keyPoints: ['Batch norm은 batch 통계에 의존', 'Layer norm은 샘플 내부 feature를 정규화'],
    followUp:
      'Batch size가 1에 가까울 때 batch normalization이 불안정할 수 있는 이유는 무엇인가요?',
    prerequisites: ['math-mean-variance-standard-deviation', 'dl-forward-loss'],
  },
  {
    id: 'dl-dropout-train-eval',
    category: 'dl',
    difficulty: 'intermediate',
    term: 'Dropout · Train Mode · Eval Mode',
    prompt: 'Dropout이 학습과 추론에서 다르게 동작하는 이유는 무엇인가요?',
    shortAnswer:
      '학습 중에는 일부 activation을 무작위로 0으로 만들어 특정 뉴런 조합에 과도하게 의존하지 않게 합니다. 추론에서는 모든 뉴런을 사용하고 학습 때의 기대 출력 크기와 맞도록 scaling된 값을 사용합니다.',
    deepAnswer:
      'PyTorch의 inverted dropout은 학습 중 남은 activation을 미리 보정해 eval에서는 그대로 통과시킵니다. Eval mode를 누락하면 출력이 매번 달라지고 batch norm 통계도 잘못 적용되어 검증과 배포 결과가 흔들릴 수 있습니다.',
    keyPoints: ['학습 중 stochastic regularization', '추론에서는 dropout을 비활성화'],
    followUp: 'Validation 전에 model.eval()을 호출하지 않으면 어떤 두 가지 문제가 생길 수 있나요?',
    prerequisites: ['ml-overfitting-bias-variance', 'dl-forward-loss'],
  },
  {
    id: 'dl-pytorch-training-loop',
    category: 'dl',
    difficulty: 'intermediate',
    term: 'zero_grad · backward · optimizer.step',
    prompt: 'PyTorch 학습 loop에서 zero_grad, backward, optimizer.step의 순서를 설명해보세요.',
    shortAnswer:
      '먼저 이전 gradient를 zero_grad로 비우고 forward로 prediction과 loss를 계산합니다. loss.backward()가 각 parameter의 gradient를 채우고 optimizer.step()이 그 gradient와 update 규칙으로 parameter를 바꿉니다.',
    deepAnswer:
      'PyTorch gradient는 기본적으로 누적되므로 의도한 gradient accumulation이 아니라면 매 update 전에 비워야 합니다. Evaluation에서는 no_grad 또는 inference_mode로 그래프 생성을 막아 memory와 연산을 줄이고 optimizer.step은 호출하지 않습니다.',
    keyPoints: ['Backward는 gradient 계산, step은 parameter 변경', 'Gradient는 기본적으로 누적'],
    followUp: 'Gradient accumulation을 의도할 때는 zero_grad 호출 시점을 어떻게 바꾸나요?',
    prerequisites: ['dl-computational-graph-autograd', 'dl-backprop-sgd-adam'],
  },
  {
    id: 'dl-gan-generator-discriminator',
    category: 'dl',
    difficulty: 'advanced',
    term: 'GAN · Generator · Discriminator',
    prompt: 'GAN의 Generator와 Discriminator는 어떤 경쟁을 통해 데이터 분포를 학습하나요?',
    shortAnswer:
      'Generator는 noise에서 실제 같은 sample을 만들고 discriminator는 실제 data와 생성 sample을 구분합니다. Generator는 discriminator를 속이도록, discriminator는 더 잘 구분하도록 번갈아 학습합니다.',
    deepAnswer:
      '이 adversarial objective가 균형을 이루면 생성 분포가 실제 분포에 가까워집니다. 하지만 두 network의 학습 균형이 깨지기 쉽고 다양한 입력이 비슷한 출력으로 모이는 mode collapse와 불안정한 convergence가 대표적 문제입니다.',
    keyPoints: ['두 network의 adversarial training', 'Mode collapse와 학습 불안정이 핵심 한계'],
    followUp:
      'Discriminator가 너무 빠르게 완벽해지면 Generator gradient에 어떤 문제가 생길 수 있나요?',
    prerequisites: ['dl-backprop-sgd-adam', 'ml-generative-discriminative'],
  },
  {
    id: 'dl-cnn-rnn-transformer',
    category: 'dl',
    difficulty: 'intermediate',
    term: 'CNN · RNN · Transformer',
    prompt: 'CNN, RNN, Transformer가 데이터의 관계를 처리하는 방식과 장단점을 비교해보세요.',
    shortAnswer:
      'CNN은 local receptive field와 weight sharing으로 공간 패턴에 강합니다. RNN은 hidden state를 순서대로 갱신하고, Transformer는 attention으로 token 관계를 직접 계산해 training 병렬화와 긴 거리 연결에 유리합니다.',
    deepAnswer:
      'RNN은 sequence 길이에 따른 순차 의존과 gradient 문제가 있고 기본 attention은 길이에 대해 제곱 비용이 큽니다. CNN도 계층을 쌓아 넓은 문맥을 보고 Transformer도 vision에 쓰이므로 이름보다 inductive bias와 계산 비용을 비교해야 합니다.',
    keyPoints: [
      'CNN은 locality, RNN은 recurrence, Transformer는 attention',
      'Task 구조와 계산 제약에 따라 선택',
    ],
    followUp: 'Transformer가 RNN보다 학습 병렬화에 유리한 이유는 무엇인가요?',
    prerequisites: ['dl-perceptron-neural-network', 'transformer-attention-vs-rnn'],
  },
] as const satisfies readonly StudyQuestion[]

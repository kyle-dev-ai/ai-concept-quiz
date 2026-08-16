import type { StudyQuestion } from '../domain/learning/question'
import { roadmapQuestions } from './roadmap-question-bank.ts'

const coreQuestions = [
  {
    id: 'math-vector-dot-product',
    category: 'math',
    difficulty: 'foundation',
    term: 'Vector · Matrix · Dot Product',
    prompt: '벡터와 행렬은 무엇이고, 내적은 AI에서 왜 자주 쓰이나요?',
    shortAnswer:
      '벡터는 방향과 크기를 가진 값의 배열이고 행렬은 벡터를 모은 2차원 배열입니다. 내적은 두 벡터의 대응 원소를 곱해 더한 값으로, 방향의 정렬 정도나 선형 변환 결과를 계산할 때 쓰입니다.',
    deepAnswer:
      '신경망의 한 뉴런은 입력 벡터와 가중치 벡터의 내적에 bias를 더하는 것으로 볼 수 있습니다. 임베딩 검색에서는 내적 또는 이를 크기로 정규화한 cosine similarity로 벡터가 얼마나 비슷한 방향을 가리키는지 비교합니다.',
    keyPoints: [
      '뉴런의 선형 결합은 입력과 가중치의 내적',
      'cosine similarity는 크기보다 방향을 비교',
    ],
    followUp: '내적이 0이라는 것은 기하학적으로 무엇을 뜻하나요?',
    prerequisites: [],
  },
  {
    id: 'math-gradient-partial-derivative',
    category: 'math',
    difficulty: 'intermediate',
    term: 'Partial Derivative · Gradient',
    prompt: '편미분과 gradient의 차이를 신경망 학습과 연결해 설명해보세요.',
    shortAnswer:
      '편미분은 여러 변수 중 하나만 변화시켰을 때 함수가 얼마나 변하는지 나타냅니다. Gradient는 모든 변수에 대한 편미분을 모은 벡터이며 함수값이 가장 빠르게 증가하는 방향을 가리킵니다.',
    deepAnswer:
      'Loss를 각 weight로 편미분하면 해당 weight가 loss에 미치는 민감도를 얻습니다. 학습은 loss를 줄이기 위해 gradient의 반대 방향으로 파라미터를 이동합니다. 기울기의 크기는 변화율이지 곧바로 최적의 이동량은 아니므로 learning rate가 필요합니다.',
    keyPoints: ['편미분은 한 변수의 변화율', 'Gradient descent는 gradient의 반대 방향으로 이동'],
    followUp: 'Gradient가 0이면 항상 최솟값에 도달한 것인가요?',
    prerequisites: ['math-vector-dot-product'],
  },
  {
    id: 'math-chain-rule',
    category: 'math',
    difficulty: 'intermediate',
    term: 'Chain Rule',
    prompt: 'Chain Rule이 없다면 왜 깊은 신경망을 학습시키기 어려울까요?',
    shortAnswer:
      'Chain Rule은 합성함수의 미분을 각 단계의 국소 미분 곱으로 분해합니다. 덕분에 출력의 loss가 앞쪽 각 파라미터에 미친 영향을 층을 거슬러 계산할 수 있습니다.',
    deepAnswer:
      'Backpropagation은 계산 그래프의 뒤에서부터 local gradient를 재사용하며 Chain Rule을 효율적으로 적용하는 알고리즘입니다. 긴 경로에서 작은 미분값이 계속 곱해지면 vanishing gradient, 큰 값이 곱해지면 exploding gradient가 생길 수 있습니다.',
    keyPoints: [
      '합성함수 미분을 국소 미분의 곱으로 분해',
      'Backpropagation은 Chain Rule의 효율적 구현',
    ],
    followUp: 'Vanishing gradient는 어떤 구조나 activation에서 더 쉽게 생기나요?',
    prerequisites: ['math-gradient-partial-derivative'],
  },
  {
    id: 'ml-ai-ml-dl',
    category: 'ml',
    difficulty: 'foundation',
    term: 'AI · ML · DL',
    prompt: 'AI, Machine Learning, Deep Learning의 포함 관계를 예시와 함께 말해보세요.',
    shortAnswer:
      'AI는 지능적 행동을 수행하는 시스템 전체를 뜻하고, ML은 데이터를 통해 규칙을 학습하는 AI 방법입니다. DL은 여러 층의 neural network로 표현을 학습하는 ML의 한 분야입니다.',
    deepAnswer:
      '규칙 기반 전문가 시스템은 AI이지만 반드시 ML은 아닙니다. 선형회귀나 decision tree는 ML이지만 DL은 아닙니다. Transformer 기반 LLM은 여러 층의 neural network를 학습하므로 DL에 속합니다.',
    keyPoints: ['AI ⊃ ML ⊃ DL', '포함 관계는 구현 방식과 학습 방법의 범위를 나타냄'],
    followUp: '규칙 기반 시스템과 ML 시스템을 함께 쓰는 사례는 무엇이 있을까요?',
    prerequisites: [],
  },
  {
    id: 'ml-supervised-unsupervised',
    category: 'ml',
    difficulty: 'foundation',
    term: 'Supervised · Unsupervised Learning',
    prompt: 'Supervised와 Unsupervised Learning은 학습 신호가 어떻게 다른가요?',
    shortAnswer:
      'Supervised Learning은 입력과 정답 label의 쌍으로 예측 오차를 줄입니다. Unsupervised Learning은 명시적 정답 없이 데이터의 구조, 군집, 표현을 찾습니다.',
    deepAnswer:
      '분류와 회귀는 대표적인 supervised task이고 clustering이나 dimensionality reduction은 대표적인 unsupervised task입니다. 실제 시스템에서는 self-supervised pretraining처럼 데이터 자체에서 label 역할을 만들어 대규모 표현을 학습하기도 합니다.',
    keyPoints: ['차이는 정답 신호의 존재 방식', 'Self-supervised는 데이터에서 학습 목표를 구성'],
    followUp: 'LLM의 next-token pretraining은 왜 self-supervised라고 부르나요?',
    prerequisites: ['ml-ai-ml-dl'],
  },
  {
    id: 'ml-feature-label-prediction',
    category: 'ml',
    difficulty: 'foundation',
    term: 'Feature · Label · Prediction',
    prompt: 'Feature, Label, Prediction을 집값 예측 예시로 구분해보세요.',
    shortAnswer:
      'Feature X는 모델에 넣는 평수, 방 개수, 위치 같은 입력 특성입니다. Label y는 학습 데이터에 있는 실제 집값이고, Prediction ŷ는 모델이 계산한 집값입니다.',
    deepAnswer:
      '지도학습은 feature에서 prediction을 만든 뒤 label과 비교해 loss를 계산합니다. 학습 데이터의 label은 정답 신호로 쓰이지만 실제 추론 시점에는 알 수 없으므로, 모델은 새 feature만으로 prediction을 만들어야 합니다.',
    keyPoints: [
      'X는 입력 feature, y는 실제 label',
      'ŷ는 모델의 prediction이며 y와의 차이로 loss 계산',
    ],
    followUp: '추론 시점에도 label이 필요하다면 어떤 data leakage를 의심해야 하나요?',
    prerequisites: ['ml-supervised-unsupervised'],
  },
  {
    id: 'ml-self-supervised-signal',
    category: 'ml',
    difficulty: 'intermediate',
    term: 'Self-Supervised Learning',
    prompt: 'Self-Supervised Learning은 Unsupervised Learning과 무엇이 다르고 왜 유용한가요?',
    shortAnswer:
      'Self-supervised learning은 사람이 붙인 label 없이 데이터 일부를 가리거나 다음 부분을 맞히는 식으로 정답 역할의 학습 신호를 데이터 자체에서 만듭니다. 대규모 원시 데이터를 활용해 일반적인 표현을 pretraining할 수 있다는 장점이 있습니다.',
    deepAnswer:
      '명시적 사람이 만든 label은 없지만 입력과 target을 구성해 supervised loss 형태로 학습한다는 점이 단순 clustering 같은 unsupervised task와 다릅니다. BERT의 masked token 예측과 GPT의 next-token prediction이 대표적이며, 특정 task에는 이후 supervised fine-tuning이 필요할 수 있습니다.',
    keyPoints: [
      '정답 신호를 데이터 자체에서 구성',
      'Pretraining과 task-specific supervised learning은 역할이 다름',
    ],
    followUp:
      'Self-supervised pretraining이 특정 task의 높은 성능을 자동으로 보장하지 않는 이유는 무엇인가요?',
    prerequisites: ['ml-supervised-unsupervised', 'ml-feature-label-prediction'],
  },
  {
    id: 'ml-train-validation-test',
    category: 'ml',
    difficulty: 'foundation',
    term: 'Train · Validation · Test',
    prompt: '데이터를 Train, Validation, Test로 나누는 이유는 무엇인가요?',
    shortAnswer:
      'Train set은 파라미터 학습에, Validation set은 hyperparameter와 모델 선택에, Test set은 최종 일반화 성능 추정에 사용합니다. Test를 반복 의사결정에 쓰면 사실상 validation 데이터가 되어 성능 추정이 낙관적으로 편향됩니다.',
    deepAnswer:
      '세 집합은 같은 실제 분포를 대표해야 하며 중복 사용자나 시간 누수처럼 정보가 섞이지 않게 분리해야 합니다. 시계열이나 사용자 데이터는 무작위 행 분할보다 시간 또는 사용자 단위 분할이 더 적절할 수 있습니다.',
    keyPoints: ['Test set은 마지막 독립 평가용', 'Data leakage가 있으면 지표를 신뢰할 수 없음'],
    followUp: '같은 사용자의 데이터가 train과 test에 섞이면 어떤 문제가 생기나요?',
    prerequisites: ['ml-supervised-unsupervised'],
  },
  {
    id: 'ml-parameter-hyperparameter',
    category: 'ml',
    difficulty: 'foundation',
    term: 'Parameter · Hyperparameter',
    prompt: 'Parameter와 Hyperparameter는 누가, 언제 정하는 값인가요?',
    shortAnswer:
      'Parameter는 weight와 bias처럼 train data와 loss를 통해 모델이 학습하는 값입니다. Hyperparameter는 learning rate, batch size, 모델 깊이처럼 학습 방식이나 구조를 정하기 위해 학습 실행 전에 사람이 설정하거나 탐색하는 값입니다.',
    deepAnswer:
      'Validation 결과로 hyperparameter와 모델을 선택하고, test set은 그 선택이 끝난 뒤 최종 평가에 남겨둡니다. 자동 탐색 도구가 hyperparameter를 고르더라도 일반적인 단일 training run의 gradient로 직접 갱신되는 model parameter와 역할은 구분됩니다.',
    keyPoints: [
      'Parameter는 training objective로 학습',
      'Hyperparameter 선택에는 validation 결과 사용',
    ],
    followUp: 'Test 성능을 보며 learning rate를 고르면 왜 test leakage가 되나요?',
    prerequisites: ['ml-train-validation-test'],
  },
  {
    id: 'ml-regression-classification',
    category: 'ml',
    difficulty: 'foundation',
    term: 'Regression · Classification',
    prompt: 'Regression과 Classification은 출력과 loss 관점에서 어떻게 다른가요?',
    shortAnswer:
      'Regression은 가격처럼 연속값을 예측하고, Classification은 클래스 또는 클래스 확률을 예측합니다. Regression에는 MSE, Classification에는 cross entropy가 흔히 사용되지만 문제의 가정에 따라 달라질 수 있습니다.',
    deepAnswer:
      'MSE는 큰 오차를 제곱으로 더 크게 벌주며 Gaussian noise 가정과 연결됩니다. Cross entropy는 정답 분포와 예측 확률 분포의 차이를 줄이고, softmax와 함께 다중 클래스 확률을 학습할 때 자주 사용합니다.',
    keyPoints: ['출력 공간이 연속값인지 범주인지 구분', 'Loss는 문제와 데이터 분포의 가정을 반영'],
    followUp: 'Binary classification에서 sigmoid와 softmax 중 무엇을 쓸 수 있나요?',
    prerequisites: ['ml-supervised-unsupervised'],
  },
  {
    id: 'ml-loss-vs-metric',
    category: 'ml',
    difficulty: 'intermediate',
    term: 'Loss Function · Evaluation Metric',
    prompt: '학습에 Loss Function이 필요한 이유와 Evaluation Metric과의 차이를 설명해보세요.',
    shortAnswer:
      'Loss는 prediction과 target의 오차를 학습이 줄일 수 있는 하나의 값으로 만들고, gradient를 통해 parameter update 방향을 제공합니다. Evaluation metric은 accuracy나 F1처럼 최종 성능을 사람이 해석하기 위한 값으로 미분 가능할 필요가 없습니다.',
    deepAnswer:
      'Regression에는 MSE, classification에는 cross entropy가 자주 쓰이지만 문제 가정과 목표에 따라 선택해야 합니다. Accuracy는 예측 class가 바뀌기 전까지 값이 일정해 gradient 정보를 주기 어려우므로 보통 직접 loss로 쓰지 않습니다. 따라서 training loss가 낮아져도 실제 metric이나 비즈니스 결과가 항상 좋아지는 것은 아닙니다.',
    keyPoints: [
      'Loss는 최적화를 위한 미분 가능한 신호',
      'Metric은 해석과 비교를 위한 최종 평가 기준',
    ],
    followUp: 'Class imbalance가 심할 때 accuracy만 보면 어떤 문제가 생기나요?',
    prerequisites: ['ml-feature-label-prediction', 'ml-regression-classification'],
  },
  {
    id: 'ml-overfitting-bias-variance',
    category: 'ml',
    difficulty: 'intermediate',
    term: 'Overfitting · Bias · Variance',
    prompt: 'Overfitting을 Bias-Variance 관점에서 설명하고 대응 방법을 말해보세요.',
    shortAnswer:
      'Overfitting은 train 데이터에는 잘 맞지만 새로운 데이터에는 일반화하지 못하는 상태로, 보통 높은 variance와 연결됩니다. 더 많은 대표 데이터, regularization, augmentation, early stopping, 적절한 모델 크기로 줄일 수 있습니다.',
    deepAnswer:
      '높은 bias는 모델이 너무 단순하거나 학습이 부족해 train과 validation 모두 성능이 낮은 underfitting으로 나타납니다. 높은 variance는 train 성능은 좋지만 validation 성능이 나쁜 간격으로 관찰됩니다. 원인을 구분하지 않고 모델을 키우거나 줄이면 반대 문제가 커질 수 있습니다.',
    keyPoints: [
      'Train-validation gap으로 진단',
      'Regularization은 표현력과 일반화의 trade-off를 조절',
    ],
    followUp: 'Dropout과 weight decay는 각각 어떤 방식으로 regularization하나요?',
    prerequisites: ['ml-train-validation-test'],
  },
  {
    id: 'dl-perceptron-neural-network',
    category: 'dl',
    difficulty: 'foundation',
    term: 'Perceptron · Neural Network',
    prompt: 'Perceptron 하나와 여러 층의 neural network는 표현력에서 무엇이 다른가요?',
    shortAnswer:
      'Perceptron은 입력의 가중합에 activation을 적용하는 단순한 계산 단위입니다. 여러 층을 쌓고 비선형 activation을 넣으면 단일 선형 경계로 풀 수 없는 복잡한 함수를 표현할 수 있습니다.',
    deepAnswer:
      '층을 여러 개 쌓아도 activation이 모두 선형이면 전체는 하나의 선형 변환으로 합쳐집니다. 따라서 깊이의 표현력을 얻으려면 ReLU 같은 비선형성이 필요합니다. XOR은 단층 선형 분류기의 한계를 보여주는 고전적 예입니다.',
    keyPoints: ['뉴런은 weighted sum + activation', '비선형 activation이 깊은 층의 표현력을 만듦'],
    followUp: '선형 activation만 여러 층 쌓으면 왜 한 층과 같아지나요?',
    prerequisites: ['math-vector-dot-product', 'ml-ai-ml-dl'],
  },
  {
    id: 'dl-weight-bias-activation',
    category: 'dl',
    difficulty: 'foundation',
    term: 'Weight · Bias · Activation',
    prompt: 'Weight, Bias, Activation Function의 역할을 각각 설명해보세요.',
    shortAnswer:
      'Weight는 입력 특징의 영향력과 변환 방향을 학습하고, bias는 결정 경계를 원점에서 이동시킵니다. Activation은 선형 변환에 비선형성을 더해 복잡한 패턴을 표현하게 합니다.',
    deepAnswer:
      'ReLU는 양수 구간의 gradient를 유지해 깊은 신경망에서 널리 쓰입니다. Sigmoid는 값을 0과 1 사이로 만들지만 큰 절댓값에서 gradient가 작아질 수 있습니다. 출력층 activation은 회귀, 이진 분류, 다중 분류 등 task에 맞춰 선택합니다.',
    keyPoints: [
      'Weight와 bias는 학습되는 파라미터',
      'Activation 선택은 표현력과 gradient 흐름에 영향',
    ],
    followUp: 'ReLU의 dying ReLU 문제는 무엇인가요?',
    prerequisites: ['dl-perceptron-neural-network'],
  },
  {
    id: 'dl-forward-loss',
    category: 'dl',
    difficulty: 'foundation',
    term: 'Forward Propagation · Loss',
    prompt: '입력에서 loss가 계산될 때까지의 forward 흐름을 설명해보세요.',
    shortAnswer:
      '입력이 각 층의 weight, bias, activation을 순서대로 지나 prediction이 됩니다. Loss function은 prediction과 target의 차이를 하나의 최적화 가능한 값으로 측정합니다.',
    deepAnswer:
      'Training mode의 forward는 prediction뿐 아니라 backward에 필요한 중간 activation을 계산 그래프에 보관합니다. Loss는 비즈니스 지표 그 자체가 아닐 수 있으며 미분 가능성과 task의 통계적 가정을 고려해 선택합니다.',
    keyPoints: [
      'Input → layers → prediction → loss',
      'Loss와 최종 평가 지표는 역할이 다를 수 있음',
    ],
    followUp: 'Accuracy를 그대로 loss로 쓰기 어려운 이유는 무엇인가요?',
    prerequisites: ['dl-weight-bias-activation', 'ml-regression-classification'],
  },
  {
    id: 'dl-gradient-descent-learning-rate',
    category: 'dl',
    difficulty: 'intermediate',
    term: 'Gradient Descent · Learning Rate',
    prompt: 'Gradient Descent와 Learning Rate의 관계를 직관적으로 설명해보세요.',
    shortAnswer:
      'Gradient descent는 loss가 가장 빠르게 증가하는 gradient의 반대 방향으로 파라미터를 갱신합니다. Learning rate는 한 번에 이동할 크기를 정해 너무 크면 발산하고 너무 작으면 학습이 느리거나 나쁜 지점에 오래 머물 수 있습니다.',
    deepAnswer:
      'Mini-batch gradient는 전체 데이터 gradient의 noisy estimate라서 효율성과 일반화에 도움을 줄 수 있습니다. Scheduler, warmup, adaptive optimizer는 학습 단계와 파라미터별로 효과적인 이동 크기를 조절합니다.',
    keyPoints: [
      '방향은 gradient, 보폭은 learning rate',
      'Mini-batch는 계산량과 gradient noise를 조절',
    ],
    followUp: 'Learning rate warmup은 Transformer 학습에서 왜 자주 쓰이나요?',
    prerequisites: ['math-gradient-partial-derivative', 'dl-forward-loss'],
  },
  {
    id: 'dl-backprop-sgd-adam',
    category: 'dl',
    difficulty: 'intermediate',
    term: 'Backpropagation · SGD · Adam',
    prompt: 'Backpropagation과 optimizer는 어떤 일을 나눠서 하나요?',
    shortAnswer:
      'Backpropagation은 Chain Rule로 각 파라미터의 gradient를 계산합니다. Optimizer는 그 gradient와 상태를 이용해 실제 파라미터 업데이트 값을 결정합니다.',
    deepAnswer:
      'SGD는 현재 gradient를 중심으로 갱신하고 momentum을 더해 진동을 줄일 수 있습니다. Adam은 gradient의 1차·2차 모멘트 추정으로 파라미터별 adaptive step을 사용합니다. Adam이 항상 더 좋은 일반화를 보장하지는 않으므로 task와 설정에 따라 비교해야 합니다.',
    keyPoints: [
      'Backward는 gradient 계산, optimizer는 update 규칙',
      'Adam은 모멘트 기반 adaptive learning rate 사용',
    ],
    followUp: 'AdamW는 Adam의 weight decay를 어떻게 다르게 처리하나요?',
    prerequisites: ['math-chain-rule', 'dl-gradient-descent-learning-rate'],
  },
  {
    id: 'transformer-embedding',
    category: 'transformer',
    difficulty: 'foundation',
    term: 'Embedding',
    prompt: 'Token ID를 그대로 쓰지 않고 embedding으로 바꾸는 이유는 무엇인가요?',
    shortAnswer:
      'Token ID는 단순한 식별 번호라 숫자 사이의 거리나 순서에 의미가 없습니다. Embedding은 각 token을 학습 가능한 연속 벡터로 바꿔 모델이 의미와 사용 맥락의 특징을 계산할 수 있게 합니다.',
    deepAnswer:
      'Embedding matrix에서 token ID에 해당하는 행을 조회하고, 학습 과정에서 다른 파라미터와 함께 갱신합니다. 비슷한 맥락에서 쓰인 token이 가까운 표현을 가질 수 있지만 모든 의미가 하나의 고정 벡터에 완전히 담기는 것은 아닙니다.',
    keyPoints: [
      'ID는 식별자, embedding은 학습되는 표현',
      '연속 벡터 공간에서 유사성과 변환을 계산',
    ],
    followUp: 'Contextual embedding은 고정 word embedding과 무엇이 다른가요?',
    prerequisites: ['math-vector-dot-product'],
  },
  {
    id: 'transformer-attention-vs-rnn',
    category: 'transformer',
    difficulty: 'intermediate',
    term: 'Attention vs RNN',
    prompt: 'Transformer가 RNN보다 긴 문맥과 병렬 학습에 유리한 이유는 무엇인가요?',
    shortAnswer:
      'RNN은 이전 hidden state를 순차적으로 전달하지만 self-attention은 한 층에서 모든 token 쌍의 관계를 직접 계산할 수 있습니다. 그래서 학습 시 token 축 병렬화가 쉽고 먼 위치 사이의 정보 경로도 짧습니다.',
    deepAnswer:
      '다만 표준 attention은 sequence length에 대해 시간과 메모리가 대체로 O(n²)이므로 긴 문맥에서 비용이 커집니다. Transformer의 이점이 모든 상황에서 절대적인 것은 아니며 streaming이나 매우 긴 sequence에는 다른 구조적 trade-off가 있습니다.',
    keyPoints: ['순차 recurrence 대신 token 간 직접 상호작용', '표준 attention의 O(n²) 비용'],
    followUp: 'KV cache는 autoregressive inference의 어떤 중복 계산을 줄이나요?',
    prerequisites: ['transformer-embedding'],
  },
  {
    id: 'transformer-self-attention',
    category: 'transformer',
    difficulty: 'intermediate',
    term: 'Self-Attention',
    prompt: 'Self-Attention을 “문장 안에서 문맥을 섞는 과정”으로 설명해보세요.',
    shortAnswer:
      '각 token이 같은 sequence의 다른 token들과 관련도를 계산하고, 관련도가 높은 token의 value를 더 많이 섞어 새로운 표현을 만듭니다. 그래서 같은 단어도 주변 문맥에 따라 다른 representation을 가질 수 있습니다.',
    deepAnswer:
      '각 위치의 출력은 attention weight로 value들을 가중합한 결과입니다. Decoder의 causal self-attention은 미래 token을 보지 못하도록 mask를 적용합니다. Attention weight를 곧바로 인간이 해석하는 중요도와 동일시하면 안 됩니다.',
    keyPoints: ['동일 sequence 안의 관계를 사용해 표현 갱신', 'Decoder 학습에는 causal mask 적용'],
    followUp: 'Self-attention과 cross-attention은 Q, K, V의 출처가 어떻게 다른가요?',
    prerequisites: ['transformer-embedding', 'transformer-attention-vs-rnn'],
  },
  {
    id: 'transformer-qkv',
    category: 'transformer',
    difficulty: 'intermediate',
    term: 'Query · Key · Value',
    prompt: 'Q, K, V는 각각 무엇이며 왜 같은 입력을 세 번 투영하나요?',
    shortAnswer:
      'Query는 현재 token이 찾는 정보, Key는 각 token이 어떤 요청과 맞는지 비교할 표지, Value는 실제로 전달할 내용에 해당합니다. 같은 입력을 서로 다른 학습 행렬로 투영해 매칭 역할과 전달 역할을 분리합니다.',
    deepAnswer:
      'QKᵀ로 위치 간 score를 만들고 softmax로 weight를 정규화한 뒤 V의 가중합을 구합니다. “질문·색인·내용” 비유는 직관일 뿐 실제 벡터의 의미는 task와 학습을 통해 형성됩니다.',
    keyPoints: ['QK는 관계 score, V는 집계할 정보', '서로 다른 projection으로 역할 분리'],
    followUp: 'Cross-attention에서 Query와 Key/Value는 각각 어디서 오나요?',
    prerequisites: ['transformer-self-attention'],
  },
  {
    id: 'transformer-scaled-multi-head',
    category: 'transformer',
    difficulty: 'advanced',
    term: 'Scaled Dot-Product · Multi-Head Attention',
    prompt: 'Attention score를 √dₖ로 나누고 여러 head로 나누는 이유는 무엇인가요?',
    shortAnswer:
      '차원이 커질수록 Q·K 내적의 분산이 커져 softmax가 포화될 수 있어 √dₖ로 scale해 gradient를 안정화합니다. Multi-head는 더 작은 여러 표현 공간에서 서로 다른 관계 패턴을 병렬로 학습할 기회를 줍니다.',
    deepAnswer:
      '독립 성분의 분산이 비슷하다고 보면 내적의 분산은 dₖ에 비례하므로 표준편차인 √dₖ로 나누는 직관을 얻습니다. 여러 head가 항상 사람이 구분할 수 있는 문법 역할을 하나씩 맡는다고 보장되지는 않습니다.',
    keyPoints: [
      'Scaling은 softmax 포화와 작은 gradient를 완화',
      '여러 representation subspace에서 관계를 계산',
    ],
    followUp: 'Head 수를 늘리면 항상 성능이 좋아지지 않는 이유는 무엇인가요?',
    prerequisites: ['transformer-qkv', 'math-gradient-partial-derivative'],
  },
  {
    id: 'transformer-positional-encoding',
    category: 'transformer',
    difficulty: 'intermediate',
    term: 'Positional Encoding',
    prompt: 'Transformer에 위치 정보가 별도로 필요한 이유는 무엇인가요?',
    shortAnswer:
      'Self-attention만으로는 입력 순서를 바꿨을 때 순서 자체를 구분할 정보가 없습니다. Positional encoding 또는 position embedding을 token 표현에 결합해 순서와 상대 위치를 학습할 수 있게 합니다.',
    deepAnswer:
      '고정 sinusoidal 방식, 학습형 absolute position, RoPE 같은 relative 성격의 방식이 있습니다. 방식에 따라 긴 문맥 외삽, attention score에 위치를 반영하는 방법, 최대 길이 특성이 달라집니다.',
    keyPoints: [
      'Attention 자체는 순서 정보를 자동으로 갖지 않음',
      '위치 표현 방식은 긴 문맥 일반화에 영향',
    ],
    followUp: 'RoPE는 위치 정보를 Q와 K에 어떤 방식으로 반영하나요?',
    prerequisites: ['transformer-self-attention'],
  },
  {
    id: 'transformer-encoder-decoder',
    category: 'transformer',
    difficulty: 'intermediate',
    term: 'Encoder · Decoder · Decoder-only',
    prompt: 'Transformer Encoder, Decoder, Decoder-only 구조의 정보 흐름을 비교해보세요.',
    shortAnswer:
      'Encoder는 입력 전체를 양방향으로 보며 표현을 만들고, Decoder는 이전 token만 보며 다음 token을 생성하면서 필요하면 encoder 출력에 cross-attention합니다. GPT 계열 decoder-only 모델은 causal self-attention으로 하나의 sequence를 이어 생성합니다.',
    deepAnswer:
      'BERT형 encoder-only는 문맥 이해와 표현 학습에, 원래 Transformer encoder-decoder는 번역 같은 sequence-to-sequence에, decoder-only는 autoregressive generation에 적합한 inductive bias를 가집니다. 실제 선택은 task와 학습 방식에 따라 달라집니다.',
    keyPoints: [
      'Encoder는 bidirectional, 생성 decoder는 causal',
      'Encoder-decoder에는 입력을 보는 cross-attention 존재',
    ],
    followUp: 'BERT의 masked language modeling과 GPT의 causal modeling은 어떻게 다른가요?',
    prerequisites: ['transformer-self-attention', 'transformer-positional-encoding'],
  },
  {
    id: 'transformer-causal-mask',
    category: 'transformer',
    difficulty: 'intermediate',
    term: 'Causal Mask · Next-Token Prediction',
    prompt: 'GPT의 self-attention에 Causal Mask가 필요한 이유는 무엇인가요?',
    shortAnswer:
      'Causal mask는 각 위치가 현재와 이전 token만 보고 미래 token에는 attention하지 못하게 막습니다. 다음 token을 맞히는 training 중 정답이 될 미래 정보를 미리 보는 leakage를 방지하고 실제 autoregressive 생성 조건과 맞춥니다.',
    deepAnswer:
      'Training에서는 sequence의 여러 위치를 병렬로 계산할 수 있지만 attention score의 미래 위치를 mask한 뒤 softmax합니다. Inference에서는 생성된 token을 입력에 덧붙여 한 단계씩 이어갑니다. Padding mask는 의미 없는 padding 위치를 막는 용도라 causal mask와 목적이 다릅니다.',
    keyPoints: [
      '미래 token을 보지 못하게 해 target leakage 방지',
      '병렬 training과 순차 autoregressive inference의 조건을 맞춤',
    ],
    followUp: 'Causal mask와 padding mask는 각각 attention matrix의 어떤 위치를 막나요?',
    prerequisites: ['transformer-encoder-decoder'],
  },
  {
    id: 'llm-tokenization-context-window',
    category: 'llm',
    difficulty: 'foundation',
    term: 'Tokenization · Context Window',
    prompt: 'Token과 context window가 LLM의 품질·비용에 어떤 영향을 주나요?',
    shortAnswer:
      'Tokenizer는 텍스트를 모델이 처리하는 token 단위로 나눕니다. Context window는 한 번에 참고할 수 있는 token 수의 한계로, 입력과 출력 token이 길수록 계산량·지연시간·비용이 커집니다.',
    deepAnswer:
      'Token은 단어와 일치하지 않으며 언어와 문자열에 따라 한 단어가 여러 subword로 나뉩니다. 문맥 창 안에 정보가 들어 있다고 항상 모델이 정확히 사용하는 것은 아니며 위치, 잡음, attention 패턴도 품질에 영향을 줍니다.',
    keyPoints: [
      'Token 수는 문자 수나 단어 수와 다름',
      '긴 context는 용량이지 정확한 활용 보장이 아님',
    ],
    followUp: '같은 의미의 프롬프트라도 언어에 따라 비용이 달라질 수 있는 이유는 무엇인가요?',
    prerequisites: ['transformer-embedding'],
  },
  {
    id: 'llm-pretraining-next-token',
    category: 'llm',
    difficulty: 'intermediate',
    term: 'Pretraining · Next-Token Prediction',
    prompt: 'Next-token prediction만으로 LLM이 다양한 능력을 얻는 과정을 설명해보세요.',
    shortAnswer:
      '대규모 텍스트에서 이전 token을 보고 다음 token의 확률을 높이도록 학습하면 문법, 사실 패턴, 추론에 필요한 표현을 압축해 학습합니다. 다양한 task를 텍스트 continuation 형태로 표현할 수 있어 범용성이 생깁니다.',
    deepAnswer:
      '모델은 세계의 사실을 데이터베이스처럼 정확히 저장하기보다 다음 token 분포를 근사합니다. 따라서 유창함이 사실성을 보장하지 않고, 데이터 편향과 objective의 차이 때문에 instruction tuning과 alignment, retrieval이 추가로 필요할 수 있습니다.',
    keyPoints: [
      '학습 목표는 조건부 token 확률의 log loss 최소화',
      '유창한 생성과 사실 정확성은 별개',
    ],
    followUp: 'Scaling law는 데이터·모델·compute 배분에 어떤 시사점을 주나요?',
    prerequisites: ['transformer-encoder-decoder', 'ml-supervised-unsupervised'],
  },
  {
    id: 'llm-temperature-top-p',
    category: 'llm',
    difficulty: 'foundation',
    term: 'Inference · Temperature · Top-p',
    prompt: 'Temperature와 Top-p는 생성 결과를 어떻게 바꾸나요?',
    shortAnswer:
      'Temperature는 logit 분포의 날카로움을 조절해 낮을수록 높은 확률 token에 집중하고 높을수록 다양성을 키웁니다. Top-p는 누적 확률 p를 채우는 최소 후보 집합 안에서 sampling합니다.',
    deepAnswer:
      '둘은 학습된 지식을 바꾸지 않고 decoding 분포만 조절합니다. 낮은 temperature도 hallucination을 제거하지 못하며, 분류·추출처럼 재현성이 중요한 task와 창작 task는 다른 설정과 평가가 필요합니다.',
    keyPoints: ['Temperature는 분포의 sharpness 조절', 'Top-p는 확률 질량 기준으로 후보 집합 제한'],
    followUp: 'Greedy decoding과 beam search는 sampling과 무엇이 다른가요?',
    prerequisites: ['llm-pretraining-next-token'],
  },
  {
    id: 'llm-peft-lora',
    category: 'llm',
    difficulty: 'intermediate',
    term: 'Fine-tuning · PEFT · LoRA',
    prompt: 'LoRA가 full fine-tuning보다 가벼운 이유와 한계를 말해보세요.',
    shortAnswer:
      'LoRA는 원본 weight를 고정하고 weight 변화량을 낮은 rank의 두 행렬 곱으로 학습합니다. 학습 파라미터와 optimizer memory가 줄어 여러 task adapter를 관리하기 쉽습니다.',
    deepAnswer:
      '필요한 변화가 low-rank로 충분히 표현된다는 가정을 활용합니다. Base model 실행 비용 자체가 사라지는 것은 아니며, 새로운 사실을 안정적으로 주입하거나 큰 행동 변화를 만드는 데 항상 최선은 아닙니다. 데이터 품질과 evaluation이 여전히 핵심입니다.',
    keyPoints: ['ΔW ≈ BA 형태의 low-rank update', '학습 비용 절감과 서빙 비용 절감은 구분'],
    followUp: '새로운 사내 문서를 반영할 때 LoRA와 RAG 중 무엇을 먼저 검토하나요?',
    prerequisites: ['dl-backprop-sgd-adam', 'llm-pretraining-next-token'],
  },
  {
    id: 'llm-rlhf-dpo-hallucination',
    category: 'llm',
    difficulty: 'advanced',
    term: 'RLHF · DPO · Hallucination',
    prompt:
      'RLHF와 DPO의 차이, 그리고 둘이 hallucination을 완전히 없애지 못하는 이유는 무엇인가요?',
    shortAnswer:
      '전형적 RLHF는 선호 데이터로 reward model을 학습하고 RL로 policy를 최적화합니다. DPO는 선택·비선택 응답 쌍에서 선호 policy를 직접 최적화해 별도 reward model과 online RL 단계를 단순화합니다.',
    deepAnswer:
      '두 방법은 사람 선호에 맞는 행동을 강화하지만 외부 사실을 검증하는 장치는 아닙니다. 학습 데이터 부족, 모호한 prompt, decoding, retrieval 실패 때문에 사실과 다른 응답은 남을 수 있어 grounding, tool use, abstention, 평가가 함께 필요합니다.',
    keyPoints: [
      'Alignment는 선호 최적화이지 사실 DB 보장이 아님',
      'Hallucination 대응은 시스템 수준의 다중 방어가 필요',
    ],
    followUp: '모델이 모를 때 모른다고 답하게 만드는 평가는 어떻게 설계할 수 있나요?',
    prerequisites: ['llm-pretraining-next-token', 'ml-train-validation-test'],
  },
  {
    id: 'rag-vs-fine-tuning',
    category: 'rag',
    difficulty: 'foundation',
    term: 'RAG vs Fine-tuning',
    prompt: '최신 사내 문서를 답하게 할 때 Fine-tuning보다 RAG를 먼저 보는 이유는 무엇인가요?',
    shortAnswer:
      'RAG는 질의 시점에 외부 문서를 검색해 context로 제공하므로 지식을 자주 갱신하고 출처를 제시하기 쉽습니다. Fine-tuning은 주로 행동, 형식, task 적응에 강하고 사실 업데이트를 정확히 보장하지 않습니다.',
    deepAnswer:
      'RAG는 retrieval 실패, context noise, 지연시간이라는 비용이 있고 fine-tuning은 데이터 제작, 재학습, 회귀 평가 비용이 있습니다. 둘은 배타적이지 않으며 fine-tuned model이 retrieval context를 더 잘 쓰도록 조합할 수 있습니다.',
    keyPoints: ['변하는 지식은 retrieval로 외부화', '행동 적응과 사실 주입의 문제를 구분'],
    followUp: 'RAG 없이 긴 context에 모든 문서를 넣는 방식의 단점은 무엇인가요?',
    prerequisites: ['llm-tokenization-context-window', 'llm-peft-lora'],
  },
  {
    id: 'rag-dense-sparse-hybrid-rrf',
    category: 'rag',
    difficulty: 'intermediate',
    term: 'Dense · Sparse · Hybrid · RRF',
    prompt: 'Dense와 Sparse retrieval을 비교하고 Hybrid Search에서 RRF를 쓰는 이유를 설명해보세요.',
    shortAnswer:
      'Dense retrieval은 embedding 의미 유사성에 강하고, BM25 같은 sparse retrieval은 정확한 키워드와 희소한 고유명사에 강합니다. Hybrid는 두 결과를 합쳐 약점을 보완하고 RRF는 서로 다른 점수 척도 대신 순위를 이용해 결합합니다.',
    deepAnswer:
      'RRF는 각 결과의 rank에 상수를 더한 역수를 합산해 score calibration 없이 안정적으로 fusion합니다. 하지만 query와 corpus에 따라 최적 조합이 달라지므로 offline relevance set과 online outcome으로 검증해야 합니다.',
    keyPoints: ['Dense는 의미, sparse는 lexical matching에 강점', 'RRF는 점수가 아닌 rank를 결합'],
    followUp: '고유한 에러 코드 검색에서는 dense와 sparse 중 무엇이 유리할까요?',
    prerequisites: ['transformer-embedding', 'math-vector-dot-product'],
  },
  {
    id: 'rag-chunking-vector-db',
    category: 'rag',
    difficulty: 'intermediate',
    term: 'Chunking · Vector DB · Cosine Similarity',
    prompt: 'Chunk 크기가 retrieval 품질에 미치는 영향을 Vector DB 흐름과 함께 설명해보세요.',
    shortAnswer:
      '문서를 chunk로 나누고 embedding과 metadata를 Vector DB에 저장한 뒤 query embedding과 가까운 chunk를 찾습니다. Chunk가 너무 작으면 문맥이 끊기고 너무 크면 관련 없는 내용이 섞여 검색과 생성 품질이 떨어질 수 있습니다.',
    deepAnswer:
      'Cosine similarity는 벡터 방향을 비교하지만 embedding model의 의미 공간과 데이터 특성이 품질을 결정합니다. 문서 구조 기반 분할, overlap, parent-child retrieval, metadata filtering을 query 유형별로 실험해야 합니다.',
    keyPoints: [
      'Chunk는 retrieval의 기본 단위이자 context 단위',
      '크기·overlap은 정답 하나가 아니라 평가로 결정',
    ],
    followUp: '표와 코드가 많은 문서는 일반 문단과 chunking 전략이 왜 달라야 하나요?',
    prerequisites: ['rag-dense-sparse-hybrid-rrf'],
  },
  {
    id: 'rag-reranking-cross-encoder',
    category: 'rag',
    difficulty: 'advanced',
    term: 'Reranking · Cross-Encoder',
    prompt: 'Retriever 뒤에 reranker를 두면 왜 품질은 좋아지고 latency는 늘어나나요?',
    shortAnswer:
      'Retriever는 많은 문서에서 후보를 빠르게 줄이고, reranker는 query와 각 후보를 함께 읽어 더 정밀하게 순서를 다시 매깁니다. Cross-encoder는 상호작용을 깊게 보지만 후보마다 추론해야 해 계산 비용이 큽니다.',
    deepAnswer:
      '일반적으로 bi-encoder retrieval로 top-k를 뽑고 cross-encoder로 작은 후보 집합을 재정렬합니다. k를 키우면 recall 기회와 비용이 함께 늘며, 최종 생성 품질은 retrieval recall, reranking precision, context packing을 분리해 평가해야 합니다.',
    keyPoints: [
      '빠른 recall 단계와 정밀 precision 단계 분리',
      '후보 수 k가 품질·지연시간 trade-off를 만듦',
    ],
    followUp: 'Reranker 개선을 생성 답변 지표만으로 판단하면 원인 분석이 왜 어려운가요?',
    prerequisites: ['rag-chunking-vector-db'],
  },
  {
    id: 'agent-vs-workflow',
    category: 'agent',
    difficulty: 'foundation',
    term: 'Agent vs Workflow',
    prompt: '정해진 Workflow와 AI Agent의 경계는 어디라고 생각하나요?',
    shortAnswer:
      'Workflow는 실행 순서와 분기가 주로 코드로 정해져 있고, Agent는 목표를 위해 다음 행동이나 tool을 모델이 동적으로 선택합니다. 불확실한 선택이 필요 없으면 deterministic workflow가 더 단순하고 안전합니다.',
    deepAnswer:
      'Agent는 유연성을 얻는 대신 비용, latency, 재현성, 권한 오용 위험을 늘립니다. 실제 시스템은 바깥 guardrail과 핵심 transaction은 workflow로 고정하고 제한된 구간에만 agentic decision을 허용하는 hybrid가 흔합니다.',
    keyPoints: ['동적 의사결정 권한의 위치가 핵심 차이', '유연성이 필요하지 않으면 workflow 우선'],
    followUp: '사용자의 돈을 이체하는 단계는 Agent에게 어느 정도 맡겨야 하나요?',
    prerequisites: ['llm-pretraining-next-token'],
  },
  {
    id: 'agent-react-tool-planning',
    category: 'agent',
    difficulty: 'intermediate',
    term: 'ReAct · Tool Calling · Planning',
    prompt: 'ReAct와 Tool Calling, Planning은 Agent 실행에서 어떻게 연결되나요?',
    shortAnswer:
      'ReAct는 reasoning과 action 결과 관찰을 번갈아 다음 행동을 정하는 패턴입니다. Tool calling은 모델의 의도를 검증 가능한 구조화 입력으로 실행기에 전달하고, planning은 여러 단계 목표와 순서를 세웁니다.',
    deepAnswer:
      'Tool schema 검증, timeout, idempotency, 권한, 결과 sanitization은 모델 밖 실행기가 책임져야 합니다. 긴 plan을 처음부터 고정하면 환경 변화에 약하고 매번 재계획하면 비용이 커지므로 단계별 재평가 범위를 설계합니다.',
    keyPoints: [
      '모델은 선택하고 실행기는 검증·권한·실패를 책임',
      'Plan과 observation을 반복해 환경 변화 반영',
    ],
    followUp: 'Tool이 성공했지만 같은 요청이 재시도되면 어떤 문제가 생길 수 있나요?',
    prerequisites: ['agent-vs-workflow'],
  },
  {
    id: 'agent-memory-evaluation',
    category: 'agent',
    difficulty: 'advanced',
    term: 'Memory · Agent Evaluation',
    prompt: 'Agent memory를 무작정 늘리면 안 되는 이유와 평가 방법을 말해보세요.',
    shortAnswer:
      'Memory는 세션 상태, 사용자 선호, 과거 경험 등 목적별로 구분해야 하며 오래된 정보와 개인정보가 decision을 오염시킬 수 있습니다. 평가는 최종 성공뿐 아니라 tool 선택, 근거, 안전, 비용, latency를 단계별로 봐야 합니다.',
    deepAnswer:
      'Memory write 조건, TTL, provenance, 수정·삭제 권한을 설계하고 retrieval relevance를 검증해야 합니다. Agent 평가는 동일 task를 반복해 변동성을 보고 deterministic checks, trace replay, 사람 평가를 목적에 맞게 조합합니다.',
    keyPoints: [
      'Memory에는 저장·검색·만료 정책이 필요',
      'End-to-end와 component/trace 평가를 함께 사용',
    ],
    followUp: '최종 답은 맞았지만 금지된 tool을 호출한 실행을 성공으로 볼 수 있나요?',
    prerequisites: ['agent-react-tool-planning', 'ml-train-validation-test'],
  },
  {
    id: 'system-latency-cost',
    category: 'ai-system',
    difficulty: 'intermediate',
    term: 'Latency · Cost · Quality',
    prompt: 'LLM 시스템의 latency, cost, quality trade-off를 어떤 레버로 조절할 수 있나요?',
    shortAnswer:
      '모델 크기, 입력·출력 token, retrieval 후보 수, tool 호출 수, 병렬화, caching, streaming으로 조절할 수 있습니다. 한 지표만 줄이면 품질이나 안정성이 나빠질 수 있어 사용자 task별 SLO와 budget을 함께 둡니다.',
    deepAnswer:
      'Time to first token과 전체 completion latency를 분리하고, model·retrieval·tool 단계별 trace를 측정해야 병목을 찾을 수 있습니다. 작은 모델 routing, semantic cache, context 압축은 효과가 있지만 cache stale과 routing 오류를 평가해야 합니다.',
    keyPoints: ['End-to-end latency를 단계별로 분해', '비용 최적화는 품질 회귀 gate와 함께'],
    followUp: 'Streaming은 실제 계산 시간을 줄이지 않아도 체감 속도를 개선하는 이유가 무엇인가요?',
    prerequisites: ['llm-tokenization-context-window', 'rag-reranking-cross-encoder'],
  },
  {
    id: 'system-evaluation-observability',
    category: 'ai-system',
    difficulty: 'advanced',
    term: 'Evaluation · Observability',
    prompt: 'AI 기능을 운영할 때 일반 API 모니터링만으로 부족한 이유는 무엇인가요?',
    shortAnswer:
      'HTTP 성공이어도 답이 틀리거나 근거가 없고 tool 선택이 위험할 수 있기 때문입니다. 인프라 지표와 함께 입력 분포, retrieval, model output, tool trace, 품질 평가, 사용자 결과를 연결해야 합니다.',
    deepAnswer:
      'Offline golden set은 회귀를 빠르게 잡고 online feedback은 실제 분포 변화를 보여줍니다. Prompt·model·index·dataset 버전을 trace에 남기고 개인정보를 최소화해야 재현성과 안전을 함께 확보할 수 있습니다.',
    keyPoints: [
      '기술적 성공과 의미적 성공을 구분',
      '버전·trace·평가 결과를 연결하되 개인정보 최소화',
    ],
    followUp: 'LLM-as-a-judge를 사용할 때 편향과 재현성은 어떻게 검증하나요?',
    prerequisites: ['agent-memory-evaluation', 'ml-train-validation-test'],
  },
] as const satisfies readonly StudyQuestion[]

export const sampleQuestions = [
  ...coreQuestions,
  ...roadmapQuestions,
] as const satisfies readonly StudyQuestion[]

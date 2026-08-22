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
      'Batch는 한 번에 처리하는 100개 샘플 묶음이고 iteration은 그 batch로 한 번 parameter를 갱신하는 단계입니다. 1 epoch은 1,000개 전체를 한 번 사용한 것이므로 정확히 10 iterations입니다.',
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
      '같은 층의 weight를 모두 0으로 두면 뉴런들이 같은 gradient를 받아 같은 특징만 학습합니다. Xavier와 He 초기화는 층을 지나도 분산이 크게 흔들리지 않게 scale을 정합니다.',
    deepAnswer:
      '분산을 지키려는 이유는 activation과 gradient가 층을 지나며 지나치게 커지거나 작아지는 것을 막기 위해서입니다. Xavier는 tanh 같은 activation, He는 ReLU 계열의 활성 비율을 고려한 초기화로 자주 사용합니다. 좋은 초기화는 학습을 안정시키지만 normalization, residual connection, optimizer를 대신하지는 않습니다.',
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
      'Batch normalization은 batch의 여러 샘플에서 feature별 평균과 분산을 계산합니다. Layer normalization은 각 샘플 내부의 feature 차원에서 정규화해 batch 크기에 덜 의존합니다.',
    deepAnswer:
      'Layer norm은 다른 샘플의 값에 영향받지 않는다는 점이 batch norm과의 실질적 차이입니다. Batch norm은 train과 inference에서 쓰는 통계가 달라 running statistics를 관리합니다. Layer norm은 token별 hidden feature를 정규화하기 쉬워 가변 길이 sequence와 작은 batch를 다루는 Transformer에서 널리 사용됩니다.',
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
      'zero_grad로 이전 gradient를 비우고 forward로 prediction과 loss를 계산합니다. loss.backward()가 gradient를 채우고 optimizer.step()이 parameter를 갱신합니다.',
    deepAnswer:
      'backward는 각 parameter의 gradient를 채우기만 하고, 실제 갱신 값은 optimizer가 자신의 update 규칙으로 정합니다. PyTorch gradient는 기본적으로 누적되므로 의도한 gradient accumulation이 아니라면 매 update 전에 비워야 합니다. Evaluation에서는 no_grad 또는 inference_mode로 그래프 생성을 막아 memory와 연산을 줄이고 optimizer.step은 호출하지 않습니다.',
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
      'Generator는 noise에서 실제 같은 sample을 만들고 discriminator는 진짜와 생성물을 구분합니다. 둘은 속이고 걸러내도록 번갈아 학습합니다.',
    deepAnswer:
      'Generator는 discriminator를 속이는 방향으로, discriminator는 더 잘 구분하는 방향으로 서로를 밀어 올립니다. 이 adversarial objective가 균형을 이루면 생성 분포가 실제 분포에 가까워집니다. 하지만 두 network의 학습 균형이 깨지기 쉽고 다양한 입력이 비슷한 출력으로 모이는 mode collapse와 불안정한 convergence가 대표적 문제입니다.',
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
      'CNN은 local receptive field와 weight sharing으로 공간 패턴에 강합니다. RNN은 hidden state를 순서대로 갱신하고, Transformer는 attention으로 token 관계를 직접 계산합니다.',
    deepAnswer:
      'Attention이 관계를 직접 계산한 덕에 Transformer는 training 병렬화와 먼 거리 연결에 유리합니다. RNN은 sequence 길이에 따른 순차 의존과 gradient 문제가 있고 기본 attention은 길이에 대해 제곱 비용이 큽니다. CNN도 계층을 쌓아 넓은 문맥을 보고 Transformer도 vision에 쓰이므로 이름보다 inductive bias와 계산 비용을 비교해야 합니다.',
    keyPoints: [
      'CNN은 locality, RNN은 recurrence, Transformer는 attention',
      'Task 구조와 계산 제약에 따라 선택',
    ],
    followUp: 'Transformer가 RNN보다 학습 병렬화에 유리한 이유는 무엇인가요?',
    prerequisites: ['dl-perceptron-neural-network', 'transformer-attention-vs-rnn'],
  },
  {
    id: 'dl-cnn-convolution-parameter-sharing',
    category: 'dl',
    difficulty: 'foundation',
    term: 'CNN · Convolution Filter',
    prompt:
      'Convolution filter가 이미지에서 feature를 뽑는 방식과 parameter sharing의 이점은 무엇인가요?',
    shortAnswer:
      '작은 filter가 이미지 위를 이동하며 같은 weight로 지역 패턴을 반복 감지해 feature map을 만듭니다. weight를 공유하므로 파라미터가 훨씬 적고 위치와 무관하게 같은 패턴을 찾습니다.',
    deepAnswer:
      '모든 위치를 따로 연결하는 fully connected와 비교하면 파라미터 수 차이가 특히 큽니다. Filter 여러 개가 각각 다른 feature map을 만들고, 층이 깊어질수록 edge 같은 저수준 패턴이 물체 부분 같은 고수준 feature로 조합됩니다. 지역성과 translation 성질을 구조에 새긴 inductive bias 덕분에 적은 데이터에서도 효율적이며, 이 가정이 약한 데이터에는 이점이 줄어듭니다.',
    keyPoints: ['같은 filter weight를 모든 위치에 공유', '지역 패턴이 고수준 feature로 조합'],
    followUp: '3×3 filter를 여러 층 쌓는 것이 큰 filter 한 층보다 유리한 이유는 무엇인가요?',
    prerequisites: ['dl-weight-bias-activation'],
  },
  {
    id: 'dl-cnn-pooling-receptive-field',
    category: 'dl',
    difficulty: 'intermediate',
    term: 'Pooling · Receptive Field',
    prompt: 'Pooling의 역할과 receptive field가 층을 거치며 커지는 이유를 설명해보세요.',
    shortAnswer:
      'Pooling은 feature map을 공간적으로 줄여 계산량을 낮추고 작은 위치 변화에 둔감하게 만듭니다. Receptive field는 출력 뉴런 하나가 보는 입력 영역이라 층을 거듭할수록 넓어집니다.',
    deepAnswer:
      'Receptive field가 넓어지므로 깊은 층은 이미지의 큰 맥락을 봅니다. Max pooling은 가장 강한 반응만 남기고 average pooling은 평균을 남기며, pooling 자체는 파라미터를 학습하지 않습니다. 최근에는 stride convolution으로 대체하기도 합니다. 공간 해상도를 줄이는 만큼 segmentation처럼 위치가 중요한 task에서는 손해가 될 수 있어 dilated convolution 등으로 receptive field만 넓히기도 합니다.',
    keyPoints: ['Pooling은 downsampling과 국소 불변성', '깊이가 receptive field를 넓힘'],
    followUp: 'Segmentation처럼 위치가 중요한 task에서 pooling의 부작용은 무엇인가요?',
    prerequisites: ['dl-cnn-convolution-parameter-sharing'],
  },
  {
    id: 'dl-rnn-lstm-gates',
    category: 'dl',
    difficulty: 'intermediate',
    term: 'RNN · LSTM Gate',
    prompt: 'RNN의 vanishing gradient 문제를 LSTM의 gate 구조가 어떻게 완화하나요?',
    shortAnswer:
      'RNN은 같은 weight를 시간축으로 반복해 곱하므로 긴 시퀀스에서 gradient가 사라지거나 폭발합니다. LSTM은 cell state 통로를 두고 gate로 흐름을 조절해 gradient가 덧셈에 가까운 경로로 흐르게 합니다.',
    deepAnswer:
      'forget·input·output 세 gate가 각각 지우고 더하고 내보내는 양을 정합니다. Forget gate가 1에 가까우면 cell state가 거의 그대로 전달되어 장기 의존성이 유지됩니다. 다만 완전한 해결이 아니라 완화이며, 순차 처리 때문에 병렬화가 어렵다는 한계는 남습니다. GRU는 gate 수를 줄인 간소화 변형이고, 이 순차 병목이 attention 기반 Transformer로 넘어간 배경입니다.',
    keyPoints: [
      '반복 곱셈이 vanishing gradient의 원인',
      'Cell state와 gate가 덧셈에 가까운 경로 제공',
    ],
    followUp: 'LSTM의 forget gate 편향을 1 근처로 초기화하는 관행은 무엇을 노린 것인가요?',
    prerequisites: ['dl-vanishing-exploding-gradient'],
  },
  {
    id: 'dl-autoencoder-vae',
    category: 'dl',
    difficulty: 'advanced',
    term: 'Autoencoder · VAE',
    prompt: 'Autoencoder와 VAE의 latent space는 무엇이 다르고, 왜 VAE만 생성 모델이라 부르나요?',
    shortAnswer:
      'Autoencoder는 재구성 오차만 줄이므로 latent space의 구조를 보장하지 않습니다. VAE는 latent를 확률분포로 두고 prior에 가깝게 하는 KL 항을 함께 최적화해, prior에서 sampling해 생성할 수 있습니다.',
    deepAnswer:
      'Autoencoder는 입력을 bottleneck으로 압축했다가 복원하는 구조입니다. VAE의 목적함수는 ELBO로 재구성 항과 KL regularization의 균형이며, sampling을 미분 가능하게 만드는 reparameterization trick이 학습의 핵심 장치입니다. KL 항이 latent space를 매끄럽게 만들어 보간이 자연스럽지만, 그 대가로 출력이 흐릿해지는 경향이 GAN·diffusion과 비교되는 지점입니다.',
    keyPoints: ['AE는 재구성만, VAE는 latent 분포까지 제약', 'ELBO는 재구성 항과 KL 항의 균형'],
    followUp: 'KL 항의 가중치를 키우면 재구성 품질과 latent 구조는 어떻게 trade-off 되나요?',
    prerequisites: ['math-entropy-cross-entropy-kl', 'ml-generative-discriminative'],
  },
  {
    id: 'dl-diffusion-model',
    category: 'dl',
    difficulty: 'advanced',
    term: 'Diffusion Model',
    prompt: 'Diffusion model은 noise를 더하고 되돌리는 두 과정으로 어떻게 데이터를 생성하나요?',
    shortAnswer:
      'Forward 과정은 데이터에 Gaussian noise를 단계적으로 더해 순수 noise로 만듭니다. 모델은 각 단계의 noise를 예측하도록 학습하고, 생성은 noise에서 시작해 단계적으로 denoising합니다.',
    deepAnswer:
      'Forward 과정은 Gaussian noise를 여러 단계에 걸쳐 더해 데이터를 완전히 무너뜨립니다. 학습이 각 timestep의 noise를 맞히는 회귀 문제로 단순해져 GAN 같은 적대적 학습의 불안정함이 없습니다. 대신 sampling이 수십 step 이상의 반복이라 느린 것이 약점이고, 개선된 sampler나 distillation로 step을 줄입니다. 텍스트 조건은 cross-attention 같은 경로로 모델에 주입하고, 생성할 때 classifier-free guidance로 그 조건을 얼마나 강하게 따를지 조절합니다.',
    keyPoints: [
      'Forward는 점진적 noise 추가, reverse는 학습된 denoising',
      '한 번에 생성하지 않고 반복 denoising',
    ],
    followUp: 'GAN 대비 diffusion의 학습이 안정적인 이유와 그 대가는 무엇인가요?',
    prerequisites: ['math-gaussian-distribution', 'dl-gan-generator-discriminator'],
  },
  {
    id: 'dl-early-stopping',
    category: 'dl',
    difficulty: 'foundation',
    term: 'Early Stopping · Patience',
    prompt: 'Early Stopping은 무엇을 보고 학습을 멈추며 왜 규제 효과가 있나요?',
    shortAnswer:
      'Validation 성능이 좋아지지 않고 일정 횟수 이상 정체하거나 나빠지면 멈춥니다. Train loss는 계속 내려가도 validation이 꺾이는 지점부터가 과적합이라, 그 전에 멈추는 것이 규제가 됩니다.',
    deepAnswer:
      'Validation 성능이 더 이상 좋아지지 않고 정체하는 구간을 어떻게 판정할지가 실제로는 까다롭습니다. Validation 성능은 매 epoch 출렁이므로 한 번 나빠졌다고 바로 멈추지 않고 몇 번까지 참을지를 정해두며, 멈춘 시점이 아니라 가장 좋았던 시점의 파라미터를 복원해야 의미가 있습니다. 멈추는 기준으로 쓴 데이터로 최종 성능까지 보고하면 그 데이터에 유리한 지점을 고른 셈이라 성능이 부풀려지므로 test set은 따로 남겨야 합니다.',
    keyPoints: [
      'Validation이 꺾이는 지점 전에 멈춰 과적합을 제한',
      '멈춘 시점이 아니라 최고 성능 시점의 파라미터를 복원',
    ],
    followUp: 'Validation 성능이 좋아졌다 나빠졌다를 반복하면 멈춤 기준을 어떻게 정하나요?',
    prerequisites: ['ml-train-validation-test', 'ml-overfitting-bias-variance'],
  },
  {
    id: 'dl-weight-decay-adamw',
    category: 'dl',
    difficulty: 'advanced',
    term: 'Weight Decay · AdamW',
    prompt: 'Weight Decay와 L2 Regularization은 왜 Adam에서 같지 않게 동작하나요?',
    shortAnswer:
      '단순 경사하강법에서는 L2 벌점을 더하는 것과 가중치를 줄이는 것이 사실상 같습니다. 하지만 Adam은 gradient를 파라미터별 크기로 나누므로 L2 항도 그 스케일에 휘둘려 의도한 감쇠가 걸리지 않습니다.',
    deepAnswer:
      'AdamW는 그래서 감쇠를 gradient에 섞지 않고 파라미터를 직접 줄이는 별도 단계로 분리해, 적응적 스케일과 무관하게 일정한 감쇠가 걸리도록 합니다. 실무에서 Adam에 L2를 넣고 효과가 없다고 판단하는 흔한 오해가 여기서 나옵니다. 또 bias나 정규화 층의 스케일 파라미터에는 보통 감쇠를 걸지 않는데, 이들은 크기를 줄여야 할 이유가 다르기 때문입니다.',
    keyPoints: [
      'SGD에서는 같지만 적응적 optimizer에서는 달라짐',
      'AdamW는 감쇠를 gradient와 분리해 적용',
    ],
    followUp: 'Bias와 normalization 파라미터에는 weight decay를 빼는 이유는 무엇인가요?',
    prerequisites: ['ml-regularization-l1-l2', 'dl-backprop-sgd-adam'],
  },
  {
    id: 'dl-learning-rate-schedule',
    category: 'dl',
    difficulty: 'intermediate',
    term: 'Learning Rate Schedule · Warmup',
    prompt: '학습률을 처음부터 끝까지 고정하지 않고 바꾸는 이유는 무엇인가요?',
    shortAnswer:
      '초반에는 크게 움직여야 빠르게 좋은 영역으로 가지만, 후반에는 같은 크기로 움직이면 최적점 주변을 계속 지나쳐 수렴하지 못하기 때문입니다. 그래서 뒤로 갈수록 학습률을 줄여 미세하게 조정합니다.',
    deepAnswer:
      '반대로 아주 처음에는 학습률을 0에서 서서히 올리는 warmup을 두기도 합니다. 초기에는 적응적 optimizer의 통계 추정이 불안정하고 파라미터도 무작위 상태라, 첫 몇 스텝의 큰 업데이트가 학습을 망칠 수 있기 때문입니다. Batch size를 키우면 대체로 학습률도 함께 키우게 되므로 둘은 따로 볼 수 없는 값이며, 스케줄 자체가 최종 성능을 바꾸므로 비교 실험에서는 같은 스케줄로 맞춰야 공정합니다.',
    keyPoints: [
      '초반은 크게, 후반은 작게 움직여야 수렴',
      'Warmup은 초기 불안정한 큰 업데이트를 막는 장치',
    ],
    followUp: '학습 후반에 학습률을 줄이지 않으면 loss 곡선이 어떤 모양이 되나요?',
    prerequisites: ['dl-gradient-descent-learning-rate', 'dl-mini-batch-gradient'],
  },
  {
    id: 'dl-momentum-optimization',
    category: 'dl',
    difficulty: 'intermediate',
    term: 'Momentum · Oscillation',
    prompt: 'Momentum은 경사하강법의 어떤 문제를 완화하나요?',
    shortAnswer:
      '이전 gradient들을 누적한 방향을 함께 쓰기 때문에, 방향이 계속 바뀌는 축에서는 서로 상쇄되어 진동이 줄고 방향이 일관된 축에서는 속도가 붙습니다. 좁고 긴 골짜기 모양의 loss에서 지그재그로 왔다 갔다 하는 낭비를 줄여줍니다.',
    deepAnswer:
      '기울기가 축마다 심하게 다른 상황에서 순수 경사하강법은 가파른 축을 따라 튕기느라 완만한 축으로는 거의 못 나아갑니다. Momentum은 최근 gradient의 지수 이동 평균을 쓰는 것과 같아 이 불균형을 완화하며, 값이 너무 크면 최적점을 지나쳐 흔들릴 수 있어 학습률과 함께 조정해야 합니다. Adam은 이 1차 모멘트에 더해 크기의 2차 모멘트까지 사용해 파라미터별로 보폭을 조절합니다.',
    keyPoints: [
      '진동하는 축은 상쇄되고 일관된 축은 가속',
      '최근 gradient의 이동 평균을 쓰는 것과 같은 효과',
    ],
    followUp: 'Momentum 계수를 1에 가깝게 키우면 어떤 부작용이 생길 수 있나요?',
    prerequisites: ['dl-backprop-sgd-adam', 'math-gradient-partial-derivative'],
  },
  {
    id: 'dl-gradient-clipping',
    category: 'dl',
    difficulty: 'intermediate',
    term: 'Gradient Clipping · Norm',
    prompt: 'Gradient Clipping은 무엇을 막고 어떤 한계가 있나요?',
    shortAnswer:
      '한 스텝의 gradient 크기가 정해둔 한계를 넘으면 방향은 유지한 채 크기만 줄여, 한 번의 폭주 업데이트가 학습을 망치는 것을 막습니다. 손실이 갑자기 튀거나 값이 발산하는 학습을 안정시키는 데 쓰입니다.',
    deepAnswer:
      '크기를 자르는 방식은 방향을 보존하지만 각 성분을 따로 자르는 방식은 방향까지 바뀌므로 구현을 구분해야 합니다. 다만 clipping은 증상을 억제할 뿐이라 학습률이 너무 크거나 초기화·정규화가 잘못된 근본 원인을 같이 찾아야 하고, 한계값을 너무 낮게 잡으면 정상적인 큰 gradient까지 눌러 학습이 느려집니다.',
    keyPoints: [
      '크기만 줄여 한 번의 폭주 업데이트를 차단',
      '원인 해결이 아니라 증상 억제라는 한계',
    ],
    followUp: 'Clipping을 걸었더니 학습이 오히려 느려졌다면 무엇을 확인해야 하나요?',
    prerequisites: ['dl-vanishing-exploding-gradient'],
  },
  {
    id: 'dl-representation-learning',
    category: 'dl',
    difficulty: 'intermediate',
    term: 'Representation Learning · Hidden Layer',
    prompt: '사람이 특징을 설계하는 것과 신경망이 표현을 학습하는 것은 무엇이 다른가요?',
    shortAnswer:
      '고전적인 방식은 사람이 어떤 값을 입력으로 쓸지 직접 정하지만, 신경망은 hidden layer를 거치며 과제에 유용한 표현을 스스로 만듭니다. hidden layer는 학습되는 특징 추출기입니다.',
    deepAnswer:
      '사람이 특징을 설계하려면 도메인 지식이 필요하고, 그 지식의 한계가 곧 입력의 한계가 됩니다. 층이 깊어질수록 단순한 패턴이 조합돼 더 추상적인 특징이 되고, 이 표현은 다른 과제에 재사용할 수 있어 전이학습의 근거가 됩니다. 대신 표현을 데이터로부터 얻는 만큼 더 많은 데이터와 계산이 필요하고 무엇을 학습했는지 해석하기 어렵습니다. 데이터가 적고 의미가 분명한 정형 데이터에서는 사람이 만든 특징과 트리 계열이 여전히 강한 이유이기도 합니다.',
    keyPoints: [
      'Hidden layer는 학습되는 특징 추출기',
      '데이터·계산 비용과 해석 가능성을 대가로 지불',
    ],
    followUp: '정형 데이터에서 딥러닝이 트리 모델을 이기지 못하는 경우가 많은 이유는 무엇인가요?',
    prerequisites: ['ml-feature-label-prediction', 'dl-perceptron-neural-network'],
  },
  {
    id: 'dl-transfer-learning',
    category: 'dl',
    difficulty: 'intermediate',
    term: 'Transfer Learning · Fine-Tuning',
    prompt: '사전학습된 모델을 새 과제에 쓸 때 전체를 다시 학습하지 않는 이유는 무엇인가요?',
    shortAnswer:
      '앞쪽 층이 배운 일반적인 표현은 새 과제에도 대체로 쓸모가 있어 처음부터 배울 필요가 없기 때문입니다. 데이터가 적으면 앞쪽을 고정하고 출력 쪽만 새로 학습하고, 데이터가 충분하고 도메인이 다르면 더 많은 층을 함께 미세조정합니다.',
    deepAnswer:
      '적은 데이터로 전체를 큰 학습률로 다시 학습하면 기존에 배운 표현이 망가져 오히려 성능이 떨어질 수 있으므로, 사전학습된 층에는 더 작은 학습률을 쓰는 방식이 흔합니다. 원본 과제와 새 과제의 데이터 성격이 많이 다르면 전이 효과가 줄고 때로는 해가 되므로, 처음부터 학습한 baseline과 비교해 이득을 확인해야 합니다.',
    keyPoints: [
      '앞쪽의 일반적 표현을 재사용해 데이터·계산을 절약',
      '데이터 양과 도메인 차이에 따라 고정 범위를 조절',
    ],
    followUp: '새 데이터가 아주 적을 때 전체를 미세조정하면 어떤 문제가 생기나요?',
    prerequisites: ['dl-representation-learning', 'ml-train-validation-test'],
  },
] as const satisfies readonly StudyQuestion[]

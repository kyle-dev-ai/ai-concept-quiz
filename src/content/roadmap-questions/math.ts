import type { StudyQuestion } from '../../domain/learning/question'

export const mathRoadmapQuestions = [
  {
    id: 'math-matrix-multiplication-shape',
    category: 'math',
    difficulty: 'foundation',
    term: 'Matrix Multiplication · Shape',
    prompt: '행렬 곱셈이 가능한 조건과 결과 행렬의 shape를 설명해보세요.',
    shortAnswer:
      '(m×n) 행렬과 (n×p) 행렬은 안쪽 차원 n이 같아 곱할 수 있고, 결과는 (m×p)입니다. 결과의 각 원소는 첫 행렬의 한 행과 둘째 행렬의 한 열을 내적해 만듭니다.',
    deepAnswer:
      '신경망에서 batch 입력 X가 (batch×input)이고 weight W가 (input×output)이면 XW는 (batch×output)이 됩니다. Shape를 먼저 추적하면 transpose 위치와 broadcasting 오류를 수식 단계에서 발견할 수 있습니다.',
    keyPoints: ['안쪽 차원이 같아야 행렬 곱 가능', '결과 shape는 바깥쪽 두 차원'],
    followUp: 'AB와 BA가 일반적으로 같지 않은 이유를 shape와 계산 관점에서 말해보세요.',
    prerequisites: ['math-vector-dot-product'],
  },
  {
    id: 'math-mean-variance-standard-deviation',
    category: 'math',
    difficulty: 'foundation',
    term: 'Mean · Variance · Standard Deviation',
    prompt: '평균, 분산, 표준편차는 데이터의 무엇을 각각 보여주나요?',
    shortAnswer:
      '평균은 값들의 중심을, 분산은 각 값이 평균에서 얼마나 퍼져 있는지를 제곱 거리의 평균으로 나타냅니다. 표준편차는 분산의 제곱근이라 원래 데이터와 같은 단위로 퍼짐을 해석할 수 있습니다.',
    deepAnswer:
      '평균이 같아도 분산이 다르면 데이터의 불확실성과 분포 모양은 크게 다를 수 있습니다. Feature scaling, normalization, 초기화 분석에서 평균과 분산을 함께 보는 이유이며, 이상치는 평균과 분산 모두에 큰 영향을 줄 수 있습니다.',
    keyPoints: ['평균은 중심, 분산은 퍼짐', '표준편차는 원래 값과 같은 단위'],
    followUp: '이상치가 많은 데이터에서는 평균 대신 어떤 대표값을 검토할 수 있나요?',
    prerequisites: [],
  },
  {
    id: 'math-probability-distribution-expectation',
    category: 'math',
    difficulty: 'foundation',
    term: 'Probability Distribution · Expected Value',
    prompt: '확률분포와 기댓값을 모델의 예측 확률에 연결해 설명해보세요.',
    shortAnswer:
      '확률분포는 가능한 결과마다 발생 가능성을 배정하며 전체 확률의 합(연속 분포면 밀도의 적분)은 1입니다. 기댓값은 각 결과에 그 확률을 곱해 더한 장기적인 평균으로, 불확실한 예측을 하나의 요약값으로 나타냅니다.',
    deepAnswer:
      '분류 모델의 softmax 출력은 클래스에 대한 범주형 확률분포로 해석할 수 있습니다. 다만 숫자가 0과 1 사이이고 합이 1이라고 해서 실제 빈도와 잘 맞는 calibrated probability라는 보장은 없으므로 별도 검증이 필요합니다.',
    keyPoints: ['전체 확률의 합 또는 적분은 1', '기댓값은 확률로 가중한 평균'],
    followUp: '예측 확률이 0.8인 사례 100개 중 실제 정답이 50개라면 어떤 문제가 있나요?',
    prerequisites: ['math-mean-variance-standard-deviation'],
  },
  {
    id: 'math-conditional-probability-bayes',
    category: 'math',
    difficulty: 'intermediate',
    term: 'Conditional Probability · Bayes Rule',
    prompt: '조건부확률과 Bayes Rule은 새로운 증거가 생겼을 때 믿음을 어떻게 바꾸나요?',
    shortAnswer:
      '조건부확률 P(A|B)는 B가 주어졌을 때 A일 확률입니다. Bayes Rule은 사전확률에 증거 B가 각 가설에서 나타날 가능도를 반영해 사후확률 P(A|B)를 계산합니다.',
    deepAnswer:
      '검사 정확도가 높아도 질병 자체가 매우 드물면 양성 결과의 실제 질병 확률은 생각보다 낮을 수 있습니다. 이 base-rate 효과는 모델 경보, 이상 탐지, 스팸 분류처럼 양성 비율이 낮은 문제를 해석할 때 중요합니다.',
    keyPoints: [
      '조건이 바뀌면 표본공간과 확률도 바뀜',
      '사후확률은 사전확률과 likelihood를 함께 반영',
    ],
    followUp: '희귀 질환 검사에서 민감도만으로 양성 예측을 해석하면 왜 위험한가요?',
    prerequisites: ['math-probability-distribution-expectation'],
  },
  {
    id: 'math-log-exp-softmax',
    category: 'math',
    difficulty: 'intermediate',
    term: 'Logarithm · Exponential · Softmax',
    prompt: '지수함수와 로그가 Softmax와 Cross Entropy에서 함께 쓰이는 이유는 무엇인가요?',
    shortAnswer:
      'Softmax는 logit을 지수화해 양수로 만든 뒤 합으로 나눠 확률분포를 만듭니다. 로그는 곱을 합으로 바꾸고 작은 확률의 차이를 다루기 쉽게 만들어 정답 확률의 negative log를 loss로 사용할 수 있게 합니다.',
    deepAnswer:
      '정답 클래스 확률이 1에 가까우면 negative log loss는 0에 가까워지고, 0에 가까우면 큰 벌점을 받습니다. 구현에서는 큰 logit의 지수 overflow를 막기 위해 최댓값을 빼거나 log-sum-exp 연산을 사용합니다.',
    keyPoints: [
      'Softmax는 logit을 정규화된 확률로 변환',
      'Negative log는 낮은 정답 확률을 크게 벌점',
    ],
    followUp: '모든 logit에 같은 상수를 더해도 softmax 결과가 같은 이유는 무엇인가요?',
    prerequisites: ['math-probability-distribution-expectation'],
  },
  {
    id: 'math-eigenvector-pca',
    category: 'math',
    difficulty: 'advanced',
    term: 'Eigenvector · PCA',
    prompt: '고유벡터와 고유값은 PCA에서 데이터의 중요한 방향을 어떻게 찾나요?',
    shortAnswer:
      '고유벡터는 선형변환을 거쳐도 자기 축을 벗어나지 않는 벡터이고, 고유값은 그 축에서의 배율로 음수면 방향이 뒤집힙니다. PCA는 공분산 행렬의 큰 고유값에 대응하는 고유벡터를 골라 분산이 큰 축으로 데이터를 투영합니다.',
    deepAnswer:
      '상위 주성분만 남기면 원래 분산을 최대한 보존하면서 차원을 줄일 수 있습니다. PCA는 선형 구조만 포착하고 입력 scale에 민감하며, 분산이 큰 방향이 반드시 task에 중요한 방향이라는 보장은 없습니다.',
    keyPoints: ['고유값은 해당 주성분이 설명하는 분산과 연결', 'PCA는 비지도 선형 차원 축소'],
    followUp: '단위가 다른 feature를 표준화하지 않고 PCA하면 어떤 문제가 생길 수 있나요?',
    prerequisites: ['math-matrix-multiplication-shape', 'math-mean-variance-standard-deviation'],
  },
  {
    id: 'math-log-sum-exp-stability',
    category: 'math',
    difficulty: 'advanced',
    term: 'Log-Sum-Exp · Numerical Stability',
    prompt: 'Log-Sum-Exp trick이 큰 logit에서 수치적으로 안정적인 이유를 설명해보세요.',
    shortAnswer:
      'log-sum-exp를 계산할 때 가장 큰 값 m을 먼저 빼면 exp(x−m)가 1 이하가 되어 overflow를 피할 수 있습니다. 마지막에 m을 더하면 수학적으로 같은 값을 얻습니다.',
    deepAnswer:
      '부동소수점은 표현 범위가 제한되어 큰 지수는 무한대로, 매우 작은 지수는 0으로 무너질 수 있습니다. Stable softmax와 cross entropy 구현은 이 변환을 내부에서 사용하므로 확률을 먼저 계산해 다시 log를 취하는 수동 구현보다 안전합니다.',
    keyPoints: [
      '최댓값을 빼도 정규화 결과는 변하지 않음',
      '수학적 동치와 수치적 안정성은 별도 문제',
    ],
    followUp: 'Softmax 후 log를 따로 계산하는 것보다 log-softmax가 안전한 이유는 무엇인가요?',
    prerequisites: ['math-log-exp-softmax'],
  },
  {
    id: 'math-rank-null-space-independence',
    category: 'math',
    difficulty: 'intermediate',
    term: 'Rank · Null Space · Linear Independence',
    prompt: '행렬의 Rank와 Null Space는 선형변환이 보존하거나 잃는 정보를 어떻게 보여주나요?',
    shortAnswer:
      'Rank는 출력 공간에서 서로 독립적으로 만들 수 있는 방향의 수이고, null space는 곱했을 때 0으로 사라지는 입력 벡터들의 집합입니다. Null space가 크면 서로 다른 입력을 같은 출력으로 보내는 정보 손실이 큽니다.',
    deepAnswer:
      '열 rank는 독립인 column 수이며 rank-nullity 정리에 따라 입력 차원은 rank와 nullity의 합입니다. Feature matrix의 rank가 부족하면 parameter를 유일하게 정하기 어렵고, low-rank 구조는 압축과 근사에 활용할 수 있습니다.',
    keyPoints: ['Rank는 보존되는 독립 방향의 수', 'Null space는 변환에서 0으로 사라지는 입력 방향'],
    followUp: 'n×n 행렬의 rank가 n보다 작으면 역행렬이 존재하지 않는 이유는 무엇인가요?',
    prerequisites: ['math-matrix-multiplication-shape'],
  },
  {
    id: 'math-determinant-invertibility',
    category: 'math',
    difficulty: 'intermediate',
    term: 'Determinant · Invertibility',
    prompt: 'Determinant의 기하학적 의미와 0일 때 생기는 일을 설명해보세요.',
    shortAnswer:
      'Determinant 절댓값은 정사각행렬의 선형변환이 면적이나 부피를 몇 배로 바꾸는지 나타내고 부호는 방향 반전을 나타냅니다. 0이면 한 차원 이상이 눌려 정보가 사라지므로 역행렬이 없습니다.',
    deepAnswer:
      'Determinant가 0이라는 것은 column들이 선형 종속이고 full rank가 아니라는 뜻과 연결됩니다. 큰 행렬의 역행렬을 실제 ML 계산에서 직접 구하기보다 선형시스템 풀이와 안정적인 분해를 사용하는 경우가 많습니다.',
    keyPoints: ['절댓값은 부피 scaling, 부호는 orientation', '0이면 singular하고 inverse가 없음'],
    followUp: 'Determinant가 0이 아닌 정사각행렬의 column들은 어떤 관계인가요?',
    prerequisites: ['math-rank-null-space-independence'],
  },
  {
    id: 'math-svd-low-rank',
    category: 'math',
    difficulty: 'advanced',
    term: 'Singular Value Decomposition · Low Rank',
    prompt: 'SVD의 UΣVᵀ를 입력 회전, 축 scaling, 출력 회전 관점에서 설명해보세요.',
    shortAnswer:
      'SVD는 행렬 A를 Vᵀ로 입력 좌표를 바꾸고, Σ의 singular value만큼 각 축을 늘리거나 줄인 뒤, U로 출력 좌표를 바꾸는 세 변환으로 분해합니다. 정사각행렬이 아니어도 사용할 수 있습니다.',
    deepAnswer:
      '큰 singular value와 대응 벡터를 남기면 Frobenius norm 기준으로 좋은 low-rank approximation을 얻어 압축과 노이즈 제거에 쓸 수 있습니다. PCA는 중심화한 데이터의 SVD와 밀접하며 covariance를 직접 만들지 않고 계산할 수 있습니다.',
    keyPoints: ['A = UΣVᵀ 형태로 모든 행렬 분해 가능', '상위 singular value로 low-rank 근사'],
    followUp: 'Eigen decomposition과 달리 SVD가 직사각형 행렬에도 적용되는 이유는 무엇인가요?',
    prerequisites: ['math-rank-null-space-independence', 'math-eigenvector-pca'],
  },
  {
    id: 'math-independence-covariance',
    category: 'math',
    difficulty: 'intermediate',
    term: 'Independence · Covariance · Correlation',
    prompt: '두 확률변수가 독립이라는 것과 Covariance가 0이라는 것은 왜 같은 말이 아닌가요?',
    shortAnswer:
      '독립이면 한 변수의 정보가 다른 변수의 분포를 바꾸지 않으며 적절한 moment가 존재하면 covariance도 0입니다. 하지만 covariance 0은 선형 관계가 없다는 뜻에 가까워 비선형 의존성은 남을 수 있습니다.',
    deepAnswer:
      'Correlation은 covariance를 각 표준편차로 나눠 scale을 제거한 값입니다. 데이터에서 correlation이 낮다고 feature가 쓸모없거나 인과관계가 없다고 단정할 수 없으며, 독립은 joint distribution이 factorize되는 더 강한 조건입니다.',
    keyPoints: [
      '독립은 joint distribution의 곱 분해',
      'Zero covariance는 비선형 의존성을 배제하지 못함',
    ],
    followUp: 'Y=X²이고 X가 0을 중심으로 대칭이면 covariance가 0이어도 왜 독립이 아닐 수 있나요?',
    prerequisites: [
      'math-probability-distribution-expectation',
      'math-mean-variance-standard-deviation',
    ],
  },
  {
    id: 'math-gaussian-distribution',
    category: 'math',
    difficulty: 'foundation',
    term: 'Gaussian Distribution · Mean · Covariance',
    prompt: 'Gaussian Distribution은 평균과 분산 또는 공분산으로 어떤 모양을 정하나요?',
    shortAnswer:
      '1차원 Gaussian은 평균이 중심을, 분산이 퍼짐을 정하는 종 모양의 연속 확률분포입니다. 다변량 Gaussian에서는 평균 벡터가 중심을, covariance matrix가 축별 퍼짐과 변수 간 선형 관계를 정합니다.',
    deepAnswer:
      '표준정규분포는 평균 0, 분산 1이며 z-score로 값을 표준화할 수 있습니다. 실제 데이터가 Gaussian이라는 가정은 자동으로 성립하지 않으므로 모델의 noise 가정과 residual을 확인해야 합니다.',
    keyPoints: ['평균은 위치, 분산·공분산은 퍼짐과 방향', 'Gaussian 가정은 데이터로 검토해야 함'],
    followUp: '다변량 Gaussian의 covariance matrix 대각선과 비대각선은 각각 무엇을 뜻하나요?',
    prerequisites: ['math-mean-variance-standard-deviation', 'math-independence-covariance'],
  },
  {
    id: 'math-linear-transformation-basis-dimension',
    category: 'math',
    difficulty: 'foundation',
    term: 'Linear Transformation · Basis · Dimension',
    prompt: '선형변환, basis, dimension을 좌표계를 바꾸는 관점에서 설명해보세요.',
    shortAnswer:
      '선형변환은 벡터의 덧셈과 scalar 곱을 보존하는 변환입니다. Basis는 공간의 모든 벡터를 유일하게 표현하는 독립 벡터들의 집합이고, dimension은 그 basis를 이루는 벡터의 수입니다.',
    deepAnswer:
      '같은 벡터도 basis가 달라지면 좌표값은 달라지지만 벡터 자체는 같습니다. 행렬은 선택한 basis에서 선형변환을 표현하며, embedding layer와 neural network의 linear layer도 입력 표현을 다른 feature 공간으로 옮기는 선형변환으로 볼 수 있습니다.',
    keyPoints: ['Basis는 공간을 span하는 선형 독립 벡터 집합', 'Dimension은 basis 벡터의 수'],
    followUp: 'Basis 벡터들이 선형 종속이면 좌표를 유일하게 표현할 수 없는 이유는 무엇인가요?',
    prerequisites: ['math-vector-dot-product', 'math-matrix-multiplication-shape'],
  },
  {
    id: 'math-orthogonality-projection',
    category: 'math',
    difficulty: 'intermediate',
    term: 'Orthogonality · Projection',
    prompt: '직교와 projection을 내적, least squares와 연결해 설명해보세요.',
    shortAnswer:
      '두 벡터의 내적이 0이면 서로 직교합니다. 한 벡터를 특정 subspace에 projection하면 그 공간 안에서 원래 벡터와 가장 가까운 점을 얻고, 남은 residual은 그 subspace에 직교합니다.',
    deepAnswer:
      'Least squares는 관측 벡터를 design matrix의 column space에 직교 투영해 제곱오차가 가장 작은 예측을 찾는 문제입니다. Orthogonal basis는 좌표 간 중복을 줄이고 projection coefficient를 내적으로 바로 구할 수 있어 계산과 해석이 단순해집니다.',
    keyPoints: ['내적이 0이면 orthogonal', '최소제곱 residual은 column space에 직교'],
    followUp:
      '정규직교 basis에서 projection coefficient를 내적으로 계산할 수 있는 이유는 무엇인가요?',
    prerequisites: ['math-vector-dot-product', 'math-linear-transformation-basis-dimension'],
  },
  {
    id: 'math-pseudoinverse-least-squares',
    category: 'math',
    difficulty: 'advanced',
    term: 'Inverse · Pseudoinverse · Least Squares',
    prompt: '역행렬이 없는 행렬에서도 pseudoinverse로 해를 구한다는 말은 무슨 뜻인가요?',
    shortAnswer:
      '정사각 full-rank 행렬은 inverse로 유일한 해를 구할 수 있지만 직사각형이거나 singular한 행렬에는 일반 inverse가 없습니다. Moore-Penrose pseudoinverse는 이때 least-squares 오차가 가장 작고 필요한 경우 norm도 가장 작은 해를 고릅니다.',
    deepAnswer:
      'SVD A=UΣVᵀ에서 0이 아닌 singular value의 역수만 취해 A⁺=VΣ⁺Uᵀ를 만들 수 있습니다. 실제 계산에서는 inverse를 직접 만들기보다 QR이나 SVD 기반 solver를 사용해야 rank deficiency와 수치 오차를 더 안정적으로 다룰 수 있습니다.',
    keyPoints: [
      'Pseudoinverse는 직사각형·singular 행렬에도 정의',
      'Least-squares 또는 minimum-norm 해와 연결',
    ],
    followUp: '왜 normal equation의 inverse를 직접 계산하는 것보다 QR이나 SVD가 안정적인가요?',
    prerequisites: ['math-orthogonality-projection', 'math-svd-low-rank'],
  },
  {
    id: 'math-jacobian-hessian-curvature',
    category: 'math',
    difficulty: 'advanced',
    term: 'Jacobian · Hessian · Curvature',
    prompt: 'Gradient, Jacobian, Hessian은 각각 어떤 미분 정보를 담고 있나요?',
    shortAnswer:
      'Gradient는 scalar 출력의 각 입력에 대한 1차 미분 벡터이고, Jacobian은 vector 출력의 각 입력에 대한 1차 미분 행렬입니다. Hessian은 scalar 함수의 모든 2차 편미분을 모아 국소적인 곡률을 나타냅니다.',
    deepAnswer:
      'Backpropagation은 전체 Jacobian을 크게 만들지 않고 vector-Jacobian product를 연쇄 계산합니다. Hessian의 고유값은 방향별 곡률과 연결되지만 deep learning에서는 크기가 너무 커 직접 계산하기 어려워 first-order optimizer나 근사법을 주로 씁니다.',
    keyPoints: [
      'Jacobian은 vector-to-vector 변환의 국소 선형화',
      'Hessian은 2차 미분과 방향별 곡률을 표현',
    ],
    followUp: 'Gradient가 0인 점에서 Hessian의 고유값 부호로 무엇을 구분할 수 있나요?',
    prerequisites: ['math-gradient-partial-derivative', 'math-chain-rule', 'math-eigenvector-pca'],
  },
  {
    id: 'math-entropy-cross-entropy-kl',
    category: 'math',
    difficulty: 'intermediate',
    term: 'Entropy · Cross Entropy · KL Divergence',
    prompt: 'Entropy, Cross Entropy, KL Divergence의 차이를 확률분포 비교 관점에서 말해보세요.',
    shortAnswer:
      'Entropy H(P)는 분포 P 자체의 불확실성이고, cross entropy H(P,Q)는 P에서 나온 data를 Q로 설명할 때의 평균 surprisal입니다. KL(P∥Q)는 두 값의 차이 H(P,Q)−H(P)로 Q가 P와 얼마나 다른지 나타냅니다.',
    deepAnswer:
      '분류에서 label 분포 P가 고정되어 있으면 cross entropy를 최소화하는 것은 KL(P∥Q)를 최소화하는 것과 같습니다. KL은 0 이상이지만 대칭이 아니고 triangle inequality도 만족하지 않아 일반적인 distance metric은 아닙니다.',
    keyPoints: [
      'Cross entropy = entropy + KL divergence',
      'KL divergence는 비대칭이며 일반 distance가 아님',
    ],
    followUp: 'KL(P∥Q)와 KL(Q∥P)가 mode를 다루는 방식이 달라질 수 있는 이유는 무엇인가요?',
    prerequisites: ['math-probability-distribution-expectation', 'math-log-exp-softmax'],
  },
  {
    id: 'math-mle-map',
    category: 'math',
    difficulty: 'intermediate',
    term: 'MLE · MAP',
    prompt: 'MLE와 MAP은 파라미터를 고를 때 어떤 기준이 다른가요?',
    shortAnswer:
      'MLE는 관측 데이터의 likelihood를 가장 크게 만드는 파라미터를 고릅니다. MAP은 여기에 파라미터의 prior를 곱해, 데이터가 말하는 것과 사전 믿음을 함께 반영한 posterior가 최대인 값을 고릅니다.',
    deepAnswer:
      'Log를 취하면 MAP은 MLE 목적함수에 log prior가 더해진 형태가 되어, Gaussian prior는 L2, Laplace prior는 L1 regularization과 같은 역할을 합니다. 데이터가 많아질수록 likelihood 항이 지배해 두 추정은 가까워지고, 데이터가 적을 때 prior가 극단적인 추정을 막아줍니다.',
    keyPoints: [
      'MLE는 likelihood 최대화, MAP은 prior까지 반영',
      'Gaussian prior는 L2 regularization과 대응',
    ],
    followUp:
      '동전을 3번 던져 모두 앞면이 나왔을 때 MLE 추정의 문제와 MAP의 완화 방식은 무엇인가요?',
    prerequisites: [
      'math-conditional-probability-bayes',
      'math-probability-distribution-expectation',
    ],
  },
  {
    id: 'math-convexity-saddle-point',
    category: 'math',
    difficulty: 'advanced',
    term: 'Convexity · Local Minimum · Saddle Point',
    prompt: '신경망의 loss가 convex가 아니라는 것은 학습에 어떤 의미인가요?',
    shortAnswer:
      'Convex 함수는 국소 최솟값이 곧 전역 최솟값이라 어디서 시작해도 같은 최솟값에 도달하지만, 신경망은 그렇지 않아 초기값과 경로에 따라 다른 해에 수렴합니다. 그래서 전역 최적을 보장할 수 없고 충분히 좋은 해를 찾는 문제로 다룹니다.',
    deepAnswer:
      '고차원에서는 모든 방향으로 올라가는 나쁜 국소 최솟값보다, 어떤 방향은 올라가고 어떤 방향은 내려가는 안장점과 평평한 구간이 더 흔하다고 보고됩니다. 기울기가 0에 가까워 진행이 느려지는 것이 주된 어려움이며, mini-batch의 noise와 momentum이 이런 구간을 빠져나오는 데 도움이 됩니다. Hessian의 고윳값 부호를 보면 그 지점이 최솟값인지 안장점인지 구분할 수 있습니다.',
    keyPoints: [
      'Convex가 아니면 전역 최적 보장이 사라짐',
      '고차원에서는 나쁜 국소 최솟값보다 안장점·평탄 구간이 문제',
    ],
    followUp: '같은 구조를 다른 초기값으로 두 번 학습했더니 성능이 달랐다면 무엇을 의미하나요?',
    prerequisites: ['math-jacobian-hessian-curvature', 'dl-gradient-descent-learning-rate'],
  },
  {
    id: 'math-central-limit-theorem',
    category: 'math',
    difficulty: 'intermediate',
    term: 'Central Limit Theorem · Standard Error',
    prompt: '중심극한정리는 모델 성능을 측정할 때 어떤 근거가 되나요?',
    shortAnswer:
      '원래 데이터 분포가 어떻든 표본 평균의 분포는 표본 수가 커질수록 정규분포에 가까워진다는 정리입니다. 그래서 평가 점수 같은 평균값에 신뢰구간을 붙여 "이 차이가 우연일 수 있는가"를 판단할 수 있습니다.',
    deepAnswer:
      '표본 평균의 흔들림은 표본 수의 제곱근에 반비례해 줄어들므로, 오차를 절반으로 줄이려면 표본을 네 배로 늘려야 합니다. 이 때문에 작은 평가 세트에서 나온 1~2%p 차이는 우연일 가능성이 큽니다. 다만 표본이 서로 독립이고 분산이 유한해야 하며, 같은 사용자나 같은 문서에서 나온 표본이 섞이면 실제보다 오차를 작게 착각하게 됩니다.',
    keyPoints: [
      '표본 평균의 분포가 정규에 가까워져 신뢰구간이 가능',
      '오차는 표본 수의 제곱근에 반비례해 감소',
    ],
    followUp: '평가 세트 100개에서 정확도가 2%p 올랐다면 개선이라고 말할 수 있나요?',
    prerequisites: ['math-mean-variance-standard-deviation', 'math-gaussian-distribution'],
  },
] as const satisfies readonly StudyQuestion[]

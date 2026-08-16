import type { StudyQuestion } from '../../domain/learning/question'

export const mlRoadmapQuestions = [
  {
    id: 'ml-mse-mae',
    category: 'ml',
    difficulty: 'foundation',
    term: 'MSE · MAE',
    prompt: '회귀 문제에서 MSE와 MAE는 큰 오차를 어떻게 다르게 취급하나요?',
    shortAnswer:
      'MSE는 오차를 제곱해 평균하므로 큰 오차에 훨씬 큰 벌점을 줍니다. MAE는 절댓값을 평균해 이상치의 영향이 상대적으로 작지만 0 지점에서 미분이 매끄럽지 않습니다.',
    deepAnswer:
      'MSE는 조건부 평균을, MAE는 조건부 중앙값을 추정하는 손실과 연결됩니다. 어느 쪽이 무조건 우수한 것이 아니라 오차 비용, noise 분포, 이상치 의미를 보고 고르며 실제 평가지표와도 정렬해야 합니다.',
    keyPoints: ['MSE는 큰 오차를 제곱으로 강조', 'MAE는 이상치에 상대적으로 덜 민감'],
    followUp: '배송 시간 예측에서 아주 늦은 예측을 특히 강하게 벌주고 싶다면 무엇을 검토하나요?',
    prerequisites: ['ml-regression-classification'],
  },
  {
    id: 'ml-cross-entropy-nll',
    category: 'ml',
    difficulty: 'intermediate',
    term: 'Cross Entropy · Negative Log-Likelihood',
    prompt: '분류에서 Cross Entropy가 정답 클래스의 확률을 어떻게 학습 신호로 바꾸나요?',
    shortAnswer:
      'One-hot 정답에서는 cross entropy가 정답 클래스 예측 확률의 negative log와 같습니다. 정답 확률이 높아질수록 loss는 0에 가까워지고 자신 있게 틀릴수록 큰 벌점을 받습니다.',
    deepAnswer:
      'Softmax와 cross entropy를 함께 구현하면 log-sum-exp를 사용해 수치적으로 안정적인 gradient를 계산할 수 있습니다. Loss가 낮아도 class imbalance나 calibration 문제는 남을 수 있으므로 task metric을 별도로 확인해야 합니다.',
    keyPoints: ['정답 클래스의 negative log probability를 최소화', '확신한 오답에 큰 손실 부여'],
    followUp: '모델 출력에 softmax를 두 번 적용하면 왜 학습이 잘못될 수 있나요?',
    prerequisites: ['ml-loss-vs-metric', 'math-log-exp-softmax'],
  },
  {
    id: 'ml-confusion-matrix-threshold',
    category: 'ml',
    difficulty: 'foundation',
    term: 'Confusion Matrix · Decision Threshold',
    prompt: 'Confusion Matrix의 네 칸과 분류 threshold의 관계를 설명해보세요.',
    shortAnswer:
      'Confusion matrix는 실제와 예측의 조합을 TP, FP, FN, TN으로 나눕니다. 예측 확률을 양성으로 바꾸는 threshold를 낮추면 보통 TP와 FP가 늘고, 높이면 FN과 TN이 늘어납니다.',
    deepAnswer:
      '기본값 0.5가 비즈니스 비용에 최적이라는 보장은 없습니다. 사기 탐지처럼 놓치는 비용이 큰지, 정상 사용자를 막는 비용이 큰지 정한 뒤 validation 데이터에서 threshold를 선택하고 test에서 최종 확인합니다.',
    keyPoints: ['TP·FP·FN·TN으로 오류 종류를 분리', 'Threshold는 오류 비용에 따라 선택'],
    followUp:
      '암 진단 보조에서 false negative와 false positive 중 어느 쪽을 더 줄일지 어떻게 정하나요?',
    prerequisites: ['ml-regression-classification', 'ml-train-validation-test'],
  },
  {
    id: 'ml-precision-recall-f1',
    category: 'ml',
    difficulty: 'intermediate',
    term: 'Precision · Recall · F1',
    prompt: 'Precision과 Recall의 분모가 무엇이고 F1은 언제 유용한가요?',
    shortAnswer:
      'Precision은 양성이라고 예측한 것 중 실제 양성 비율이고, recall은 실제 양성 중 찾아낸 비율입니다. F1은 두 값의 조화평균으로 어느 한쪽만 높은 모델에 낮은 점수를 줍니다.',
    deepAnswer:
      'F1은 true negative를 직접 반영하지 않고 precision과 recall의 중요도를 같게 둡니다. 따라서 운영 비용이 비대칭이면 F-beta, PR curve, 비용 기반 metric처럼 목적에 맞는 기준을 함께 사용해야 합니다.',
    keyPoints: ['Precision은 예측 양성의 정확도', 'Recall은 실제 양성의 탐지율'],
    followUp:
      '스팸 차단과 중환자 이상 징후 탐지에서 우선 metric이 달라질 수 있는 이유는 무엇인가요?',
    prerequisites: ['ml-confusion-matrix-threshold'],
  },
  {
    id: 'ml-class-imbalance',
    category: 'ml',
    difficulty: 'intermediate',
    term: 'Class Imbalance · Resampling',
    prompt: '양성 비율이 1%인 데이터에서 Accuracy 99%가 의미 없을 수 있는 이유는 무엇인가요?',
    shortAnswer:
      '모든 입력을 음성으로 예측해도 accuracy가 99%이기 때문입니다. 소수 클래스를 실제로 찾는지 보려면 precision, recall, PR-AUC와 confusion matrix를 함께 확인해야 합니다.',
    deepAnswer:
      'Class weight, over·under-sampling, threshold 조정으로 대응할 수 있지만 validation과 test의 실제 분포는 보존해야 합니다. 무작정 oversampling하면 중복 사례를 외우거나 확률 calibration이 달라질 수 있습니다.',
    keyPoints: ['다수 클래스만 맞혀도 accuracy가 높을 수 있음', '학습 대응과 평가 분포를 구분'],
    followUp: 'Oversampling을 train·validation 분리 전에 적용하면 어떤 leakage가 생길 수 있나요?',
    prerequisites: ['ml-precision-recall-f1'],
  },
  {
    id: 'ml-regularization-l1-l2',
    category: 'ml',
    difficulty: 'intermediate',
    term: 'L1 · L2 Regularization',
    prompt: 'L1과 L2 Regularization은 weight를 어떤 모양으로 제약하나요?',
    shortAnswer:
      'L1은 weight 절댓값의 합을 벌점으로 더해 일부 weight를 정확히 0으로 만드는 경향이 있습니다. L2는 제곱합을 벌점으로 더해 큰 weight를 부드럽게 줄이는 경향이 있습니다.',
    deepAnswer:
      '두 방법은 train loss만 맞추는 복잡한 해보다 작은 weight를 선호하도록 objective를 바꿉니다. 정규화 강도가 너무 크면 underfitting이 생기므로 validation으로 선택하며 optimizer의 weight decay와 L2 penalty는 구현에 따라 완전히 같지 않을 수 있습니다.',
    keyPoints: ['L1은 sparsity를 유도', 'L2는 큰 weight를 연속적으로 억제'],
    followUp: 'Regularization 강도를 test set으로 고르면 안 되는 이유는 무엇인가요?',
    prerequisites: ['ml-overfitting-bias-variance', 'ml-train-validation-test'],
  },
  {
    id: 'ml-cross-validation',
    category: 'ml',
    difficulty: 'intermediate',
    term: 'K-Fold Cross Validation',
    prompt: 'K-Fold Cross Validation은 작은 데이터에서 성능 추정을 어떻게 안정화하나요?',
    shortAnswer:
      '데이터를 K개 fold로 나눠 매번 하나를 validation으로, 나머지를 train으로 사용해 K번 평가합니다. 여러 분할의 평균과 변동을 보므로 한 번의 우연한 분할보다 안정적인 비교가 가능합니다.',
    deepAnswer:
      '시간 순서나 같은 사용자 그룹을 무시한 무작위 fold는 leakage를 만들 수 있습니다. 모델과 hyperparameter를 cross validation으로 선택했더라도 최종 성능 보고를 위한 독립 test set은 따로 남기는 것이 좋습니다.',
    keyPoints: ['각 샘플이 validation 역할을 한 번씩 수행', '분할 단위는 데이터 생성 구조를 반영'],
    followUp: '시계열 데이터에서 일반 K-fold 대신 어떤 방식의 분할이 필요한가요?',
    prerequisites: ['ml-train-validation-test'],
  },
  {
    id: 'ml-data-leakage-distribution-shift',
    category: 'ml',
    difficulty: 'advanced',
    term: 'Data Leakage · Distribution Shift',
    prompt: 'Data Leakage와 Distribution Shift는 모두 배포 성능을 망치지만 원인이 어떻게 다른가요?',
    shortAnswer:
      'Leakage는 학습이나 평가에 실제 예측 시점에는 알 수 없는 정보가 섞여 성능이 부풀려지는 문제입니다. Distribution shift는 배포 입력이나 정답 관계가 학습 데이터와 달라지는 문제입니다.',
    deepAnswer:
      'Leakage는 시간 기준 분할, feature 생성 시점, 중복 사용자 점검으로 예방합니다. Shift는 입력 통계와 성능을 지속 관찰하고 재학습·fallback 기준을 둬 대응합니다. 둘을 구분해야 데이터 파이프라인 수정과 운영 대응 중 맞는 조치를 할 수 있습니다.',
    keyPoints: ['Leakage는 평가의 독립성 훼손', 'Shift는 학습과 운영 분포의 변화'],
    followUp: '결제 취소 여부를 결제 승인 모델의 feature로 쓰면 왜 문제가 되나요?',
    prerequisites: ['ml-train-validation-test'],
  },
  {
    id: 'ml-clustering-kmeans',
    category: 'ml',
    difficulty: 'intermediate',
    term: 'Clustering · K-Means',
    prompt: 'K-Means는 label 없이 데이터를 어떤 기준으로 군집화하나요?',
    shortAnswer:
      'K개의 중심을 두고 각 샘플을 가장 가까운 중심에 할당한 뒤, 할당된 샘플 평균으로 중심을 갱신하는 과정을 반복합니다. 군집 내 제곱거리를 줄이는 방식입니다.',
    deepAnswer:
      'K를 미리 정해야 하고 초기 중심, feature scale, 이상치에 민감하며 구형에 가까운 군집을 가정합니다. 군집 번호에는 본래 의미가 없으므로 실제 업무 해석과 외부 검증 없이 고객 유형 같은 이름을 단정하면 안 됩니다.',
    keyPoints: ['할당과 중심 갱신을 반복', '거리와 feature scale이 결과를 좌우'],
    followUp: '길이 단위가 크게 다른 두 feature를 그대로 쓰면 군집이 어떻게 왜곡될 수 있나요?',
    prerequisites: ['ml-supervised-unsupervised', 'math-mean-variance-standard-deviation'],
  },
  {
    id: 'ml-probability-calibration',
    category: 'ml',
    difficulty: 'advanced',
    term: 'Probability Calibration · Reliability',
    prompt: '정확도가 높은 분류 모델도 확률 calibration이 나쁠 수 있다는 뜻은 무엇인가요?',
    shortAnswer:
      '예측 class는 잘 맞혀도 0.8이라고 말한 사례들이 실제로 약 80% 맞지 않을 수 있다는 뜻입니다. Calibration은 confidence 값과 장기적인 실제 빈도가 일치하는지를 봅니다.',
    deepAnswer:
      'Reliability diagram, Brier score, expected calibration error로 점검하고 temperature scaling 같은 후처리를 validation 데이터에 맞출 수 있습니다. 분포가 바뀌면 calibration도 깨질 수 있어 고위험 의사결정에서는 운영 중 재검증이 필요합니다.',
    keyPoints: [
      '분류 정확도와 확률 신뢰도는 다른 속성',
      '확률을 의사결정 비용에 쓰려면 calibration 점검',
    ],
    followUp: '모델 confidence를 곧바로 실제 성공 확률로 해석하면 어떤 문제가 생길 수 있나요?',
    prerequisites: ['math-probability-distribution-expectation', 'ml-confusion-matrix-threshold'],
  },
  {
    id: 'ml-generative-discriminative',
    category: 'ml',
    difficulty: 'intermediate',
    term: 'Generative · Discriminative Model',
    prompt: 'Generative Model과 Discriminative Model은 어떤 확률이나 경계를 학습하는지가 다른가요?',
    shortAnswer:
      'Discriminative model은 주로 입력에서 label로 가는 P(y|x)나 결정 경계를 학습합니다. Generative model은 데이터 자체의 분포 P(x) 또는 class와 데이터의 joint distribution을 모델링해 새로운 샘플을 만들 수 있습니다.',
    deepAnswer:
      'Logistic regression은 대표적인 discriminative classifier이고 Naive Bayes는 P(x|y)와 P(y)로 분류하는 generative 접근입니다. 생성 가능 여부만으로 우열을 정할 수 없으며 데이터 양, 목표 task, 가정에 따라 선택합니다.',
    keyPoints: [
      'Discriminative는 조건부 예측·경계에 집중',
      'Generative는 데이터 생성 분포를 모델링',
    ],
    followUp: 'Naive Bayes가 generative classifier라고 불리는 이유를 Bayes Rule로 설명해보세요.',
    prerequisites: ['ml-supervised-unsupervised', 'math-conditional-probability-bayes'],
  },
  {
    id: 'ml-roc-pr-auc',
    category: 'ml',
    difficulty: 'advanced',
    term: 'ROC-AUC · PR-AUC',
    prompt: 'Class imbalance가 심할 때 ROC-AUC보다 PR-AUC를 함께 보는 이유는 무엇인가요?',
    shortAnswer:
      'ROC는 threshold별 true positive rate와 false positive rate를 보지만 음성이 매우 많으면 false positive rate가 작게 보여 낙관적일 수 있습니다. PR curve는 양성 예측의 precision과 recall에 집중합니다.',
    deepAnswer:
      'AUC는 threshold 전체의 순위 성능을 요약하므로 실제 운영 threshold의 비용을 직접 말해주지 않습니다. PR-AUC baseline은 양성 비율에 영향을 받으므로 dataset 분포를 함께 밝히고 선택한 threshold의 confusion matrix도 보고해야 합니다.',
    keyPoints: ['ROC와 PR은 서로 다른 오류 비율을 표시', '운영 threshold의 실제 비용은 별도 평가'],
    followUp: 'AUC가 높아도 특정 운영 threshold에서 성능이 나쁠 수 있는 이유는 무엇인가요?',
    prerequisites: ['ml-class-imbalance', 'ml-confusion-matrix-threshold'],
  },
] as const satisfies readonly StudyQuestion[]

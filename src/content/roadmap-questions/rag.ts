import type { StudyQuestion } from '../../domain/learning/question'

export const ragRoadmapQuestions = [
  {
    id: 'rag-end-to-end-pipeline',
    category: 'rag',
    difficulty: 'foundation',
    term: 'RAG End-to-End Pipeline',
    prompt: '문서 수집부터 근거 있는 답변 생성까지 RAG 전체 흐름을 설명해보세요.',
    shortAnswer:
      '문서를 정제하고 chunk로 나눠 embedding과 metadata를 index에 저장합니다. 질문이 오면 관련 후보를 검색·재정렬해 context를 구성하고 LLM이 그 근거로 답하도록 한 뒤 출처와 품질을 평가합니다.',
    deepAnswer:
      'Offline indexing과 online query 단계를 구분해야 갱신 주기와 latency를 설계할 수 있습니다. 답이 틀리면 문서 누락, query, retrieval, reranking, context packing, generation 중 어느 단계가 원인인지 trace로 분해해야 합니다.',
    keyPoints: [
      'Indexing과 query-time retrieval을 구분',
      '검색 결과를 context로 넣어 generation을 grounding',
    ],
    followUp: '새 문서가 추가됐는데 답변에 반영되지 않는다면 어느 단계부터 확인하나요?',
    prerequisites: ['rag-vs-fine-tuning', 'rag-chunking-vector-db'],
  },
  {
    id: 'rag-bm25-ranking',
    category: 'rag',
    difficulty: 'intermediate',
    term: 'BM25 · Term Frequency · IDF',
    prompt: 'BM25가 단순 keyword count보다 검색 순위를 잘 만드는 핵심 요소는 무엇인가요?',
    shortAnswer:
      'Query 단어가 문서에 자주 나오는 정도를 보되 term frequency 증가 효과를 포화시키고, 전체 corpus에서 드문 단어에는 IDF로 더 큰 가중치를 줍니다. 문서 길이도 정규화합니다.',
    deepAnswer:
      '정확한 제품명, 에러 코드, 고유명사처럼 lexical match가 중요한 질문에 강합니다. 동의어와 의미적 표현 변화에는 약할 수 있어 dense retrieval과 결합하며 tokenizer와 형태소 처리 방식도 한국어 품질에 영향을 줍니다.',
    keyPoints: ['희귀한 query term에 높은 IDF', 'TF saturation과 문서 길이 정규화'],
    followUp: '모든 문서에 흔히 나오는 단어의 IDF가 낮아야 하는 이유는 무엇인가요?',
    prerequisites: ['rag-dense-sparse-hybrid-rrf'],
  },
  {
    id: 'rag-embedding-model-index',
    category: 'rag',
    difficulty: 'intermediate',
    term: 'Embedding Model · Index Compatibility',
    prompt:
      'RAG의 Embedding Model을 바꾸면 기존 document index를 다시 만들어야 하는 이유는 무엇인가요?',
    shortAnswer:
      '서로 다른 embedding model은 차원과 의미 공간이 다르므로 새 query vector를 예전 document vector와 직접 비교할 수 없습니다. 같은 model과 전처리 버전으로 문서와 query를 encode해야 합니다.',
    deepAnswer:
      'Model 교체 시 전체 re-embedding 비용, index migration, A/B evaluation, rollback을 계획해야 합니다. 일반 benchmark가 높아도 회사 용어와 한국어 query에 최적인지는 별도 relevance set으로 검증합니다.',
    keyPoints: [
      'Query와 document vector는 같은 embedding 공간 필요',
      'Model 변경은 index version 변경',
    ],
    followUp: '새 embedding index를 무중단으로 전환하려면 어떤 버전 전략을 사용할 수 있나요?',
    prerequisites: ['transformer-embedding', 'rag-chunking-vector-db'],
  },
  {
    id: 'rag-metadata-filtering',
    category: 'rag',
    difficulty: 'intermediate',
    term: 'Metadata Filter · Access Control',
    prompt: 'Vector similarity 전에 Metadata Filter를 적용하는 이유와 주의점은 무엇인가요?',
    shortAnswer:
      '문서 유형, 날짜, 언어, tenant, 권한처럼 명확한 조건으로 검색 후보를 제한해 relevance와 보안을 높일 수 있습니다. 다만 filter가 너무 좁거나 metadata가 잘못되면 정답 문서를 검색 전에 제거합니다.',
    deepAnswer:
      '접근 권한은 prompt 지시가 아니라 retrieval 계층의 강제 조건이어야 합니다. Metadata schema, 누락값, 갱신 지연을 검증하고 filter 전후 recall과 latency를 측정해 안전성과 검색 품질을 함께 봅니다.',
    keyPoints: ['명확한 범위 조건으로 후보를 사전 제한', '권한 필터는 model 밖에서 강제'],
    followUp: 'LLM에게 권한 없는 문서를 무시하라고만 지시하면 왜 충분하지 않나요?',
    prerequisites: ['rag-end-to-end-pipeline'],
  },
  {
    id: 'rag-query-rewriting-multi-query',
    category: 'rag',
    difficulty: 'advanced',
    term: 'Query Rewriting · Multi-Query Retrieval',
    prompt:
      '사용자 질문을 그대로 검색하지 않고 Query Rewriting이나 Multi-Query를 쓰는 이유는 무엇인가요?',
    shortAnswer:
      '대화체 질문을 검색에 맞는 핵심 표현으로 바꾸거나 여러 관점의 query를 만들어 한 표현에서 놓친 관련 문서를 찾기 위해서입니다. 여러 결과는 중복을 제거하고 fusion해야 합니다.',
    deepAnswer:
      'Rewrite가 사용자의 날짜, 제품, 부정 조건을 지우면 엉뚱한 문서를 찾을 수 있습니다. 원문 query와 rewrite를 함께 기록하고 query별 recall 이득, 추가 latency와 token cost, constraint 보존을 평가해야 합니다.',
    keyPoints: ['표현 차이를 줄여 retrieval recall 보완', 'Rewrite가 원래 제약을 바꾸는 위험 관리'],
    followUp: '“2025년 이전 정책은 제외”라는 조건이 rewrite에서 사라지면 어떤 문제가 생기나요?',
    prerequisites: ['rag-dense-sparse-hybrid-rrf'],
  },
  {
    id: 'rag-context-packing-citation',
    category: 'rag',
    difficulty: 'advanced',
    term: 'Context Packing · Citation Entailment',
    prompt: '검색된 문서를 Context에 넣는 순서와 Citation 품질은 어떻게 평가하나요?',
    shortAnswer:
      '중복과 관련 없는 chunk를 줄이고 질문에 필요한 근거를 token budget 안에 배치합니다. Citation은 링크 존재만 보지 않고 각 인용 문서가 답변의 해당 주장을 실제로 지지하는지 확인해야 합니다.',
    deepAnswer:
      '관련 chunk가 많아도 상충하거나 오래된 정보가 섞이면 generation이 흔들릴 수 있습니다. 출처 신뢰도, 최신성, 다양성, position effect를 고려하고 claim 단위 entailment와 citation completeness를 평가합니다.',
    keyPoints: [
      'Token budget 안에서 근거의 관련성과 다양성 관리',
      'Citation은 주장과 근거의 지지 관계로 평가',
    ],
    followUp: '정답 문서가 context에 있는데도 답이 틀렸다면 어떤 generation 문제를 의심하나요?',
    prerequisites: ['rag-reranking-cross-encoder', 'llm-grounding-abstention'],
  },
  {
    id: 'rag-retrieval-metrics',
    category: 'rag',
    difficulty: 'advanced',
    term: 'Recall@k · MRR · nDCG',
    prompt: 'Recall@k, MRR, nDCG는 Retrieval 결과의 다른 면을 어떻게 측정하나요?',
    shortAnswer:
      'Recall@k는 관련 문서가 top-k 안에 얼마나 포함됐는지 봅니다. MRR은 첫 관련 문서의 순위를 강조하고, nDCG는 여러 관련 문서의 등급과 순서에 할인 가중치를 적용합니다.',
    deepAnswer:
      '정답 문서가 하나인지 여러 개인지, 상위 첫 문서가 중요한지에 따라 metric을 고릅니다. 생성 답변만 평가하면 retrieval과 generator 원인을 분리하기 어려우므로 component metric과 end-to-end metric을 함께 사용합니다.',
    keyPoints: ['Recall은 후보 포함 여부', 'MRR·nDCG는 순위 품질을 반영'],
    followUp: 'Top-20 recall은 높은데 답변 품질이 낮다면 다음으로 무엇을 확인하나요?',
    prerequisites: ['rag-reranking-cross-encoder', 'ml-loss-vs-metric'],
  },
  {
    id: 'rag-answer-evaluation',
    category: 'rag',
    difficulty: 'advanced',
    term: 'RAG Evaluation · Groundedness · Relevance',
    prompt: 'RAG 답변을 평가할 때 Retrieval Relevance와 Groundedness를 왜 분리하나요?',
    shortAnswer:
      'Retrieval relevance는 가져온 문서가 질문에 필요한지 보고, groundedness는 생성한 주장이 제공된 문서로 지지되는지 봅니다. 좋은 문서를 가져와도 모델이 무시할 수 있고 나쁜 문서로 우연히 맞힐 수도 있습니다.',
    deepAnswer:
      '정답성, 질문 relevance, citation, abstention까지 별도 rubric으로 측정하고 사람이 검수한 golden set을 유지합니다. LLM judge를 쓰면 judge model과 prompt 버전을 고정하고 일부를 사람 평가와 비교해 편향과 일치도를 확인합니다.',
    keyPoints: ['Retriever와 generator의 실패를 분리', '자동 judge는 사람 기준과 calibration 필요'],
    followUp:
      '답은 사실이지만 제공 문서에 없는 지식을 사용했다면 groundedness 평가는 어떻게 하나요?',
    prerequisites: ['rag-retrieval-metrics', 'llm-grounding-abstention'],
  },
  {
    id: 'rag-failure-diagnosis',
    category: 'rag',
    difficulty: 'advanced',
    term: 'RAG Failure Analysis · Trace',
    prompt: '면접에서 “RAG 답변이 틀렸을 때 어떻게 원인을 찾았나”라고 물으면 어떤 순서로 답하나요?',
    shortAnswer:
      '정답 문서가 corpus에 있는지, chunk와 metadata가 맞는지, retrieval top-k에 들어왔는지, reranker가 유지했는지, context에 실렸는지, 모델이 근거를 사용했는지 순서대로 trace를 확인합니다.',
    deepAnswer:
      '각 단계의 입력·출력과 version을 남겨 같은 실패를 재현하고, 실패 유형별 golden case를 추가합니다. 한 번에 model이나 prompt를 모두 바꾸지 않고 component metric으로 병목을 확인한 뒤 가장 작은 변경을 실험합니다.',
    keyPoints: [
      'Corpus에서 generation까지 단계별로 원인 격리',
      '실패 사례를 재현 가능한 평가 데이터로 환류',
    ],
    followUp: '정답 chunk가 top-k에는 있지만 reranking 뒤 사라졌다면 어떤 실험을 하겠습니까?',
    prerequisites: ['rag-end-to-end-pipeline', 'system-evaluation-observability'],
  },
  {
    id: 'rag-asymmetric-embedding',
    category: 'rag',
    difficulty: 'intermediate',
    term: 'Asymmetric Embedding · Query vs Document',
    prompt: '같은 임베딩 모델인데 질문과 문서를 서로 다른 방식으로 인코딩하는 이유는 무엇인가요?',
    shortAnswer:
      '질문과 문서는 길이도 표현도 달라서 같은 방식으로 임베딩하면 의미가 같아도 벡터가 멀어질 수 있습니다. 그래서 모델에 "이건 질문", "이건 문서"라고 역할을 알려주는 방식으로 인코딩해 서로 잘 맞는 공간에 놓습니다.',
    deepAnswer:
      '짧은 질문은 핵심 단어 위주이고 문서는 배경 설명이 많아 표면 형태가 크게 다릅니다. 중요한 것은 그 모델이 학습할 때 쓴 표기 규칙을 그대로 재현하는 것이며, 양쪽에 모두 역할을 붙이는 모델도 있고 질문에만 붙이는 모델도 있어 문서마다 확인해야 합니다. 색인할 때와 검색할 때 역할을 반대로 주거나 한쪽을 빠뜨리면 검색 품질이 조용히 떨어지므로, 두 경로가 같은 규칙을 쓰는지 테스트로 고정해두는 것이 좋습니다.',
    keyPoints: [
      '질문과 문서는 표면 형태가 달라 같은 인코딩이 불리함',
      '색인 시점과 검색 시점의 역할이 어긋나면 품질이 조용히 하락',
    ],
    followUp: '색인은 문서용으로 했는데 검색도 문서용으로 인코딩했다면 어떤 증상이 나타날까요?',
    prerequisites: ['rag-embedding-model-index'],
  },
  {
    id: 'rag-embedding-truncation-normalize',
    category: 'rag',
    difficulty: 'advanced',
    term: 'Matryoshka Truncation · L2 Normalization',
    prompt: '임베딩 차원을 줄여 저장 비용을 아낄 때 무엇을 함께 확인해야 하나요?',
    shortAnswer:
      '앞쪽 차원만 잘라 써도 되도록 학습된 Matryoshka 계열 모델이어야 성능이 유지되고, 자른 벡터는 길이가 1이 아니게 되므로 다시 정규화해야 합니다. 코사인은 크기에 영향받지 않지만 내적이나 유클리드 거리는 단위 길이를 전제하므로 이때 순위가 왜곡됩니다.',
    deepAnswer:
      '차원을 줄이면 저장 용량과 검색 속도는 좋아지지만 미세한 의미 구분이 흐려져 상위 순위가 뒤바뀔 수 있으므로, 줄인 차원에서 검색 품질 지표를 다시 측정해야 합니다. 절단을 전제로 학습되지 않은 모델이라면 그냥 자르지 말고 PCA 같은 차원 축소를 쓰는 편이 안전합니다. 정규화 여부와 거리 함수는 짝이 맞아야 하고, 색인은 정규화하고 질의는 안 하는 불일치가 흔한 실수이며, 색인된 벡터의 규칙을 바꾸면 전체 재색인이 필요합니다.',
    keyPoints: [
      '차원 절단을 전제로 학습된 모델인지 먼저 확인',
      '내적·유클리드 인덱스는 단위 길이를 전제하므로 정규화 필요',
    ],
    followUp: '차원을 절반으로 줄였는데 검색 품질이 거의 같았다면 그것을 어떻게 확인했나요?',
    prerequisites: ['rag-asymmetric-embedding', 'math-vector-dot-product'],
  },
  {
    id: 'rag-korean-lexical-tokenization',
    category: 'rag',
    difficulty: 'intermediate',
    term: 'Korean Tokenization · Lexical Search',
    prompt: '한국어에서 단어 단위 키워드 검색이 영어보다 어려운 이유는 무엇인가요?',
    shortAnswer:
      '한국어는 교착어라 체언에는 조사가, 용언 어간에는 어미가 붙어 같은 단어가 여러 형태로 나타나기 때문입니다. 공백 기준으로 자르면 "학습을"과 "학습은"이 달라져 매칭이 실패하므로, 형태소 분석기를 쓰거나 글자 n-gram으로 쪼갭니다.',
    deepAnswer:
      '형태소 분석은 정확하지만 사전과 실행 비용이 필요하고 신조어에 약하며, n-gram은 사전 없이 견고하지만 색인이 커지고 의미 없는 조각도 매칭돼 잡음이 늘어납니다. 어느 쪽이든 어휘 검색은 표기가 다르면 못 찾으므로 의미 기반 벡터 검색과 함께 쓰는 편이 안전합니다. 영어 기준으로 튜닝된 검색 설정을 그대로 가져오면 한국어에서 성능이 떨어질 수 있다는 점도 함께 봐야 합니다.',
    keyPoints: [
      '조사·어미 결합 때문에 공백 분리만으로는 매칭 실패',
      '형태소 분석과 n-gram은 정확도와 견고함의 trade-off',
    ],
    followUp: 'n-gram 방식이 형태소 분석보다 유리해지는 상황은 언제인가요?',
    prerequisites: ['rag-bm25-ranking'],
  },
  {
    id: 'rag-context-budget-allocation',
    category: 'rag',
    difficulty: 'intermediate',
    term: 'Context Budget',
    prompt: '제한된 컨텍스트를 지시문, 대화 이력, 검색 결과에 어떻게 나눠 담아야 하나요?',
    shortAnswer:
      '고정으로 반드시 필요한 지시문을 먼저 확보하고, 남은 공간을 검색 결과와 최근 대화에 배분한 뒤, 넘치면 오래된 대화부터 요약하거나 버립니다. 배분 비율은 과제 성격에 따라 달라져 실험으로 정합니다.',
    deepAnswer:
      '검색 결과를 무조건 많이 넣는다고 정확도가 오르지 않고, 관련 없는 문단이 늘면 오히려 핵심이 묻혀 답이 나빠질 수 있습니다. 또 긴 컨텍스트에서는 중간에 있는 정보가 상대적으로 덜 반영되는 경향이 보고되어 중요한 근거를 앞이나 뒤에 배치하는 것이 유리할 수 있습니다. 예산 초과는 예외 상황이 아니라 일상이므로 무엇을 먼저 버릴지 우선순위를 미리 정해둬야 합니다.',
    keyPoints: [
      '고정 지시문 확보 후 남은 공간을 배분하는 순서',
      '검색 결과는 많을수록 좋은 것이 아님',
    ],
    followUp: '검색 문서 수를 5개에서 20개로 늘렸는데 정확도가 떨어졌다면 무엇을 의심하나요?',
    prerequisites: ['rag-context-packing-citation', 'llm-tokenization-context-window'],
  },
  {
    id: 'rag-index-freshness',
    category: 'rag',
    difficulty: 'intermediate',
    term: 'Index Freshness · Reindexing',
    prompt: '원본 문서가 바뀌었는데 인덱스가 그대로면 어떤 문제가 생기나요?',
    shortAnswer:
      '모델이 예전 내용을 근거로 확신 있게 답해 사용자가 틀린 정보를 사실로 받아들입니다. 그래서 변경된 문서만 감지해 다시 색인하고, 삭제된 문서는 인덱스에서도 제거하는 경로가 필요합니다.',
    deepAnswer:
      '전체 재색인은 단순하지만 비용과 시간이 커서 자주 하기 어렵고, 변경분만 갱신하려면 문서 식별자와 버전을 안정적으로 관리해야 합니다. 임베딩 모델을 교체하면 기존 벡터와 의미 공간이 달라 전체 재색인이 필요하다는 점도 함께 봐야 합니다. 답변에 근거 문서의 시점을 함께 보여주면 오래된 정보로 인한 오해를 줄일 수 있습니다.',
    keyPoints: [
      '갱신·삭제가 인덱스에 반영되지 않으면 확신에 찬 오답이 발생',
      '임베딩 모델 교체는 전체 재색인을 요구',
    ],
    followUp: '문서 삭제가 인덱스에 반영되지 않으면 사용자에게 어떤 일이 생기나요?',
    prerequisites: ['rag-embedding-model-index', 'rag-chunking-vector-db'],
  },
] as const satisfies readonly StudyQuestion[]

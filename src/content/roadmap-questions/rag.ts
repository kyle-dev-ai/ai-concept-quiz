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
] as const satisfies readonly StudyQuestion[]

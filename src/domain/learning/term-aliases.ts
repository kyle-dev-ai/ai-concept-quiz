// 문항 198개 중 162개(82%)의 답안에 영문 용어가 있다. 사용자는 이를 한국어 발음으로
// 말하고 음성 인식도 한글로 받아적으므로, 글자 비교만으로는 같은 개념이 완전히 다른
// 문자열이 된다. 발화와 모범 답 양쪽에 같은 표를 적용해 하나의 표기로 모은다.
//
// 양쪽에 똑같이 적용하는 것이 핵심이다. 한쪽만 바꾸면 오히려 어긋난다.
// 짧아서 다른 낱말 안에 섞여 들어갈 수 있는 말(키, 값 같은)은 넣지 않는다.
const aliasEntries: readonly (readonly [string, string])[] = [
  // 자주 나오는 순서대로. 같은 개념의 여러 표기를 모두 적는다.
  ['토큰', 'token'],
  ['토크나이저', 'tokenizer'],
  ['그래디언트', 'gradient'],
  ['그라디언트', 'gradient'],
  ['그레디언트', 'gradient'],
  ['가중치', 'weight'],
  ['웨이트', 'weight'],
  ['로스', 'loss'],
  ['손실함수', 'lossfunction'],
  ['어텐션', 'attention'],
  ['애텐션', 'attention'],
  ['셀프어텐션', 'selfattention'],
  ['피처', 'feature'],
  ['특징', 'feature'],
  ['모델', 'model'],
  ['쿼리', 'query'],
  ['임베딩', 'embedding'],
  ['액티베이션', 'activation'],
  ['활성화함수', 'activationfunction'],
  ['컨텍스트', 'context'],
  ['콘텍스트', 'context'],
  ['히든', 'hidden'],
  ['은닉', 'hidden'],
  ['메모리', 'memory'],
  ['시퀀스', 'sequence'],
  ['밸류', 'value'],
  ['소프트맥스', 'softmax'],
  ['리트리벌', 'retrieval'],
  ['검색증강생성', 'rag'],
  ['배치', 'batch'],
  ['미니배치', 'minibatch'],
  ['파라미터', 'parameter'],
  ['파라메터', 'parameter'],
  ['매개변수', 'parameter'],
  ['러닝레이트', 'learningrate'],
  ['학습률', 'learningrate'],
  ['트랜스포머', 'transformer'],
  ['인코더', 'encoder'],
  ['디코더', 'decoder'],
  ['레이어', 'layer'],
  ['벡터', 'vector'],
  ['행렬', 'matrix'],
  ['매트릭스', 'matrix'],
  ['코사인', 'cosine'],
  ['유사도', 'similarity'],
  ['프롬프트', 'prompt'],
  ['파인튜닝', 'finetuning'],
  ['미세조정', 'finetuning'],
  ['오버피팅', 'overfitting'],
  ['과적합', 'overfitting'],
  ['정규화', 'normalization'],
  ['노멀라이제이션', 'normalization'],
  ['드롭아웃', 'dropout'],
  ['백프로파게이션', 'backpropagation'],
  ['역전파', 'backpropagation'],
  ['옵티마이저', 'optimizer'],
  ['에폭', 'epoch'],
  ['데이터셋', 'dataset'],
  ['인퍼런스', 'inference'],
  ['추론', 'inference'],
  ['벤치마크', 'benchmark'],
  ['에이전트', 'agent'],
  ['툴', 'tool'],
  ['도구', 'tool'],
  // 약어는 한 글자씩 읽은 발음까지 받아준다.
  ['엘엘엠', 'llm'],
  ['엘엘앰', 'llm'],
  ['엘엘em', 'llm'],
  ['알엔엔', 'rnn'],
  ['씨엔엔', 'cnn'],
  ['시엔엔', 'cnn'],
  ['엘에스티엠', 'lstm'],
  ['지피티', 'gpt'],
  ['버트', 'bert'],
  ['랙', 'rag'],
  ['에이피아이', 'api'],
]

// 긴 표기를 먼저 바꿔야 짧은 표기가 그 일부를 먼저 먹지 않는다.
// 예: '셀프어텐션'이 '어텐션'보다 먼저 처리되어야 한다.
const orderedAliases = [...aliasEntries].sort((left, right) => right[0].length - left[0].length)

/** 공백과 문장부호를 지운 문자열에서 한국어 표기를 영문 표준형으로 바꾼다. */
export function applyTermAliases(compact: string): string {
  let result = compact
  for (const [korean, canonical] of orderedAliases) {
    if (result.includes(korean)) {
      result = result.split(korean).join(canonical)
    }
  }
  return result
}

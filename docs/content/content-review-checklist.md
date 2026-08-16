# Content review checklist

AI로 만든 질문을 앱에 포함하기 전 아래 순서로 검수한다.

## Contract

- [ ] `schemas/study-question.v1.schema.json` 필드를 모두 채웠다.
- [ ] ID가 안정적인 kebab-case이며 기존 ID와 겹치지 않는다.
- [ ] prerequisite가 실제 질문을 가리키고 순환하지 않는다.
- [ ] 10초 답변만 읽어도 질문의 핵심에 직접 답한다.
- [ ] 심화 답변이 10초 답변을 뒤집지 않고 한계와 조건을 더한다.
- [ ] 핵심 포인트가 두 개 이상이며 서로 같은 말을 반복하지 않는다.

## Accuracy and learning value

- [ ] 사용자가 제공한 원문 또는 확인 가능한 1차 자료와 대조했다.
- [ ] “항상”, “완전히”, “무조건”처럼 과도한 일반화를 제거했다.
- [ ] 수식 기호, 차원, 학습/추론 단계의 경계를 확인했다.
- [ ] 인접 개념과의 차이를 설명할 수 있다.
- [ ] 꼬리 질문이 단순 암기보다 이유·한계·비교를 묻는다.
- [ ] 대학원 목표가 아닌 초보 사용자도 첫 문단은 이해할 수 있다.

## Evaluation and release

- [ ] `npm run eval`이 통과한다.
- [ ] 중요한 새 주장 또는 재발한 오류를 regression/challenge case로 추가했다.
- [ ] manifest의 dataset version과 changelog를 필요한 수준으로 올렸다.
- [ ] 생성에 사용한 prompt와 입력 출처를 기록했다.
- [ ] 개인정보, 회사 기밀, 저작권상 장문 복제물이 없다.
- [ ] 사람 검수자가 candidate를 승인했다.

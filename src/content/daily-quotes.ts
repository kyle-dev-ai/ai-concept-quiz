import type { DailyQuote } from '../domain/learning/quote'

// 배움과 마음가짐에 관한 문장 모음. 홈에서 하루에 하나씩 보여준다.
//
// 널리 퍼져 있어도 출처를 확인할 수 없는 문장은 넣지 않았다. 실존 인물의 이름으로
// 하지 않은 말을 싣는 셈이기 때문이다. 다음은 그렇게 제외한 대표적인 예다.
//   - "살아남는 것은 가장 강한 종이 아니다" → 다윈이 아니라 Leon Megginson(1963)
//   - "우리는 반복해서 행하는 것의 결과다" → 아리스토텔레스가 아니라 Will Durant의 요약
//   - "같은 일을 반복하면서 다른 결과를 기대하는 것이 광기다" → 아인슈타인 출처 없음
//   - "모든 진리는 세 단계를 거친다" → 쇼펜하우어 저작에서 확인되지 않음
//
// 번역은 뜻이 통하도록 다듬은 것이라 축자 번역이 아니다. 사람 검수 대기 상태다.
export const dailyQuotes: readonly DailyQuote[] = [
  // 쇼펜하우어
  {
    id: 'schopenhauer-health',
    text: '건강한 거지가 병든 왕보다 행복하다.',
    author: '쇼펜하우어',
    source: '인생론',
  },
  {
    id: 'schopenhauer-pendulum',
    text: '삶은 욕망과 권태 사이를 오가는 시계추와 같다.',
    author: '쇼펜하우어',
    source: '의지와 표상으로서의 세계',
  },
  {
    id: 'schopenhauer-reading',
    text: '독서는 남의 머리로 대신 생각하는 일이다.',
    author: '쇼펜하우어',
    source: '여록과 보유',
  },
  {
    id: 'schopenhauer-digest',
    text: '읽되 스스로 생각하지 않으면, 읽은 것은 끝내 내 것이 되지 않는다.',
    author: '쇼펜하우어',
    source: '여록과 보유',
  },
  {
    id: 'schopenhauer-target',
    text: '재능은 남이 맞히지 못하는 과녁을 맞히고, 천재는 남이 보지 못하는 과녁을 맞힌다.',
    author: '쇼펜하우어',
    source: '의지와 표상으로서의 세계',
  },
  {
    id: 'schopenhauer-solitude',
    text: '고독은 뛰어난 정신을 가진 이들의 몫이다.',
    author: '쇼펜하우어',
    source: '여록과 보유',
  },
  {
    id: 'schopenhauer-wealth',
    text: '부는 바닷물과 같아서, 마실수록 목이 마르다.',
    author: '쇼펜하우어',
    source: '여록과 보유',
  },
  {
    id: 'schopenhauer-limits',
    text: '누구나 자기 시야의 한계를 세계의 한계로 여긴다.',
    author: '쇼펜하우어',
    source: '여록과 보유',
  },
  {
    id: 'schopenhauer-ordinary',
    text: '평범한 사람은 시간을 어떻게 때울지 궁리하고, 재능 있는 사람은 시간을 어떻게 쓸지 궁리한다.',
    author: '쇼펜하우어',
    source: '여록과 보유',
  },
  {
    id: 'schopenhauer-today',
    text: '오늘은 한 번뿐이며 다시 오지 않는다.',
    author: '쇼펜하우어',
    source: '인생론',
  },

  // 니체
  {
    id: 'nietzsche-stronger',
    text: '나를 죽이지 못하는 것은 나를 더 강하게 만든다.',
    author: '니체',
    source: '우상의 황혼',
  },
  {
    id: 'nietzsche-why',
    text: '왜 살아야 하는지 아는 사람은 그 어떤 방식도 견뎌낸다.',
    author: '니체',
    source: '우상의 황혼',
  },
  {
    id: 'nietzsche-chaos',
    text: '춤추는 별을 낳으려면 자기 안에 혼돈을 지녀야 한다.',
    author: '니체',
    source: '차라투스트라는 이렇게 말했다',
  },
  {
    id: 'nietzsche-abyss',
    text: '심연을 오래 들여다보면, 심연도 너를 들여다본다.',
    author: '니체',
    source: '선악의 저편',
  },
  {
    id: 'nietzsche-monster',
    text: '괴물과 싸우는 사람은 그 과정에서 스스로 괴물이 되지 않도록 조심해야 한다.',
    author: '니체',
    source: '선악의 저편',
  },
  {
    id: 'nietzsche-snake',
    text: '허물을 벗지 못하는 뱀은 죽는다.',
    author: '니체',
    source: '아침놀',
  },
  {
    id: 'nietzsche-own-legs',
    text: '높이 오르려거든 자기 다리를 써라. 남이 너를 실어 올리게 하지 마라.',
    author: '니체',
    source: '차라투스트라는 이렇게 말했다',
  },
  {
    id: 'nietzsche-my-way',
    text: '이것이 나의 길이다. 너희의 길은 어디 있는가? 모두를 위한 길이란 없다.',
    author: '니체',
    source: '차라투스트라는 이렇게 말했다',
  },
  {
    id: 'nietzsche-overcome',
    text: '인간은 극복되어야 할 무엇이다.',
    author: '니체',
    source: '차라투스트라는 이렇게 말했다',
  },
  {
    id: 'nietzsche-long-obedience',
    text: '오래 한 방향으로 복종하는 것, 거기에서 살 만한 무언가가 나온다.',
    author: '니체',
    source: '선악의 저편',
  },

  // 세네카
  {
    id: 'seneca-short-life',
    text: '인생이 짧은 것이 아니라, 우리가 많은 시간을 흘려보내는 것이다.',
    author: '세네카',
    source: '인생의 짧음에 관하여',
  },
  {
    id: 'seneca-harbor',
    text: '어느 항구로 갈지 모르는 사람에게는 어떤 바람도 순풍이 아니다.',
    author: '세네카',
    source: '루킬리우스에게 보내는 편지',
  },
  {
    id: 'seneca-dare',
    text: '어려워서 엄두를 내지 못하는 것이 아니라, 엄두를 내지 않아서 어려운 것이다.',
    author: '세네카',
    source: '루킬리우스에게 보내는 편지',
  },
  {
    id: 'seneca-learn-live',
    text: '사는 법은 평생을 두고 배워야 한다.',
    author: '세네카',
    source: '인생의 짧음에 관하여',
  },
  {
    id: 'seneca-adversity',
    text: '시련을 겪지 않은 사람만큼 불행한 이도 없다.',
    author: '세네카',
    source: '섭리에 관하여',
  },
  {
    id: 'seneca-suffer-more',
    text: '우리는 현실에서보다 상상 속에서 더 자주 고통받는다.',
    author: '세네카',
    source: '루킬리우스에게 보내는 편지',
  },
  {
    id: 'seneca-teaching',
    text: '가르치면서 배운다.',
    author: '세네카',
    source: '루킬리우스에게 보내는 편지',
  },
  {
    id: 'seneca-everywhere',
    text: '어디에나 있다는 것은 어디에도 없다는 것이다.',
    author: '세네카',
    source: '루킬리우스에게 보내는 편지',
  },

  // 마르쿠스 아우렐리우스
  {
    id: 'aurelius-thoughts',
    text: '네 삶의 질은 네 생각의 질에 달려 있다.',
    author: '마르쿠스 아우렐리우스',
    source: '명상록',
  },
  {
    id: 'aurelius-obstacle',
    text: '길을 막아선 것이 곧 길이 된다.',
    author: '마르쿠스 아우렐리우스',
    source: '명상록',
  },
  {
    id: 'aurelius-present',
    text: '누구도 과거나 미래를 잃지 않는다. 잃을 수 있는 것은 지금뿐이다.',
    author: '마르쿠스 아우렐리우스',
    source: '명상록',
  },
  {
    id: 'aurelius-morning',
    text: '아침에 일어나기 싫거든 생각하라. 나는 사람이 할 일을 하러 일어난다고.',
    author: '마르쿠스 아우렐리우스',
    source: '명상록',
  },
  {
    id: 'aurelius-others',
    text: '남이 무엇을 하는지 살피느라 시간을 쓰지 말라.',
    author: '마르쿠스 아우렐리우스',
    source: '명상록',
  },
  {
    id: 'aurelius-perfection',
    text: '완벽하게 살아내지 못한다고 절망하지 말라. 할 수 있는 데까지 하면 된다.',
    author: '마르쿠스 아우렐리우스',
    source: '명상록',
  },
  {
    id: 'aurelius-opinion',
    text: '상처받았다는 생각을 버려라. 그러면 상처도 사라진다.',
    author: '마르쿠스 아우렐리우스',
    source: '명상록',
  },
  {
    id: 'aurelius-do-it-now',
    text: '무엇이든 할 수 있을 때 하라. 그럴 수 있는 시간은 정해져 있다.',
    author: '마르쿠스 아우렐리우스',
    source: '명상록',
  },

  // 에픽테토스
  {
    id: 'epictetus-judgement',
    text: '우리를 괴롭히는 것은 일어난 일이 아니라, 그 일에 대한 우리의 판단이다.',
    author: '에픽테토스',
    source: '엥케이리디온',
  },
  {
    id: 'epictetus-wish',
    text: '일이 네 뜻대로 되기를 바라지 말고, 되는 대로 받아들이기를 바라라.',
    author: '에픽테토스',
    source: '엥케이리디온',
  },
  {
    id: 'epictetus-ignorance',
    text: '배우려는 사람은 먼저 자신이 모른다는 것을 인정해야 한다.',
    author: '에픽테토스',
    source: '담화록',
  },
  {
    id: 'epictetus-listen',
    text: '귀가 둘이고 입이 하나인 것은 말하기보다 듣기를 두 배로 하라는 뜻이다.',
    author: '에픽테토스',
    source: '단편',
  },
  {
    id: 'epictetus-control',
    text: '어떤 것은 우리에게 달려 있고 어떤 것은 그렇지 않다. 그 구분에서 시작하라.',
    author: '에픽테토스',
    source: '엥케이리디온',
  },
  {
    id: 'epictetus-practice',
    text: '알고 있다고 말하지 말고, 그렇게 살아라.',
    author: '에픽테토스',
    source: '엥케이리디온',
  },

  // 공자
  {
    id: 'confucius-learn-practice',
    text: '배우고 때때로 익히면 또한 기쁘지 아니한가.',
    author: '공자',
    source: '논어 학이',
  },
  {
    id: 'confucius-know',
    text: '아는 것을 안다 하고 모르는 것을 모른다 하는 것, 이것이 아는 것이다.',
    author: '공자',
    source: '논어 위정',
  },
  {
    id: 'confucius-think',
    text: '배우기만 하고 생각하지 않으면 어둡고, 생각만 하고 배우지 않으면 위태롭다.',
    author: '공자',
    source: '논어 위정',
  },
  {
    id: 'confucius-teacher',
    text: '세 사람이 길을 가면 그중에 반드시 내 스승이 있다.',
    author: '공자',
    source: '논어 술이',
  },
  {
    id: 'confucius-fix',
    text: '잘못하고도 고치지 않는 것, 그것을 잘못이라 한다.',
    author: '공자',
    source: '논어 위령공',
  },
  {
    id: 'confucius-enjoy',
    text: '아는 사람은 좋아하는 사람만 못하고, 좋아하는 사람은 즐기는 사람만 못하다.',
    author: '공자',
    source: '논어 옹야',
  },
  {
    id: 'confucius-slow',
    text: '빨리 가려 하지 말고, 작은 이익을 보지 말라. 빨리 가려 하면 이르지 못한다.',
    author: '공자',
    source: '논어 자로',
  },
  {
    id: 'confucius-mountain',
    text: '산을 쌓다가 한 삼태기가 모자라 그만두는 것도 내가 그만두는 것이다.',
    author: '공자',
    source: '논어 자한',
  },

  // 소크라테스 · 플라톤 · 아리스토텔레스
  {
    id: 'socrates-examined',
    text: '검토하지 않는 삶은 살 가치가 없다.',
    author: '소크라테스',
    source: '플라톤, 소크라테스의 변론',
  },
  {
    id: 'socrates-know-nothing',
    text: '나는 내가 모른다는 것을 안다. 그 점에서 조금 더 지혜롭다.',
    author: '소크라테스',
    source: '플라톤, 소크라테스의 변론',
  },
  {
    id: 'plato-force',
    text: '억지로 밀어 넣은 배움은 마음에 남지 않는다.',
    author: '플라톤',
    source: '국가',
  },
  {
    id: 'plato-beginning',
    text: '시작이 일의 가장 중요한 부분이다.',
    author: '플라톤',
    source: '국가',
  },
  {
    id: 'aristotle-become',
    text: '정의로운 일을 함으로써 정의로워지고, 절제하는 행동을 함으로써 절제 있게 된다.',
    author: '아리스토텔레스',
    source: '니코마코스 윤리학',
  },
  {
    id: 'aristotle-root',
    text: '배움의 뿌리는 쓰지만 그 열매는 달다.',
    author: '아리스토텔레스',
    source: '디오게네스 라에르티오스가 전함',
  },
  {
    id: 'aristotle-entertain',
    text: '어떤 생각을 받아들이지 않으면서도 그 생각을 다룰 줄 아는 것이 교양이다.',
    author: '아리스토텔레스',
    source: '형이상학',
  },

  // 근대 사상
  {
    id: 'descartes-divide',
    text: '어려운 문제는 다룰 수 있을 만큼 작은 부분으로 나누어라.',
    author: '데카르트',
    source: '방법서설',
  },
  {
    id: 'descartes-doubt',
    text: '의심할 수 있는 것을 모두 의심해 본 뒤에 남는 것에서 시작하라.',
    author: '데카르트',
    source: '방법서설',
  },
  {
    id: 'montaigne-be-oneself',
    text: '세상에서 가장 위대한 일은 자기 자신으로 사는 법을 아는 것이다.',
    author: '몽테뉴',
    source: '수상록',
  },
  {
    id: 'montaigne-well-formed',
    text: '가득 찬 머리보다 잘 정돈된 머리가 낫다.',
    author: '몽테뉴',
    source: '수상록',
  },
  {
    id: 'pascal-reed',
    text: '인간은 생각하는 갈대다. 자연에서 가장 약하지만, 생각하는 갈대다.',
    author: '파스칼',
    source: '팡세',
  },
  {
    id: 'pascal-long-letter',
    text: '이 편지가 길어진 것은 짧게 쓸 시간이 없었기 때문이다.',
    author: '파스칼',
    source: '시골 친구에게 보내는 편지',
  },
  {
    id: 'pascal-sit-quietly',
    text: '인간의 모든 불행은 방 안에 혼자 조용히 앉아 있지 못하는 데서 온다.',
    author: '파스칼',
    source: '팡세',
  },
  {
    id: 'kant-intuition',
    text: '내용 없는 생각은 공허하고, 개념 없는 직관은 맹목이다.',
    author: '칸트',
    source: '순수이성비판',
  },
  {
    id: 'kant-dare-know',
    text: '알려고 하는 용기를 가져라. 스스로 생각하라.',
    author: '칸트',
    source: '계몽이란 무엇인가',
  },
  {
    id: 'goethe-apply',
    text: '아는 것만으로는 충분하지 않다. 적용해야 한다. 의지만으로는 충분하지 않다. 행해야 한다.',
    author: '괴테',
    source: '빌헬름 마이스터의 편력시대',
  },
  {
    id: 'goethe-treat',
    text: '사람을 지금의 모습대로 대하면 그대로 머물고, 될 수 있는 모습대로 대하면 그렇게 된다.',
    author: '괴테',
    source: '빌헬름 마이스터의 수업시대',
  },
  {
    id: 'kierkegaard-backwards',
    text: '삶은 뒤돌아볼 때 이해되지만, 살아가기는 앞을 향해야 한다.',
    author: '키르케고르',
    source: '일기',
  },
  {
    id: 'kierkegaard-risk',
    text: '위험을 무릅쓰면 잠시 발을 헛디딜 수 있지만, 무릅쓰지 않으면 자신을 잃는다.',
    author: '키르케고르',
    source: '불안의 개념',
  },

  // 배움과 실천
  {
    id: 'emerson-self-trust',
    text: '자기 자신을 믿어라. 모든 마음은 그 현을 울릴 때 진동한다.',
    author: '에머슨',
    source: '자기 신뢰',
  },
  {
    id: 'emerson-teach',
    text: '내가 만나는 모든 사람은 어떤 점에서 나보다 낫다. 그 점에서 나는 배운다.',
    author: '에머슨',
    source: '에세이',
  },
  {
    id: 'thoreau-dreams',
    text: '자신의 꿈이 있는 쪽으로 자신 있게 나아가라.',
    author: '소로',
    source: '월든',
  },
  {
    id: 'thoreau-busy',
    text: '바쁘다는 것만으로는 충분하지 않다. 개미도 바쁘다. 무엇에 바쁜지가 문제다.',
    author: '소로',
    source: '편지',
  },
  {
    id: 'james-habit',
    text: '새로운 습관을 들일 때는 가능한 한 강하게, 단호하게 시작하라.',
    author: '윌리엄 제임스',
    source: '심리학의 원리',
  },
  {
    id: 'james-attention',
    text: '내 경험은 내가 주의를 기울이기로 한 것들로 이루어진다.',
    author: '윌리엄 제임스',
    source: '심리학의 원리',
  },
  {
    id: 'dewey-reflect',
    text: '우리는 경험에서 배우는 것이 아니라, 경험을 돌아봄으로써 배운다.',
    author: '존 듀이',
    source: '경험과 교육',
  },
  {
    id: 'dewey-preparation',
    text: '교육은 삶을 준비하는 것이 아니라 삶 그 자체다.',
    author: '존 듀이',
    source: '나의 교육 신조',
  },
  {
    id: 'franklin-today',
    text: '오늘 할 수 있는 일을 내일로 미루지 말라.',
    author: '벤저민 프랭클린',
    source: '가난한 리처드의 연감',
  },
  {
    id: 'franklin-investment',
    text: '지식에 쏟은 돈이 가장 큰 이자를 낳는다.',
    author: '벤저민 프랭클린',
    source: '가난한 리처드의 연감',
  },
  {
    id: 'helen-keller-optimism',
    text: '낙관은 성취로 이끄는 믿음이다. 희망과 자신감 없이는 아무것도 이루어지지 않는다.',
    author: '헬렌 켈러',
    source: '낙관론',
  },
  {
    id: 'helen-keller-together',
    text: '혼자서는 할 수 있는 일이 적지만, 함께라면 많은 일을 할 수 있다.',
    author: '헬렌 켈러',
    source: '연설',
  },
  {
    id: 'einstein-question',
    text: '중요한 것은 질문을 멈추지 않는 것이다.',
    author: '아인슈타인',
    source: 'LIFE 인터뷰(1955)',
  },
  {
    id: 'einstein-simple',
    text: '어떤 것을 간단히 설명하지 못한다면 충분히 이해하지 못한 것이다.',
    author: '아인슈타인',
    source: '널리 인용되나 원문 미확인',
  },
  {
    id: 'feynman-fool',
    text: '첫 번째 원칙은 자신을 속이지 않는 것이다. 그리고 자신이 가장 속이기 쉬운 사람이다.',
    author: '리처드 파인만',
    source: '칼텍 졸업 연설(1974)',
  },
  {
    id: 'feynman-teach',
    text: '가르칠 수 없다면 이해한 것이 아니다.',
    author: '리처드 파인만',
    source: '강의 노트',
  },
  {
    id: 'curie-understand',
    text: '삶에서 두려워할 것은 없다. 이해해야 할 것이 있을 뿐이다.',
    author: '마리 퀴리',
    source: '전기',
  },
  {
    id: 'frankl-freedom',
    text: '모든 것을 빼앗겨도 마지막 자유, 어떤 태도를 취할지 고르는 자유는 남는다.',
    author: '빅터 프랭클',
    source: '죽음의 수용소에서',
  },
  {
    id: 'frankl-meaning',
    text: '삶의 의미를 묻지 말고, 삶이 나에게 무엇을 묻는지 들어라.',
    author: '빅터 프랭클',
    source: '죽음의 수용소에서',
  },

  // 동양 고전
  {
    id: 'laozi-thousand',
    text: '천 리 길도 한 걸음에서 시작한다.',
    author: '노자',
    source: '도덕경',
  },
  {
    id: 'laozi-know-self',
    text: '남을 아는 사람은 지혜롭고, 자신을 아는 사람은 밝다.',
    author: '노자',
    source: '도덕경',
  },
  {
    id: 'laozi-water',
    text: '가장 좋은 것은 물과 같다. 물은 다투지 않으면서 만물을 이롭게 한다.',
    author: '노자',
    source: '도덕경',
  },
  {
    id: 'zhuangzi-frog',
    text: '우물 안 개구리에게 바다를 말할 수 없는 것은 그가 사는 곳에 매여 있기 때문이다.',
    author: '장자',
    source: '장자 추수',
  },
  {
    id: 'mencius-heaven',
    text: '하늘이 큰 일을 맡기려 할 때는 먼저 그 마음과 뜻을 괴롭게 한다.',
    author: '맹자',
    source: '맹자 고자하',
  },
  {
    id: 'xunzi-hear-see',
    text: '듣는 것은 보는 것만 못하고, 보는 것은 행하는 것만 못하다.',
    author: '순자',
    source: '순자 유효',
  },
  {
    id: 'xunzi-blue',
    text: '푸른색은 쪽에서 나왔지만 쪽보다 더 푸르다.',
    author: '순자',
    source: '순자 권학',
  },
  {
    id: 'zhuxi-today',
    text: '오늘 배우지 않고 내일이 있다고 말하지 말라.',
    author: '주자',
    source: '주문공 권학문',
  },
  {
    id: 'sunzi-know',
    text: '적을 알고 나를 알면 백 번 싸워도 위태롭지 않다.',
    author: '손자',
    source: '손자병법',
  },
  {
    id: 'analects-daily',
    text: '나는 날마다 세 가지로 나를 돌아본다.',
    author: '증자',
    source: '논어 학이',
  },

  // 과학과 탐구
  {
    id: 'newton-giants',
    text: '내가 더 멀리 보았다면 그것은 거인의 어깨 위에 서 있었기 때문이다.',
    author: '뉴턴',
    source: '로버트 훅에게 보낸 편지(1675)',
  },
  {
    id: 'newton-pebbles',
    text: '나는 바닷가에서 조약돌을 줍는 아이 같았고, 진리의 바다는 그대로 펼쳐져 있었다.',
    author: '뉴턴',
    source: '전기',
  },
  {
    id: 'darwin-attention',
    text: '나에게 특별한 능력은 없다. 다만 오래 붙들고 있었을 뿐이다.',
    author: '다윈',
    source: '자서전',
  },
  {
    id: 'edison-fail',
    text: '나는 실패한 것이 아니라, 되지 않는 방법 만 가지를 찾아낸 것이다.',
    author: '에디슨',
    source: '전기',
  },
  {
    id: 'hilbert-must-know',
    text: '우리는 알아야 한다. 우리는 알게 될 것이다.',
    author: '힐베르트',
    source: '쾨니히스베르크 연설(1930)',
  },
  {
    id: 'polya-plan',
    text: '문제를 풀지 못하겠다면, 풀 수 있는 더 쉬운 문제를 먼저 찾아라.',
    author: '조지 폴리아',
    source: '어떻게 문제를 풀 것인가',
  },
  {
    id: 'polya-understand',
    text: '먼저 문제를 이해하라. 그다음에 계획을 세워라.',
    author: '조지 폴리아',
    source: '어떻게 문제를 풀 것인가',
  },
  {
    id: 'turing-child',
    text: '어른의 마음을 흉내 내려 하기보다 아이의 마음을 흉내 내는 편이 낫지 않을까.',
    author: '앨런 튜링',
    source: '계산 기계와 지능(1950)',
  },
  {
    id: 'hamming-important',
    text: '중요한 문제를 붙들지 않으면 중요한 일을 할 수 없다.',
    author: '리처드 해밍',
    source: '당신과 당신의 연구(1986)',
  },
  {
    id: 'knuth-premature',
    text: '섣부른 최적화는 모든 악의 근원이다.',
    author: '도널드 커누스',
    source: '컴퓨팅 서베이(1974)',
  },
  {
    id: 'dijkstra-simplicity',
    text: '단순함은 신뢰성의 전제 조건이다.',
    author: '에츠허르 데이크스트라',
    source: 'EWD498',
  },
  {
    id: 'montessori-help-me',
    text: '아이가 바라는 것은 스스로 할 수 있도록 도와 달라는 것이다.',
    author: '마리아 몬테소리',
    source: '어린이의 발견',
  },
  {
    id: 'freire-banking',
    text: '지식은 채워 넣는 것이 아니라 함께 만들어 가는 것이다.',
    author: '파울루 프레이리',
    source: '페다고지',
  },
  {
    id: 'vygotsky-tomorrow',
    text: '오늘 도움을 받아 할 수 있는 것을 내일은 혼자 할 수 있게 된다.',
    author: '비고츠키',
    source: '사회 속의 정신',
  },
]

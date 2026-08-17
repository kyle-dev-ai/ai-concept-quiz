import { readFileSync } from 'node:fs'

// 문항 품질 중 기계로 셀 수 있는 것만 검사한다.
// 사실 정확성처럼 판단이 필요한 항목은 audit-content 스킬의 검수 에이전트가 담당한다.

const evalManifest = JSON.parse(readFileSync('assets/evals/eval-manifest.v1.json', 'utf8'))
const bankPath = `public/generated/question-bank.${evalManifest.datasetVersion}.json`
const bank = JSON.parse(readFileSync(bankPath, 'utf8'))

const scopeArg = process.argv.find((arg) => arg.startsWith('--ids='))
const scopeIds = scopeArg ? new Set(scopeArg.slice('--ids='.length).split(',')) : null
const questions = scopeIds ? bank.filter((q) => scopeIds.has(q.id)) : bank

// 10~20초에 말할 수 있는 길이. 한국어 구술 속도를 분당 300자 안팎으로 보고 잡은 범위다.
const shortAnswerRange = [60, 135]
const deepAnswerRange = [80, 320]

// 사람이 쓴 글에도 나오지만, 여러 문항에서 같은 비율로 반복되면 기계가 찍어낸 티가 난다.
const hedgePatterns = [
  '일반적으로',
  '대체로',
  '경우가 많습니다',
  '수 있습니다',
  '편이 좋습니다',
  '것이 중요합니다',
  '해야 합니다',
]
const translationesePatterns = ['에 대한', '을 통해', '를 통해', '에 있어', '라고 할 수 있']

const findings = []
const add = (severity, code, questionId, message) =>
  findings.push({ severity, code, questionId, message })

function sentences(text) {
  return text
    .split(/(?<=다\.)\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function checkLength(question) {
  const short = question.shortAnswer.length
  if (short < shortAnswerRange[0] || short > shortAnswerRange[1]) {
    add(
      short > shortAnswerRange[1] ? 'warn' : 'info',
      'SHORT_ANSWER_LENGTH',
      question.id,
      `10초 답변이 ${short}자입니다. 목표 범위는 ${shortAnswerRange.join('~')}자입니다.`,
    )
  }
  const deep = question.deepAnswer.length
  if (deep < deepAnswerRange[0] || deep > deepAnswerRange[1]) {
    add(
      'info',
      'DEEP_ANSWER_LENGTH',
      question.id,
      `심화 답변이 ${deep}자입니다. 목표 범위는 ${deepAnswerRange.join('~')}자입니다.`,
    )
  }
  const count = sentences(question.shortAnswer).length
  if (count > 3) {
    add(
      'warn',
      'SHORT_ANSWER_SENTENCES',
      question.id,
      `10초 답변이 ${count}문장입니다. 2~3문장으로 줄여야 실제로 말할 수 있습니다.`,
    )
  }
}

function checkKeyPointEcho(question) {
  const answer = question.shortAnswer.replace(/\s+/g, '')
  for (const point of question.keyPoints) {
    const core = point.replace(/\s+/g, '')
    if (core.length >= 10 && answer.includes(core)) {
      add(
        'warn',
        'KEY_POINT_ECHO',
        question.id,
        `핵심 포인트가 10초 답변을 그대로 반복합니다: "${point}"`,
      )
    }
  }
  const [first, second] = question.keyPoints
  if (first && second) {
    const overlap = [...new Set(first.replace(/\s+/g, ''))].filter((c) =>
      second.replace(/\s+/g, '').includes(c),
    ).length
    const ratio = overlap / Math.min(first.length, second.length)
    if (ratio > 0.85) {
      add('info', 'KEY_POINT_SIMILAR', question.id, '핵심 포인트 두 개가 서로 비슷합니다.')
    }
  }
}

function checkPromptEcho(question) {
  const prompt = question.prompt.replace(/[?？\s]/g, '')
  const stem = prompt.slice(0, Math.min(20, prompt.length))
  if (stem.length >= 12 && question.shortAnswer.replace(/\s+/g, '').includes(stem)) {
    add('info', 'PROMPT_ECHO', question.id, '10초 답변이 질문 문장을 그대로 되풀이합니다.')
  }
}

function ratioReport(label, pattern) {
  const hit = questions.filter((q) =>
    `${q.shortAnswer} ${q.deepAnswer} ${q.keyPoints.join(' ')}`.includes(pattern),
  )
  return { label, pattern, count: hit.length, ratio: hit.length / questions.length }
}

function checkCorpusPatterns() {
  const hedges = hedgePatterns.map((p) => ratioReport('hedge', p)).sort((a, b) => b.ratio - a.ratio)
  const translationese = translationesePatterns
    .map((p) => ratioReport('translationese', p))
    .sort((a, b) => b.ratio - a.ratio)

  console.info('\n표현 반복 비율 (문항 대비)')
  for (const entry of [...hedges, ...translationese]) {
    if (entry.ratio === 0) continue
    const flag = entry.ratio > 0.6 ? ' ← 과다' : ''
    console.info(
      `  ${entry.pattern.padEnd(14)} ${String(entry.count).padStart(4)}개 ${(entry.ratio * 100).toFixed(1)}%${flag}`,
    )
    if (entry.ratio > 0.6) {
      add(
        'warn',
        'REPEATED_PHRASE',
        '(전체)',
        `"${entry.pattern}"이 문항의 ${(entry.ratio * 100).toFixed(0)}%에 등장합니다. 표현을 다양화하세요.`,
      )
    }
  }

  const endings = new Map()
  for (const question of questions) {
    for (const sentence of sentences(question.shortAnswer)) {
      const tail = sentence.slice(-8)
      endings.set(tail, (endings.get(tail) ?? 0) + 1)
    }
  }
  const topEndings = [...endings.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
  console.info('\n10초 답변 문장 끝 반복 상위')
  for (const [tail, count] of topEndings) {
    console.info(`  ${String(count).padStart(4)}회  …${tail}`)
  }

  const followUpTail = new Map()
  for (const question of questions) {
    const tail = question.followUp.replace(/\s+/g, '').slice(-10)
    followUpTail.set(tail, (followUpTail.get(tail) ?? 0) + 1)
  }
  const topFollowUp = [...followUpTail.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3)
  console.info('\n꼬리질문 끝 반복 상위')
  for (const [tail, count] of topFollowUp) {
    const ratio = count / questions.length
    console.info(`  ${String(count).padStart(4)}회 ${(ratio * 100).toFixed(1)}%  …${tail}`)
    if (ratio > 0.35) {
      add(
        'warn',
        'FOLLOW_UP_MONOTONE',
        '(전체)',
        `꼬리질문의 ${(ratio * 100).toFixed(0)}%가 "…${tail}"로 끝납니다.`,
      )
    }
  }
}

function checkCrossDuplication() {
  const seen = new Map()
  for (const question of questions) {
    const text = `${question.shortAnswer}${question.deepAnswer}`.replace(/\s+/g, '')
    for (let i = 0; i + 24 <= text.length; i += 6) {
      const gram = text.slice(i, i + 24)
      const owner = seen.get(gram)
      if (owner && owner !== question.id) {
        add(
          'warn',
          'CROSS_QUESTION_DUPLICATE',
          question.id,
          `${owner}와 같은 문장 조각을 씁니다: "${gram}"`,
        )
      } else if (!owner) {
        seen.set(gram, question.id)
      }
    }
  }
}

function checkDistribution() {
  const byCategory = new Map()
  for (const question of bank) {
    const entry = byCategory.get(question.category) ?? {
      foundation: 0,
      intermediate: 0,
      advanced: 0,
    }
    entry[question.difficulty] += 1
    byCategory.set(question.category, entry)
  }
  console.info('\n카테고리별 난이도 분포 (전체 기준)')
  for (const [category, entry] of byCategory) {
    const total = entry.foundation + entry.intermediate + entry.advanced
    console.info(
      `  ${category.padEnd(12)} 총 ${String(total).padStart(3)}  기초 ${String(entry.foundation).padStart(2)}  중급 ${String(entry.intermediate).padStart(2)}  심화 ${String(entry.advanced).padStart(2)}`,
    )
    if (entry.foundation === 0) {
      add(
        'warn',
        'NO_FOUNDATION',
        `(${category})`,
        '기초 문항이 없어 이 카테고리를 처음 여는 사용자에게 진입로가 없습니다.',
      )
    }
  }
}

console.info(`검사 대상: ${questions.length}문항 (dataset ${evalManifest.datasetVersion})`)
for (const question of questions) {
  checkLength(question)
  checkKeyPointEcho(question)
  checkPromptEcho(question)
}
checkCorpusPatterns()
checkCrossDuplication()
checkDistribution()

const bySeverity = { warn: [], info: [] }
for (const finding of findings) bySeverity[finding.severity].push(finding)

console.info(
  `\n지적 ${findings.length}건 (warn ${bySeverity.warn.length}, info ${bySeverity.info.length})`,
)
for (const severity of ['warn', 'info']) {
  if (bySeverity[severity].length === 0) continue
  console.info(`\n[${severity}]`)
  for (const finding of bySeverity[severity]) {
    console.info(`  ${finding.code} · ${finding.questionId}\n    ${finding.message}`)
  }
}

console.info(
  '\n이 검사는 셀 수 있는 것만 봅니다. 사실 정확성, 말투의 자연스러움, 학습자 적합성은 audit-content 스킬의 검수 에이전트가 판단합니다.',
)

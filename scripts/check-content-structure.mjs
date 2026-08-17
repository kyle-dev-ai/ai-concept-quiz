import { readFileSync } from 'node:fs'
import { learningGoals } from '../src/domain/learning/goal.ts'
import { learnerGroups } from '../src/domain/learning/learner-profile.ts'

// 검수에서 반복해서 나온 구조 결함을 결정론적으로 막는다.
// 사실 정확성과 말투는 여기서 못 잡는다. 그건 audit-content 스킬의 몫이다.
//
// baseline은 이미 존재하는 부채를 기록해 둔 것이다. 게이트는 "새로 늘어나는 것"만 막는다.
// baseline 항목이 해결되면 목록에서 지워야 하고, 지우지 않으면 경고로 알려준다.

const evalManifest = JSON.parse(readFileSync('assets/evals/eval-manifest.v1.json', 'utf8'))
const bank = JSON.parse(
  readFileSync(`public/generated/question-bank.${evalManifest.datasetVersion}.json`, 'utf8'),
)
const baseline = JSON.parse(readFileSync('assets/evals/content-baseline.json', 'utf8'))
const goldenCases = readFileSync('assets/evals/golden-set.v1.jsonl', 'utf8')
  .split('\n')
  .filter((line) => line.trim().length > 0)
  .map((line) => JSON.parse(line))

const byId = new Map(bank.map((question) => [question.id, question]))
const difficultyRank = { foundation: 0, intermediate: 1, advanced: 2 }

let failed = false
function fail(message) {
  console.error(`CONTENT STRUCTURE FAIL: ${message}`)
  failed = true
}

/** baseline에 없는 새 항목만 실패로 본다. 해결된 baseline 항목은 정리하라고 알린다. */
function gateAgainstBaseline(label, current, known) {
  const knownSet = new Set(known)
  const added = current.filter((entry) => !knownSet.has(entry))
  const resolved = known.filter((entry) => !current.includes(entry))

  console.info(`${label}: ${current.length}건 (baseline ${known.length})`)
  if (added.length > 0) {
    fail(`${label}이 새로 늘었습니다.\n    ${added.join('\n    ')}`)
  }
  if (resolved.length > 0) {
    console.info(
      `  ↳ 해결된 baseline 항목 ${resolved.length}건. assets/evals/content-baseline.json에서 지우세요.`,
    )
    console.info(`    ${resolved.join('\n    ')}`)
  }
}

/** 선수 개념이 없거나 모두 기초면 배경 지식 없이 읽을 수 있다고 본다. */
function isEntryPoint(question) {
  return (
    question.difficulty === 'foundation' &&
    question.prerequisites.every((id) => byId.get(id)?.difficulty === 'foundation')
  )
}

// 1. 카테고리마다 진입로가 있어야 한다.
//    이게 0이면 그 카테고리를 처음 여는 사용자는 아무 문항도 읽을 수 없다.
function checkEntryPoints() {
  const categories = [...new Set(bank.map((question) => question.category))]
  console.info('\n카테고리별 진입로 (배경 없이 읽을 수 있는 기초 문항)')
  for (const category of categories) {
    const entries = bank.filter(
      (question) => question.category === category && isEntryPoint(question),
    )
    console.info(`  ${category.padEnd(12)} ${entries.length}개`)
    if (entries.length === 0) {
      fail(`${category} 카테고리에 배경 없이 읽을 수 있는 기초 문항이 없습니다.`)
    }
  }
}

// 2. 추천 덱은 그 안에서 완결되어야 한다.
//    덱에 들어간 문항이 덱 밖 문항을 선수로 요구하면 학습자는 설명 없는 용어를 만난다.
function checkDeckReachability() {
  const broken = []
  for (const goal of learningGoals) {
    for (const group of learnerGroups) {
      const deck = bank.filter(
        (question) =>
          goal.recommendedCategories.includes(question.category) &&
          group.recommendedDifficulties.includes(question.difficulty),
      )
      const deckIds = new Set(deck.map((question) => question.id))
      for (const question of deck) {
        for (const prerequisite of question.prerequisites) {
          if (!deckIds.has(prerequisite)) {
            broken.push(`${goal.id}/${group.id}: ${question.id} ← ${prerequisite}`)
          }
        }
      }
    }
  }
  console.info('')
  gateAgainstBaseline('덱 밖 선수 요구', broken.sort(), baseline.knownDeckGaps)
}

// 3. 쉬운 문항이 어려운 문항을 선수로 요구하면 순서가 뒤집힌 것이다.
function checkDifficultyInversion() {
  const inverted = []
  for (const question of bank) {
    for (const prerequisite of question.prerequisites) {
      const parent = byId.get(prerequisite)
      if (parent && difficultyRank[parent.difficulty] > difficultyRank[question.difficulty]) {
        inverted.push(
          `${question.id}(${question.difficulty}) ← ${prerequisite}(${parent.difficulty})`,
        )
      }
    }
  }
  gateAgainstBaseline('난이도 역전', inverted.sort(), baseline.knownDifficultyInversions)
}

// 4. 골든 케이스가 없는 문항은 회귀 검사를 받지 못한다.
//    새 문항은 반드시 골든 케이스와 함께 들어와야 한다.
function checkGoldenCoverage() {
  const covered = new Set(goldenCases.map((goldenCase) => goldenCase.questionId))
  const uncovered = bank.map((question) => question.id).filter((id) => !covered.has(id))
  gateAgainstBaseline('골든 케이스 없는 문항', uncovered.sort(), baseline.knownGoldenGaps)
}

console.info(`검사 대상: ${bank.length}문항 (dataset ${evalManifest.datasetVersion})`)
checkEntryPoints()
checkDeckReachability()
checkDifficultyInversion()
checkGoldenCoverage()

if (failed) {
  console.error(
    '\n새로 늘어난 구조 결함이 있습니다. 문항을 고치거나, 의도한 변경이라면 baseline을 갱신하세요.',
  )
  process.exitCode = 1
} else {
  console.info('\n콘텐츠 구조 검사를 통과했습니다.')
}

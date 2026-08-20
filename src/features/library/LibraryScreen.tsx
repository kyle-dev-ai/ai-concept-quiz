import { useMemo, useState } from 'react'
import type { BannerAdProvider } from '../../application/ports/banner-ad-provider'
import type { LearningProgress } from '../../domain/learning/progress'
import {
  type CategoryId,
  categories,
  categoryById,
  difficultyLabel,
  type StudyQuestion,
} from '../../domain/learning/question'
import { searchQuestions } from '../../domain/learning/session'
import { AdSlot } from '../monetization/AdSlot'

interface LibraryScreenProps {
  readonly questions: readonly StudyQuestion[]
  readonly progress: LearningProgress
  readonly adsEnabled: boolean
  readonly bannerAds: BannerAdProvider
  readonly onStudyCategory: (category: CategoryId) => void
}

export function LibraryScreen({
  questions,
  progress,
  adsEnabled,
  bannerAds,
  onStudyCategory,
}: LibraryScreenProps) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryId | 'all'>('all')
  const filteredQuestions = useMemo(
    () => searchQuestions(questions, query, category),
    [questions, query, category],
  )

  return (
    <main className="page library-screen">
      <header className="page-header">
        <span className="eyebrow">질문 용어집</span>
        <h1 className="library-screen__watermark">
          Find it. Open it up.
          <br />
          Say it your way.
        </h1>
        <p>정의만 외우지 않도록 모든 용어를 질문으로 만들었어요.</p>
      </header>

      <label className="search-field" htmlFor="question-search">
        <span aria-hidden="true">⌕</span>
        <input
          id="question-search"
          type="search"
          value={query}
          placeholder="Attention, 역전파, RAG 검색"
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>

      <fieldset className="filter-scroll">
        <legend className="sr-only">용어 카테고리</legend>
        <button
          type="button"
          className="filter-chip"
          data-selected={category === 'all'}
          onClick={() => setCategory('all')}
        >
          전체 {questions.length}
        </button>
        {categories.map((item) => {
          const count = questions.filter((question) => question.category === item.id).length
          return (
            <button
              key={item.id}
              type="button"
              className="filter-chip"
              data-selected={category === item.id}
              onClick={() => setCategory(item.id)}
            >
              {item.shortLabel} {count}
            </button>
          )
        })}
      </fieldset>

      <div className="library-results-heading">
        <strong>{filteredQuestions.length}개 질문</strong>
        {category === 'all' ? null : (
          <button type="button" className="text-button" onClick={() => onStudyCategory(category)}>
            이 카테고리 학습
          </button>
        )}
      </div>

      <AdSlot enabled={adsEnabled} placement="library-inline-banner" provider={bannerAds} />

      {filteredQuestions.length === 0 ? (
        <section className="empty-state">
          <span aria-hidden="true">?</span>
          <h2>일치하는 질문이 없어요.</h2>
          <p>짧은 단어로 다시 검색하거나 전체 카테고리를 열어보세요.</p>
        </section>
      ) : (
        <div className="glossary-list">
          {filteredQuestions.map((question, index) => {
            const entry = progress.questions[question.id]
            return (
              <details key={question.id} className="glossary-item">
                <summary>
                  <span className="glossary-item__index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="glossary-item__title">
                    <small>
                      {categoryById[question.category].shortLabel} ·{' '}
                      {difficultyLabel[question.difficulty]}
                    </small>
                    <strong>{question.term}</strong>
                    <span>{question.prompt}</span>
                  </span>
                  <span className="glossary-item__toggle" aria-hidden="true">
                    +
                  </span>
                </summary>
                <div className="glossary-item__answer">
                  {entry?.bestSimilarity === undefined ? null : (
                    <div className="spoken-trend">
                      <span className="spoken-trend__label">내 발화 기록</span>
                      <span className="spoken-trend__values">
                        {entry.lastSimilarity !== undefined &&
                        entry.lastSimilarity !== entry.bestSimilarity ? (
                          <>
                            <em>{entry.lastSimilarity}%</em>
                            <i aria-hidden="true">·</i>
                          </>
                        ) : null}
                        <strong>최고 {entry.bestSimilarity}%</strong>
                      </span>
                      {(entry.missedKeyPoints?.length ?? 0) > 0 ? (
                        <small>아직 못 말한 포인트 {entry.missedKeyPoints?.length}개</small>
                      ) : null}
                    </div>
                  )}
                  <span>핵심 답변</span>
                  <p>{question.shortAnswer}</p>
                  <ul>
                    {question.keyPoints.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <div>
                    <small>꼬리질문</small>
                    <p>{question.followUp}</p>
                  </div>
                </div>
              </details>
            )
          })}
        </div>
      )}
    </main>
  )
}

import type { BannerAdProvider } from '../../application/ports/banner-ad-provider'
import { learningGoalById } from '../../domain/learning/goal'
import { type LearnerProfile, learnerGroupById } from '../../domain/learning/learner-profile'
import { AppFooter } from '../../shared/components/AppFooter'
import { AdSlot } from '../monetization/AdSlot'

interface ProfileScreenProps {
  readonly profile: LearnerProfile
  readonly adsEnabled: boolean
  readonly bannerAds: BannerAdProvider
  readonly onEdit: () => void
}

export function ProfileScreen({ profile, adsEnabled, bannerAds, onEdit }: ProfileScreenProps) {
  const learnerGroup = learnerGroupById[profile.groupId]
  const learningGoal = learningGoalById[profile.learningGoalId]

  return (
    <main className="page profile-screen">
      <header className="page-header page-header--compact">
        <span className="eyebrow">MY PROFILE</span>
        <h1 className="profile-screen__watermark">
          Your deck. <br />
          Your pace.
        </h1>
        <p>지금의 목표에 맞춰 질문 순서를 정해요.</p>
      </header>

      <section className="profile-card" aria-labelledby="profile-nickname">
        <span className="profile-card__avatar" aria-hidden="true">
          {profile.nickname.slice(-1)}
        </span>
        <span>현재 학습자</span>
        <h2 id="profile-nickname">{profile.nickname}</h2>
        <p>
          {learnerGroup.label} · {learningGoal.label}
        </p>
      </section>

      <dl className="profile-facts">
        <div>
          <dt>학습자 유형</dt>
          <dd>{learnerGroup.label}</dd>
        </div>
        <div>
          <dt>학습 목표</dt>
          <dd>{learningGoal.label}</dd>
        </div>
        <div>
          <dt>추천 질문 흐름</dt>
          <dd>{learningGoal.recommendation}</dd>
        </div>
        {profile.goalNote.length > 0 ? (
          <div>
            <dt>내가 적은 목표</dt>
            <dd>{profile.goalNote}</dd>
          </div>
        ) : null}
      </dl>

      <button
        type="button"
        className="button button--primary button--wide profile-edit"
        onClick={onEdit}
      >
        학습 설정 변경
      </button>

      <AdSlot enabled={adsEnabled} placement="profile-inline-banner" provider={bannerAds} />

      <AppFooter />
    </main>
  )
}

import type { CountdownCue } from '../../application/ports/countdown-cue'

interface AudioCapableWindow {
  AudioContext?: typeof AudioContext
  webkitAudioContext?: typeof AudioContext
}

function audioContextConstructor(): typeof AudioContext | undefined {
  if (typeof window === 'undefined') {
    return undefined
  }
  const candidate = window as unknown as AudioCapableWindow
  return candidate.AudioContext ?? candidate.webkitAudioContext
}

interface ToneShape {
  readonly frequency: number
  readonly duration: number
  readonly peak: number
}

// "뜨 뜨 뜨 뜨 뜬!" — 짧고 마른 소리 네 번 뒤 한 음 올린 마무리.
// 알림음이 아니라 박자를 주는 것이 목적이라 소리를 작게 잡는다.
const tickTone: ToneShape = { frequency: 660, duration: 0.07, peak: 0.055 }
const finishTone: ToneShape = { frequency: 990, duration: 0.2, peak: 0.09 }

/**
 * Web Audio로 카운트다운 소리를 내는 어댑터.
 *
 * 오디오 파일을 담지 않고 합성해서 번들 크기를 늘리지 않는다.
 * 브라우저 자동재생 정책 때문에 `prepare()`를 사용자 조작 안에서 불러야
 * 실제로 소리가 난다. 그 밖의 실패는 모두 조용히 무시한다.
 */
export class WebAudioCountdownCue implements CountdownCue {
  private context: AudioContext | undefined

  public prepare(): void {
    const Context = audioContextConstructor()
    if (Context === undefined) {
      return
    }

    try {
      this.context ??= new Context()
      if (this.context.state === 'suspended') {
        void this.context.resume().catch(() => undefined)
      }
    } catch {
      this.context = undefined
    }
  }

  public tick(): void {
    this.play(tickTone)
  }

  public finish(): void {
    this.play(finishTone)
  }

  private play(tone: ToneShape): void {
    const context = this.context
    if (context === undefined || context.state !== 'running') {
      return
    }

    try {
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      const startedAt = context.currentTime

      oscillator.type = 'triangle'
      oscillator.frequency.setValueAtTime(tone.frequency, startedAt)

      // 딱 끊기면 클릭 잡음이 생기므로 짧게 올렸다가 지수적으로 떨어뜨린다.
      gain.gain.setValueAtTime(0.0001, startedAt)
      gain.gain.exponentialRampToValueAtTime(tone.peak, startedAt + 0.012)
      gain.gain.exponentialRampToValueAtTime(0.0001, startedAt + tone.duration)

      oscillator.connect(gain)
      gain.connect(context.destination)
      oscillator.start(startedAt)
      oscillator.stop(startedAt + tone.duration + 0.02)
    } catch {
      // 소리는 부가 요소다. 실패해도 학습 흐름을 막지 않는다.
    }
  }
}

import { afterEach, describe, expect, it, vi } from 'vitest'
import type { SpeechFailure } from '../../application/ports/speech-recognizer'
import { BrowserSpeechRecognizer } from './browser-speech-recognizer'

interface FakeResult {
  readonly isFinal: boolean
  readonly transcript: string
}

class FakeRecognition {
  static instances: FakeRecognition[] = []
  static failOnStart = false

  lang = ''
  continuous = false
  interimResults = false
  maxAlternatives = 0
  onresult: ((event: unknown) => void) | null = null
  onerror: ((event: unknown) => void) | null = null
  onend: (() => void) | null = null
  started = false
  stopCount = 0

  constructor() {
    FakeRecognition.instances.push(this)
  }

  start(): void {
    if (FakeRecognition.failOnStart) {
      throw new Error('already started')
    }
    this.started = true
  }

  stop(): void {
    this.stopCount += 1
  }

  abort(): void {
    this.stopCount += 1
  }

  emit(results: readonly FakeResult[], resultIndex = 0): void {
    // 실제 API의 results는 배열이 아니라 length와 인덱스를 가진 유사 배열이다.
    const resultList: Record<string, unknown> = { length: results.length }
    results.forEach((result, index) => {
      resultList[index] = {
        isFinal: result.isFinal,
        length: 1,
        0: { transcript: result.transcript },
      }
    })

    this.onresult?.({ resultIndex, results: resultList })
  }

  /** 결과마다 후보를 여러 개 담아 보낸다. */
  emitWithAlternatives(results: readonly (readonly string[])[], resultIndex = 0): void {
    const resultList: Record<string, unknown> = { length: results.length }
    results.forEach((alternatives, index) => {
      const entry: Record<string, unknown> = { isFinal: true, length: alternatives.length }
      alternatives.forEach((transcript, choice) => {
        entry[choice] = { transcript }
      })
      resultList[index] = entry
    })

    this.onresult?.({ resultIndex, results: resultList })
  }

  fail(error: string): void {
    this.onerror?.({ error })
  }
}

function installRecognition(recognitionClass: unknown): void {
  Object.defineProperty(window, 'webkitSpeechRecognition', {
    configurable: true,
    writable: true,
    value: recognitionClass,
  })
}

afterEach(() => {
  FakeRecognition.instances = []
  FakeRecognition.failOnStart = false
  Reflect.deleteProperty(window as unknown as Record<string, unknown>, 'webkitSpeechRecognition')
  Reflect.deleteProperty(window as unknown as Record<string, unknown>, 'SpeechRecognition')
})

describe('BrowserSpeechRecognizer', () => {
  it('생성자가 없으면 지원하지 않는다고 알린다', () => {
    const recognizer = new BrowserSpeechRecognizer()
    const onFailure = vi.fn()

    expect(recognizer.isSupported).toBe(false)
    recognizer.start({ onTranscript: vi.fn(), onFailure })

    expect(onFailure).toHaveBeenCalledWith<[SpeechFailure]>('unsupported')
  })

  it('한국어로 연속 인식을 시작한다', () => {
    installRecognition(FakeRecognition)
    const recognizer = new BrowserSpeechRecognizer()

    expect(recognizer.isSupported).toBe(true)
    recognizer.start({ onTranscript: vi.fn(), onFailure: vi.fn() })

    const recognition = FakeRecognition.instances[0]
    expect(recognition?.started).toBe(true)
    expect(recognition?.lang).toBe('ko-KR')
    expect(recognition?.continuous).toBe(true)
    expect(recognition?.interimResults).toBe(true)
  })

  it('확정된 조각을 누적하고 미확정 조각을 뒤에 붙인다', () => {
    installRecognition(FakeRecognition)
    const onTranscript = vi.fn()
    new BrowserSpeechRecognizer().start({ onTranscript, onFailure: vi.fn() })
    const recognition = FakeRecognition.instances[0]

    recognition?.emit([{ isFinal: true, transcript: '벡터는 방향과 크기' }])
    expect(onTranscript).toHaveBeenLastCalledWith('벡터는 방향과 크기', [])

    // results는 누적 목록이고 resultIndex가 새로 들어온 결과의 시작점이다.
    recognition?.emit(
      [
        { isFinal: true, transcript: '벡터는 방향과 크기' },
        { isFinal: false, transcript: '를 가진 배열' },
      ],
      1,
    )
    expect(onTranscript).toHaveBeenLastCalledWith('벡터는 방향과 크기를 가진 배열', [])
  })

  it('권한 거부와 무음을 구분해 알린다', () => {
    installRecognition(FakeRecognition)
    const onFailure = vi.fn()
    new BrowserSpeechRecognizer().start({ onTranscript: vi.fn(), onFailure })
    const recognition = FakeRecognition.instances[0]

    recognition?.fail('not-allowed')
    expect(onFailure).toHaveBeenLastCalledWith<[SpeechFailure]>('denied')

    recognition?.fail('no-speech')
    expect(onFailure).toHaveBeenLastCalledWith<[SpeechFailure]>('no-speech')

    recognition?.fail('audio-capture')
    expect(onFailure).toHaveBeenLastCalledWith<[SpeechFailure]>('error')
  })

  it('멈춘 뒤에 오는 오류는 사용자에게 알리지 않는다', () => {
    installRecognition(FakeRecognition)
    const onFailure = vi.fn()
    const session = new BrowserSpeechRecognizer().start({
      onTranscript: vi.fn(),
      onFailure,
    })

    session.stop()
    FakeRecognition.instances[0]?.fail('no-speech')

    expect(onFailure).not.toHaveBeenCalled()
  })

  it('stop을 여러 번 불러도 한 번만 멈춘다', () => {
    installRecognition(FakeRecognition)
    const session = new BrowserSpeechRecognizer().start({
      onTranscript: vi.fn(),
      onFailure: vi.fn(),
    })

    session.stop()
    session.stop()

    expect(FakeRecognition.instances[0]?.stopCount).toBe(1)
  })

  it('start가 예외를 던지면 오류로 알린다', () => {
    installRecognition(FakeRecognition)
    FakeRecognition.failOnStart = true
    const onFailure = vi.fn()

    new BrowserSpeechRecognizer().start({ onTranscript: vi.fn(), onFailure })

    expect(onFailure).toHaveBeenCalledWith<[SpeechFailure]>('error')
  })

  it('인식기가 내놓은 다른 후보를 함께 넘긴다', () => {
    installRecognition(FakeRecognition)
    const onTranscript = vi.fn()
    new BrowserSpeechRecognizer().start({ onTranscript, onFailure: vi.fn() })
    const recognition = FakeRecognition.instances[0]

    recognition?.emitWithAlternatives([['에레렘은', 'LLM은', 'LLM은']])

    expect(onTranscript).toHaveBeenLastCalledWith('에레렘은', ['LLM은'])
  })

  it('여러 후보를 요청한다', () => {
    installRecognition(FakeRecognition)
    new BrowserSpeechRecognizer().start({ onTranscript: vi.fn(), onFailure: vi.fn() })

    expect(FakeRecognition.instances[0]?.maxAlternatives).toBeGreaterThan(1)
  })
})

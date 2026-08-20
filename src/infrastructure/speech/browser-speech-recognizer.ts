import type {
  SpeechFailure,
  SpeechHandlers,
  SpeechRecognizer,
  SpeechSession,
} from '../../application/ports/speech-recognizer'

// Web Speech API는 표준 lib.dom 타입에 아직 없어서 쓰는 만큼만 선언한다.
// Safari는 webkit 접두사 생성자만 제공한다.
interface SpeechRecognitionAlternativeLike {
  readonly transcript: string
}

interface SpeechRecognitionResultLike {
  readonly isFinal: boolean
  readonly length: number
  readonly [index: number]: SpeechRecognitionAlternativeLike | undefined
}

interface SpeechRecognitionResultListLike {
  readonly length: number
  readonly [index: number]: SpeechRecognitionResultLike | undefined
}

interface SpeechRecognitionEventLike {
  readonly resultIndex: number
  readonly results: SpeechRecognitionResultListLike
}

interface SpeechRecognitionErrorEventLike {
  readonly error: string
}

interface SpeechRecognitionLike {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
  abort(): void
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike

interface SpeechCapableWindow {
  SpeechRecognition?: SpeechRecognitionConstructor
  webkitSpeechRecognition?: SpeechRecognitionConstructor
}

function recognitionConstructor(): SpeechRecognitionConstructor | undefined {
  if (typeof window === 'undefined') {
    return undefined
  }

  const candidate = window as unknown as SpeechCapableWindow
  return candidate.SpeechRecognition ?? candidate.webkitSpeechRecognition
}

function failureFor(error: string): SpeechFailure {
  if (error === 'not-allowed' || error === 'service-not-allowed') {
    return 'denied'
  }
  return error === 'no-speech' ? 'no-speech' : 'error'
}

const noopSession: SpeechSession = { stop: () => undefined }

// 후보를 늘리면 한글로 뭉개진 영문 용어가 다른 후보에 제대로 담기는 경우가 있다.
// 너무 늘리면 엉뚱한 문장이 섞이므로 적당한 수에서 끊는다.
const maxAlternatives = 4

/**
 * 브라우저 내장 음성 인식 어댑터.
 *
 * 인식 처리 위치는 브라우저가 정한다. Safari를 비롯한 일부 브라우저는 음성을
 * 자사 서버로 보내 변환하므로, 마이크를 켜는 화면에서 그 사실을 함께 안내한다.
 * 전사 결과는 앱 밖으로 나가지 않고 저장하지도 않는다.
 */
export class BrowserSpeechRecognizer implements SpeechRecognizer {
  get isSupported(): boolean {
    return recognitionConstructor() !== undefined
  }

  start(handlers: SpeechHandlers): SpeechSession {
    const Recognition = recognitionConstructor()
    if (Recognition === undefined) {
      handlers.onFailure('unsupported')
      return noopSession
    }

    const recognition = new Recognition()
    recognition.lang = 'ko-KR'
    recognition.continuous = true
    recognition.interimResults = true
    recognition.maxAlternatives = maxAlternatives

    // 확정된 조각만 누적하고, 아직 확정 안 된 조각은 매번 뒤에 덧붙여 보여준다.
    // 후보별로 따로 이어 붙여, 채점이 가장 잘 맞는 후보를 고를 수 있게 한다.
    const settled: string[] = Array.from({ length: maxAlternatives }, () => '')
    let stopped = false

    recognition.onresult = (event) => {
      const interim: string[] = Array.from({ length: maxAlternatives }, () => '')

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index]
        const best = result?.[0]
        if (result === undefined || best === undefined) {
          continue
        }

        for (let choice = 0; choice < maxAlternatives; choice += 1) {
          // 후보가 하나뿐인 구간은 첫 번째 후보로 채워 문장이 끊기지 않게 한다.
          const text = (result[choice] ?? best).transcript
          if (result.isFinal) {
            settled[choice] += text
          } else {
            interim[choice] += text
          }
        }
      }

      const candidates = settled.map((text, choice) => `${text}${interim[choice] ?? ''}`.trim())
      const [primary = '', ...rest] = candidates
      // 후보가 부족한 구간은 첫 후보로 메워지므로 같은 문장이 여러 번 나온다.
      const others = [...new Set(rest)].filter((text) => text.length > 0 && text !== primary)

      handlers.onTranscript(primary, others)
    }

    recognition.onerror = (event) => {
      // 말을 멈추면 no-speech가 흔히 뜬다. 멈춘 뒤의 오류는 알리지 않는다.
      if (stopped) {
        return
      }
      handlers.onFailure(failureFor(event.error))
    }

    try {
      recognition.start()
    } catch {
      // 이미 시작된 인스턴스에 start를 부르면 예외가 난다. 사용자에게는 일반 오류로 알린다.
      handlers.onFailure('error')
      return noopSession
    }

    return {
      stop: () => {
        if (stopped) {
          return
        }
        stopped = true
        try {
          recognition.stop()
        } catch {
          // 이미 끝난 인식을 멈추는 것은 실패로 볼 일이 아니다.
        }
      },
    }
  }
}

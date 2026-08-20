/** 음성 인식이 실패하는 이유. 화면에서 각각 다른 안내를 보여준다. */
export type SpeechFailure = 'unsupported' | 'denied' | 'no-speech' | 'error'

export interface SpeechSession {
  /** 인식을 멈춘다. 여러 번 불러도 안전해야 한다. */
  stop(): void
}

export interface SpeechHandlers {
  /**
   * 인식 중간 결과를 포함해 지금까지 들린 전체 발화.
   * `alternatives`는 인식기가 함께 내놓은 다른 후보 문장이다. 한국어 인식기는
   * 영문 용어를 한글 발음으로 적거나 뭉개는 일이 잦아, 채점은 후보 중 가장
   * 잘 맞는 것을 쓴다. 화면에 보여주는 것은 언제나 첫 번째 후보다.
   */
  readonly onTranscript: (transcript: string, alternatives: readonly string[]) => void
  readonly onFailure: (failure: SpeechFailure) => void
}

export interface SpeechRecognizer {
  /** 이 환경에서 음성 인식을 쓸 수 있는지. */
  readonly isSupported: boolean
  start(handlers: SpeechHandlers): SpeechSession
}

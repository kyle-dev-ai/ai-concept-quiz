import type { KeyValueStore } from '../../application/ports/key-value-store'

export class StorageUnavailableError extends Error {
  public constructor() {
    super('이 환경에서는 기기 저장소를 사용할 수 없습니다.')
    this.name = 'StorageUnavailableError'
  }
}

export class BrowserKeyValueStore implements KeyValueStore {
  private readonly storage: Pick<Storage, 'getItem' | 'setItem'> | null

  public constructor(storage: Pick<Storage, 'getItem' | 'setItem'> | null) {
    this.storage = storage
  }

  public async getItem(key: string): Promise<string | null> {
    return this.storage?.getItem(key) ?? null
  }

  public async setItem(key: string, value: string): Promise<void> {
    if (this.storage === null) {
      throw new StorageUnavailableError()
    }

    this.storage.setItem(key, value)
  }
}

function getBrowserStorage(): Storage | null {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function createPlatformKeyValueStore(): KeyValueStore {
  return new BrowserKeyValueStore(getBrowserStorage())
}

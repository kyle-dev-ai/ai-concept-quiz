import type { AppProfile } from '../../app/config/runtime-config'
import type { KeyValueStore } from '../../application/ports/key-value-store'

export class BrowserKeyValueStore implements KeyValueStore {
  private readonly storage: Pick<Storage, 'getItem' | 'setItem'> | null

  public constructor(storage: Pick<Storage, 'getItem' | 'setItem'> | null) {
    this.storage = storage
  }

  public async getItem(key: string): Promise<string | null> {
    return this.storage?.getItem(key) ?? null
  }

  public async setItem(key: string, value: string): Promise<void> {
    this.storage?.setItem(key, value)
  }
}

export class TossKeyValueStore implements KeyValueStore {
  public async getItem(key: string): Promise<string | null> {
    const { Storage: tossStorage } = await import('@apps-in-toss/web-framework')
    return tossStorage.getItem(key)
  }

  public async setItem(key: string, value: string): Promise<void> {
    const { Storage: tossStorage } = await import('@apps-in-toss/web-framework')
    await tossStorage.setItem(key, value)
  }
}

function getBrowserStorage(): Storage | null {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function createKeyValueStore(profile: AppProfile): KeyValueStore {
  return profile === 'prd' ? new TossKeyValueStore() : new BrowserKeyValueStore(getBrowserStorage())
}

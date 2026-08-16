import type { KeyValueStore } from '../../application/ports/key-value-store'

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

export function createPlatformKeyValueStore(): KeyValueStore {
  return new TossKeyValueStore()
}

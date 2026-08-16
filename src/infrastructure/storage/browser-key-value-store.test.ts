import { describe, expect, it, vi } from 'vitest'
import { BrowserKeyValueStore, StorageUnavailableError } from './browser-key-value-store'

describe('BrowserKeyValueStore', () => {
  it('browser storage가 없을 때 write를 성공으로 숨기지 않는다', async () => {
    const storage = new BrowserKeyValueStore(null)

    await expect(storage.setItem('profile', '{}')).rejects.toBeInstanceOf(StorageUnavailableError)
  })

  it('browser storage contract에 read와 write를 위임한다', async () => {
    const setItem = vi.fn()
    const storage = new BrowserKeyValueStore({ getItem: () => 'saved', setItem })

    await expect(storage.getItem('profile')).resolves.toBe('saved')
    await storage.setItem('profile', '{}')

    expect(setItem).toHaveBeenCalledWith('profile', '{}')
  })
})

import { ref, watch, isRef, onServerPrefetch, type Ref } from 'vue'
import { usePhotoService } from '../plugin'
import type { Album } from '../types/album'

export function useAlbum(albumId: number | string | Ref<number | string>) {
  const client = usePhotoService()

  const album = ref<Album | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function fetch(id?: number | string) {
    const resolvedId = id ?? (isRef(albumId) ? albumId.value : albumId)
    if (resolvedId === undefined || resolvedId === null) return

    loading.value = true
    error.value = null
    try {
      const response = await client.getAlbum(resolvedId)
      album.value = response.data
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e))
    } finally {
      loading.value = false
    }
  }

  if (isRef(albumId)) {
    watch(albumId, () => fetch())
  }

  onServerPrefetch(() => fetch())

  return { album, loading, error, fetch }
}

import { ref, watch, isRef, onServerPrefetch, type Ref } from 'vue'
import { usePhotoService } from '../plugin'
import type { PhotoWithVariants } from '../types/photo'

export function usePhoto(photoId: string | Ref<string>) {
  const client = usePhotoService()

  const photo = ref<PhotoWithVariants | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function fetch(id?: string) {
    const resolvedId = id ?? (isRef(photoId) ? photoId.value : photoId)
    if (!resolvedId) return

    loading.value = true
    error.value = null
    try {
      photo.value = await client.getPhoto(resolvedId)
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e))
    } finally {
      loading.value = false
    }
  }

  if (isRef(photoId)) {
    watch(photoId, () => fetch())
  }

  onServerPrefetch(() => fetch())

  return { photo, loading, error, fetch }
}

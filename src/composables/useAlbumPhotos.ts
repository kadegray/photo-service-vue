import { ref, watch, isRef, type Ref } from 'vue'
import { usePhotoService } from '../plugin'
import type { Photo } from '../types/photo'
import type { PaginationParams, PaginationMeta } from '../types/pagination'

export function useAlbumPhotos(
  albumId: number | Ref<number>,
  params?: PaginationParams | Ref<PaginationParams>,
) {
  const client = usePhotoService()

  const photos = ref<Photo[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const pagination = ref<PaginationMeta | null>(null)

  async function fetch(overrides?: PaginationParams) {
    const resolvedId = isRef(albumId) ? albumId.value : albumId
    loading.value = true
    error.value = null
    try {
      const p = {
        ...(params && 'value' in params ? params.value : params),
        ...overrides,
      }
      const response = await client.getAlbumPhotos(resolvedId, p)
      photos.value = response.data
      pagination.value = response.meta
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e))
    } finally {
      loading.value = false
    }
  }

  async function nextPage() {
    if (pagination.value && pagination.value.current_page < pagination.value.last_page) {
      await fetch({ page: pagination.value.current_page + 1 })
    }
  }

  async function prevPage() {
    if (pagination.value && pagination.value.current_page > 1) {
      await fetch({ page: pagination.value.current_page - 1 })
    }
  }

  if (isRef(albumId)) {
    watch(albumId, () => fetch())
  }

  return { photos, loading, error, pagination, fetch, nextPage, prevPage }
}

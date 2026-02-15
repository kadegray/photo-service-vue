import { ref, watch, type Ref } from 'vue'
import { usePhotoService } from '../plugin'
import type { Photo, PhotoFilters } from '../types/photo'
import type { PaginationMeta } from '../types/pagination'

export function usePhotos(filters?: PhotoFilters | Ref<PhotoFilters>) {
  const client = usePhotoService()

  const photos = ref<Photo[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const pagination = ref<PaginationMeta | null>(null)

  async function fetch(overrides?: PhotoFilters) {
    loading.value = true
    error.value = null
    try {
      const params = {
        ...(filters && 'value' in filters ? filters.value : filters),
        ...overrides,
      }
      const response = await client.getPhotos(params)
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

  if (filters && 'value' in filters) {
    watch(filters, () => fetch(), { deep: true })
  }

  return { photos, loading, error, pagination, fetch, nextPage, prevPage }
}

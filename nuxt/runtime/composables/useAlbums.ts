import { useAsyncData } from '#imports'
import { computed, isRef, toValue, type MaybeRef } from 'vue'
import { usePhotoService } from 'photo-service-vue'
import type { AlbumFilters } from 'photo-service-vue'

export function useAlbums(filters?: AlbumFilters | MaybeRef<AlbumFilters>) {
  const client = usePhotoService()
  const resolvedFilters = () => toValue(filters) ?? {}

  const { data: response, pending, error, refresh } = useAsyncData(
    `ps:albums:${JSON.stringify(resolvedFilters())}`,
    () => client.getAlbums(resolvedFilters()),
    { watch: isRef(filters) ? [filters] : undefined },
  )

  const albums = computed(() => response.value?.data ?? [])
  const pagination = computed(() => response.value?.meta ?? null)

  async function nextPage() {
    if (pagination.value && pagination.value.current_page < pagination.value.last_page) {
      response.value = await client.getAlbums({
        ...resolvedFilters(),
        page: pagination.value.current_page + 1,
      })
    }
  }

  async function prevPage() {
    if (pagination.value && pagination.value.current_page > 1) {
      response.value = await client.getAlbums({
        ...resolvedFilters(),
        page: pagination.value.current_page - 1,
      })
    }
  }

  return {
    albums,
    loading: pending,
    error,
    pagination,
    fetch: refresh,
    nextPage,
    prevPage,
  }
}

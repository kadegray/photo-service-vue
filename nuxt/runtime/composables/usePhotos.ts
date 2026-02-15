import { useAsyncData } from '#imports'
import { computed, isRef, toValue, type MaybeRef } from 'vue'
import { usePhotoService } from 'photo-service-vue'
import type { PhotoFilters } from 'photo-service-vue'

export function usePhotos(filters?: PhotoFilters | MaybeRef<PhotoFilters>) {
  const client = usePhotoService()
  const resolvedFilters = () => toValue(filters) ?? {}

  const { data: response, pending, error, refresh } = useAsyncData(
    `ps:photos:${JSON.stringify(resolvedFilters())}`,
    () => client.getPhotos(resolvedFilters()),
    { watch: isRef(filters) ? [filters] : undefined },
  )

  const photos = computed(() => response.value?.data ?? [])
  const pagination = computed(() => response.value?.meta ?? null)

  async function nextPage() {
    if (pagination.value && pagination.value.current_page < pagination.value.last_page) {
      response.value = await client.getPhotos({
        ...resolvedFilters(),
        page: pagination.value.current_page + 1,
      })
    }
  }

  async function prevPage() {
    if (pagination.value && pagination.value.current_page > 1) {
      response.value = await client.getPhotos({
        ...resolvedFilters(),
        page: pagination.value.current_page - 1,
      })
    }
  }

  return {
    photos,
    loading: pending,
    error,
    pagination,
    fetch: refresh,
    nextPage,
    prevPage,
  }
}

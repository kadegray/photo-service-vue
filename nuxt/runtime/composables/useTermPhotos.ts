import { useAsyncData } from '#imports'
import { computed, isRef, toValue, type MaybeRef } from 'vue'
import { usePhotoService } from 'photo-service-vue'
import type { PaginationParams } from 'photo-service-vue'

export function useTermPhotos(
  termId: number | string | MaybeRef<number | string>,
  params?: PaginationParams | MaybeRef<PaginationParams>,
) {
  const client = usePhotoService()
  const resolvedId = () => toValue(termId)
  const resolvedParams = () => toValue(params) ?? {}

  const watchSources = [
    ...(isRef(termId) ? [termId] : []),
    ...(isRef(params) ? [params] : []),
  ]

  const { data: response, pending, error, refresh } = useAsyncData(
    `ps:term-photos:${resolvedId()}:${JSON.stringify(resolvedParams())}`,
    () => client.getTermPhotos(resolvedId(), resolvedParams()),
    { watch: watchSources.length ? watchSources : undefined },
  )

  const photos = computed(() => response.value?.data ?? [])
  const pagination = computed(() => response.value?.meta ?? null)

  async function nextPage() {
    if (pagination.value && pagination.value.current_page < pagination.value.last_page) {
      response.value = await client.getTermPhotos(resolvedId(), {
        ...resolvedParams(),
        page: pagination.value.current_page + 1,
      })
    }
  }

  async function prevPage() {
    if (pagination.value && pagination.value.current_page > 1) {
      response.value = await client.getTermPhotos(resolvedId(), {
        ...resolvedParams(),
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

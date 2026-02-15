import { useAsyncData } from '#imports'
import { computed, isRef, toValue, type MaybeRef } from 'vue'
import { usePhotoService } from 'photo-service-vue'

export function useTaxonomy(taxonomyId: number | string | MaybeRef<number | string>) {
  const client = usePhotoService()
  const resolvedId = () => toValue(taxonomyId)

  const { data: response, pending, error, refresh } = useAsyncData(
    `ps:taxonomy:${resolvedId()}`,
    () => client.getTaxonomy(resolvedId()),
    { watch: isRef(taxonomyId) ? [taxonomyId] : undefined },
  )

  const taxonomy = computed(() => response.value?.data ?? null)

  return {
    taxonomy,
    loading: pending,
    error,
    fetch: refresh,
  }
}

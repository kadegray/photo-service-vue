import { useAsyncData } from '#imports'
import { computed, isRef, toValue, type MaybeRef } from 'vue'
import { usePhotoService } from 'photo-service-vue'

export function useTerm(termId: number | string | MaybeRef<number | string>) {
  const client = usePhotoService()
  const resolvedId = () => toValue(termId)

  const { data: response, pending, error, refresh } = useAsyncData(
    `ps:term:${resolvedId()}`,
    () => client.getTerm(resolvedId()),
    { watch: isRef(termId) ? [termId] : undefined },
  )

  const term = computed(() => response.value?.data ?? null)

  return {
    term,
    loading: pending,
    error,
    fetch: refresh,
  }
}

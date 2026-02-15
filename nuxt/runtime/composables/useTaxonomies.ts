import { useAsyncData } from '#imports'
import { computed, isRef, toValue, type MaybeRef } from 'vue'
import { usePhotoService } from 'photo-service-vue'
import type { TaxonomyFilters } from 'photo-service-vue'

export function useTaxonomies(filters?: TaxonomyFilters | MaybeRef<TaxonomyFilters>) {
  const client = usePhotoService()
  const resolvedFilters = () => toValue(filters) ?? {}

  const { data: response, pending, error, refresh } = useAsyncData(
    `ps:taxonomies:${JSON.stringify(resolvedFilters())}`,
    () => client.getTaxonomies(resolvedFilters()),
    { watch: isRef(filters) ? [filters] : undefined },
  )

  const taxonomies = computed(() => response.value?.data ?? [])
  const pagination = computed(() => response.value?.meta ?? null)

  async function nextPage() {
    if (pagination.value && pagination.value.current_page < pagination.value.last_page) {
      response.value = await client.getTaxonomies({
        ...resolvedFilters(),
        page: pagination.value.current_page + 1,
      })
    }
  }

  async function prevPage() {
    if (pagination.value && pagination.value.current_page > 1) {
      response.value = await client.getTaxonomies({
        ...resolvedFilters(),
        page: pagination.value.current_page - 1,
      })
    }
  }

  return {
    taxonomies,
    loading: pending,
    error,
    pagination,
    fetch: refresh,
    nextPage,
    prevPage,
  }
}

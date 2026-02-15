import { useAsyncData } from '#imports'
import { computed, isRef, toValue, type MaybeRef } from 'vue'
import { usePhotoService } from 'photo-service-vue'
import type { PaginationParams } from 'photo-service-vue'

export interface TaxonomyTermsParams extends PaginationParams {
  name?: string
  slug?: string
}

export function useTaxonomyTerms(
  taxonomyId: number | MaybeRef<number>,
  params?: TaxonomyTermsParams | MaybeRef<TaxonomyTermsParams>,
) {
  const client = usePhotoService()
  const resolvedId = () => toValue(taxonomyId)
  const resolvedParams = () => toValue(params) ?? {}

  const watchSources = [
    ...(isRef(taxonomyId) ? [taxonomyId] : []),
    ...(isRef(params) ? [params] : []),
  ]

  const { data: response, pending, error, refresh } = useAsyncData(
    `ps:taxonomy-terms:${resolvedId()}:${JSON.stringify(resolvedParams())}`,
    () => client.getTaxonomyTerms(resolvedId(), resolvedParams()),
    { watch: watchSources.length ? watchSources : undefined },
  )

  const terms = computed(() => response.value?.data ?? [])
  const pagination = computed(() => response.value?.meta ?? null)

  async function nextPage() {
    if (pagination.value && pagination.value.current_page < pagination.value.last_page) {
      response.value = await client.getTaxonomyTerms(resolvedId(), {
        ...resolvedParams(),
        page: pagination.value.current_page + 1,
      })
    }
  }

  async function prevPage() {
    if (pagination.value && pagination.value.current_page > 1) {
      response.value = await client.getTaxonomyTerms(resolvedId(), {
        ...resolvedParams(),
        page: pagination.value.current_page - 1,
      })
    }
  }

  return {
    terms,
    loading: pending,
    error,
    pagination,
    fetch: refresh,
    nextPage,
    prevPage,
  }
}

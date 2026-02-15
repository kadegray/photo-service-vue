import { ref, watch, isRef, type Ref } from 'vue'
import { usePhotoService } from '../plugin'
import type { Term } from '../types/term'
import type { PaginationParams, PaginationMeta } from '../types/pagination'

export interface TaxonomyTermsParams extends PaginationParams {
  name?: string
  slug?: string
}

export function useTaxonomyTerms(
  taxonomyId: number | Ref<number>,
  params?: TaxonomyTermsParams | Ref<TaxonomyTermsParams>,
) {
  const client = usePhotoService()

  const terms = ref<Term[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const pagination = ref<PaginationMeta | null>(null)

  async function fetch(overrides?: TaxonomyTermsParams) {
    const resolvedId = isRef(taxonomyId) ? taxonomyId.value : taxonomyId
    loading.value = true
    error.value = null
    try {
      const p = {
        ...(params && 'value' in params ? params.value : params),
        ...overrides,
      }
      const response = await client.getTaxonomyTerms(resolvedId, p)
      terms.value = response.data
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

  if (isRef(taxonomyId)) {
    watch(taxonomyId, () => fetch())
  }

  return { terms, loading, error, pagination, fetch, nextPage, prevPage }
}

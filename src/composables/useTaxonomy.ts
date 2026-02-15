import { ref, watch, isRef, onServerPrefetch, type Ref } from 'vue'
import { usePhotoService } from '../plugin'
import type { Taxonomy } from '../types/taxonomy'

export function useTaxonomy(taxonomyId: number | string | Ref<number | string>) {
  const client = usePhotoService()

  const taxonomy = ref<Taxonomy | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function fetch(id?: number | string) {
    const resolvedId = id ?? (isRef(taxonomyId) ? taxonomyId.value : taxonomyId)
    if (resolvedId === undefined || resolvedId === null) return

    loading.value = true
    error.value = null
    try {
      const response = await client.getTaxonomy(resolvedId)
      taxonomy.value = response.data
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e))
    } finally {
      loading.value = false
    }
  }

  if (isRef(taxonomyId)) {
    watch(taxonomyId, () => fetch())
  }

  onServerPrefetch(() => fetch())

  return { taxonomy, loading, error, fetch }
}

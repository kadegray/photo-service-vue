import { ref, watch, isRef, type Ref } from 'vue'
import { usePhotoService } from '../plugin'
import type { Term } from '../types/term'

export function useTerm(termId: number | string | Ref<number | string>) {
  const client = usePhotoService()

  const term = ref<Term | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  async function fetch(id?: number | string) {
    const resolvedId = id ?? (isRef(termId) ? termId.value : termId)
    if (resolvedId === undefined || resolvedId === null) return

    loading.value = true
    error.value = null
    try {
      const response = await client.getTerm(resolvedId)
      term.value = response.data
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e))
    } finally {
      loading.value = false
    }
  }

  if (isRef(termId)) {
    watch(termId, () => fetch())
  }

  return { term, loading, error, fetch }
}

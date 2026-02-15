import { useAsyncData } from '#imports'
import { computed, isRef, toValue, type MaybeRef } from 'vue'
import { usePhotoService } from 'photo-service-vue'

export function useAlbum(albumId: number | string | MaybeRef<number | string>) {
  const client = usePhotoService()
  const resolvedId = () => toValue(albumId)

  const { data: response, pending, error, refresh } = useAsyncData(
    `ps:album:${resolvedId()}`,
    () => client.getAlbum(resolvedId()),
    { watch: isRef(albumId) ? [albumId] : undefined },
  )

  const album = computed(() => response.value?.data ?? null)

  return {
    album,
    loading: pending,
    error,
    fetch: refresh,
  }
}

import { useAsyncData } from '#imports'
import { isRef, toValue, type MaybeRef } from 'vue'
import { usePhotoService } from 'photo-service-vue'

export function usePhoto(photoId: string | MaybeRef<string>) {
  const client = usePhotoService()
  const resolvedId = () => toValue(photoId)

  const { data: photo, pending, error, refresh } = useAsyncData(
    `ps:photo:${resolvedId()}`,
    () => client.getPhoto(resolvedId()),
    { watch: isRef(photoId) ? [photoId] : undefined },
  )

  return {
    photo,
    loading: pending,
    error,
    fetch: refresh,
  }
}

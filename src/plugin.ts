import type { App, InjectionKey } from 'vue'
import { inject } from 'vue'
import { createApiClient, type ApiClient } from './client'

export interface PhotoServiceOptions {
  baseUrl: string
  tenantId: string | number
}

export const PHOTO_SERVICE_KEY: InjectionKey<ApiClient> = Symbol('PhotoService')

export const PhotoServicePlugin = {
  install(app: App, options: PhotoServiceOptions) {
    const client = createApiClient(options.baseUrl, options.tenantId)
    app.provide(PHOTO_SERVICE_KEY, client)
  },
}

export function usePhotoService(): ApiClient {
  const client = inject(PHOTO_SERVICE_KEY)
  if (!client) {
    throw new Error(
      'PhotoService not installed. Call app.use(PhotoServicePlugin, { baseUrl, tenantId }) before using composables.',
    )
  }
  return client
}

import { defineNuxtPlugin, useRuntimeConfig } from '#imports'
import { PhotoServicePlugin } from 'photo-service-vue'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig().public.photoService as {
    baseUrl: string
    tenantId: string | number
  }

  if (!config.baseUrl) {
    console.warn(
      '[photo-service-vue] Missing baseUrl. Configure it via nuxt.config.ts photoService.baseUrl or NUXT_PUBLIC_PHOTO_SERVICE_BASE_URL env var.',
    )
  }

  nuxtApp.vueApp.use(PhotoServicePlugin, {
    baseUrl: config.baseUrl,
    tenantId: config.tenantId,
  })
})

<script setup lang="ts">
import { onMounted } from 'vue'
import { usePhoto } from '../composables/usePhoto'

const props = defineProps<{
  photoId: string
}>()

const { photo, loading, error, fetch } = usePhoto(props.photoId)

onMounted(() => {
  if (!photo.value) fetch()
})

defineExpose({ photo, loading, error, fetch })
</script>

<template>
  <div class="ps-w-full">
    <slot v-if="loading" name="loading">
      <div class="ps-flex ps-items-center ps-justify-center ps-py-12">
        <div class="ps-animate-spin ps-h-8 ps-w-8 ps-border-4 ps-border-gray-300 ps-border-t-blue-600 ps-rounded-full" />
      </div>
    </slot>

    <slot v-else-if="error" name="error" :error="error">
      <div class="ps-p-4 ps-bg-red-50 ps-border ps-border-red-200 ps-rounded-lg ps-text-red-700">
        {{ error.message }}
      </div>
    </slot>

    <template v-else-if="photo">
      <slot :photo="photo">
        <div class="ps-space-y-4">
          <div class="ps-overflow-hidden ps-rounded-lg">
            <img
              :src="photo.original.url"
              :alt="photo.original.filename"
              :width="photo.original.width"
              :height="photo.original.height"
              class="ps-w-full ps-h-auto"
            />
          </div>

          <div v-if="photo.original.exif" class="ps-text-sm ps-text-gray-600 ps-space-y-1">
            <p v-if="photo.original.exif.camera_make || photo.original.exif.camera_model">
              {{ [photo.original.exif.camera_make, photo.original.exif.camera_model].filter(Boolean).join(' ') }}
            </p>
            <p v-if="photo.original.exif.lens">{{ photo.original.exif.lens }}</p>
            <p>
              <span v-if="photo.original.exif.focal_length">{{ photo.original.exif.focal_length }}</span>
              <span v-if="photo.original.exif.aperture"> &middot; {{ photo.original.exif.aperture }}</span>
              <span v-if="photo.original.exif.shutter_speed"> &middot; {{ photo.original.exif.shutter_speed }}</span>
              <span v-if="photo.original.exif.iso"> &middot; ISO {{ photo.original.exif.iso }}</span>
            </p>
          </div>

          <div v-if="photo.variants.length > 0">
            <h3 class="ps-text-sm ps-font-medium ps-text-gray-700 ps-mb-2">Variants</h3>
            <div class="ps-grid ps-grid-cols-4 ps-gap-2">
              <div
                v-for="variant in photo.variants"
                :key="variant.id"
                class="ps-overflow-hidden ps-rounded ps-bg-gray-100"
              >
                <slot name="variant" :variant="variant">
                  <img
                    :src="variant.url"
                    :alt="variant.filename"
                    class="ps-w-full ps-h-auto ps-object-cover"
                    loading="lazy"
                  />
                  <div class="ps-px-2 ps-py-1 ps-text-xs ps-text-gray-500">
                    {{ variant.width }}&times;{{ variant.height }}
                  </div>
                </slot>
              </div>
            </div>
          </div>
        </div>
      </slot>
    </template>
  </div>
</template>

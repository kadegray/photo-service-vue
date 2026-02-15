<script setup lang="ts">
import { onMounted } from 'vue'
import { useAlbum } from '../composables/useAlbum'

const props = defineProps<{
  albumId: number | string
}>()

const { album, loading, error, fetch } = useAlbum(props.albumId)

onMounted(() => {
  if (!album.value) fetch()
})

defineExpose({ album, loading, error, fetch })
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

    <template v-else-if="album">
      <slot :album="album">
        <div class="ps-space-y-4">
          <div class="ps-flex ps-items-center ps-gap-3">
            <div
              v-if="album.color"
              class="ps-w-4 ps-h-4 ps-rounded-full ps-flex-shrink-0"
              :style="{ backgroundColor: album.color }"
            />
            <h2 class="ps-text-xl ps-font-semibold ps-text-gray-900">{{ album.name }}</h2>
          </div>
          <p v-if="album.description" class="ps-text-gray-600">{{ album.description }}</p>
          <div class="ps-text-sm ps-text-gray-500">
            {{ album.photo_count }} photos
          </div>

          <div v-if="album.thumbnail_photos.length > 0" class="ps-grid ps-grid-cols-4 ps-gap-2">
            <img
              v-for="thumb in album.thumbnail_photos"
              :key="thumb.id"
              :src="thumb.url"
              :alt="album.name"
              class="ps-w-full ps-h-auto ps-rounded ps-object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </slot>
    </template>
  </div>
</template>

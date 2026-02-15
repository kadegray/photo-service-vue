<script setup lang="ts">
import { onMounted } from 'vue'
import { useTermPhotos } from '../composables/useTermPhotos'
import type { PaginationParams } from '../types/pagination'

const props = withDefaults(defineProps<{
  termId: number | string
  params?: PaginationParams
  columns?: number
}>(), {
  columns: 3,
})

const { photos, loading, error, pagination, fetch, nextPage, prevPage } = useTermPhotos(props.termId, props.params)

onMounted(() => {
  if (!photos.value.length) fetch()
})

defineExpose({ photos, loading, error, pagination, fetch, nextPage, prevPage })
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

    <template v-else>
      <slot :photos="photos" :pagination="pagination">
        <div
          class="ps-grid ps-gap-4"
          :style="{ gridTemplateColumns: `repeat(${props.columns}, minmax(0, 1fr))` }"
        >
          <div
            v-for="photo in photos"
            :key="photo.id"
            class="ps-overflow-hidden ps-rounded-lg ps-bg-gray-100"
          >
            <slot name="photo" :photo="photo">
              <img
                :src="photo.url"
                :alt="photo.filename"
                :width="photo.width"
                :height="photo.height"
                class="ps-w-full ps-h-auto ps-object-cover"
                loading="lazy"
              />
            </slot>
          </div>
        </div>
      </slot>

      <slot name="pagination" :pagination="pagination" :next-page="nextPage" :prev-page="prevPage">
        <div v-if="pagination && pagination.last_page > 1" class="ps-flex ps-items-center ps-justify-center ps-gap-4 ps-mt-6">
          <button
            :disabled="pagination.current_page <= 1"
            class="ps-px-4 ps-py-2 ps-rounded ps-bg-gray-200 ps-text-gray-700 hover:ps-bg-gray-300 disabled:ps-opacity-50 disabled:ps-cursor-not-allowed"
            @click="prevPage"
          >
            Previous
          </button>
          <span class="ps-text-sm ps-text-gray-600">
            Page {{ pagination.current_page }} of {{ pagination.last_page }}
          </span>
          <button
            :disabled="pagination.current_page >= pagination.last_page"
            class="ps-px-4 ps-py-2 ps-rounded ps-bg-gray-200 ps-text-gray-700 hover:ps-bg-gray-300 disabled:ps-opacity-50 disabled:ps-cursor-not-allowed"
            @click="nextPage"
          >
            Next
          </button>
        </div>
      </slot>
    </template>
  </div>
</template>

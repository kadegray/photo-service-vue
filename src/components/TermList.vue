<script setup lang="ts">
import { onMounted } from 'vue'
import { useTerms } from '../composables/useTerms'
import type { TermFilters } from '../types/term'

const props = defineProps<{
  filters?: TermFilters
}>()

const { terms, loading, error, pagination, fetch, nextPage, prevPage } = useTerms(props.filters)

onMounted(() => fetch())

defineExpose({ terms, loading, error, pagination, fetch, nextPage, prevPage })
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
      <slot :terms="terms" :pagination="pagination">
        <div class="ps-space-y-2">
          <div
            v-for="term in terms"
            :key="term.id"
            class="ps-flex ps-items-center ps-justify-between ps-p-3 ps-border ps-border-gray-200 ps-rounded-lg"
          >
            <slot name="term" :term="term">
              <div>
                <span class="ps-font-medium ps-text-gray-900">{{ term.name }}</span>
                <span v-if="term.taxonomy" class="ps-text-xs ps-text-gray-400 ps-ml-2">{{ term.taxonomy.name }}</span>
                <p v-if="term.description" class="ps-text-sm ps-text-gray-500 ps-mt-0.5">{{ term.description }}</p>
              </div>
              <span class="ps-text-sm ps-text-gray-400">{{ term.photo_count }} photos</span>
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

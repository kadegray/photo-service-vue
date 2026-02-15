<script setup lang="ts">
import { onMounted } from 'vue'
import { useTaxonomies } from '../composables/useTaxonomies'
import type { TaxonomyFilters } from '../types/taxonomy'

const props = defineProps<{
  filters?: TaxonomyFilters
}>()

const { taxonomies, loading, error, pagination, fetch, nextPage, prevPage } = useTaxonomies(props.filters)

onMounted(() => {
  if (!taxonomies.value.length) fetch()
})

defineExpose({ taxonomies, loading, error, pagination, fetch, nextPage, prevPage })
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
      <slot :taxonomies="taxonomies" :pagination="pagination">
        <div class="ps-space-y-3">
          <div
            v-for="taxonomy in taxonomies"
            :key="taxonomy.id"
            class="ps-p-4 ps-border ps-border-gray-200 ps-rounded-lg"
          >
            <slot name="taxonomy" :taxonomy="taxonomy">
              <h3 class="ps-font-medium ps-text-gray-900">{{ taxonomy.name }}</h3>
              <p v-if="taxonomy.description" class="ps-text-sm ps-text-gray-500 ps-mt-1">{{ taxonomy.description }}</p>
              <p class="ps-text-xs ps-text-gray-400 ps-mt-2">{{ taxonomy.term_count }} terms</p>
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

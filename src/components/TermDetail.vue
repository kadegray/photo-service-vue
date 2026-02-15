<script setup lang="ts">
import { onMounted } from 'vue'
import { useTerm } from '../composables/useTerm'

const props = defineProps<{
  termId: number | string
}>()

const { term, loading, error, fetch } = useTerm(props.termId)

onMounted(() => {
  if (!term.value) fetch()
})

defineExpose({ term, loading, error, fetch })
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

    <template v-else-if="term">
      <slot :term="term">
        <div class="ps-space-y-3">
          <h2 class="ps-text-xl ps-font-semibold ps-text-gray-900">{{ term.name }}</h2>
          <p v-if="term.description" class="ps-text-gray-600">{{ term.description }}</p>
          <div class="ps-flex ps-items-center ps-gap-4 ps-text-sm ps-text-gray-500">
            <span v-if="term.taxonomy">Taxonomy: {{ term.taxonomy.name }}</span>
            <span>{{ term.photo_count }} photos</span>
          </div>
        </div>
      </slot>
    </template>
  </div>
</template>

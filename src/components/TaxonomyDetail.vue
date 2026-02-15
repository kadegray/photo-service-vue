<script setup lang="ts">
import { onMounted } from 'vue'
import { useTaxonomy } from '../composables/useTaxonomy'

const props = defineProps<{
  taxonomyId: number | string
}>()

const { taxonomy, loading, error, fetch } = useTaxonomy(props.taxonomyId)

onMounted(() => fetch())

defineExpose({ taxonomy, loading, error, fetch })
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

    <template v-else-if="taxonomy">
      <slot :taxonomy="taxonomy">
        <div class="ps-space-y-4">
          <h2 class="ps-text-xl ps-font-semibold ps-text-gray-900">{{ taxonomy.name }}</h2>
          <p v-if="taxonomy.description" class="ps-text-gray-600">{{ taxonomy.description }}</p>
          <p class="ps-text-sm ps-text-gray-500">{{ taxonomy.term_count }} terms</p>

          <div v-if="taxonomy.terms && taxonomy.terms.length > 0" class="ps-space-y-2">
            <h3 class="ps-text-sm ps-font-medium ps-text-gray-700">Terms</h3>
            <div class="ps-flex ps-flex-wrap ps-gap-2">
              <span
                v-for="term in taxonomy.terms"
                :key="term.id"
                class="ps-inline-flex ps-items-center ps-gap-1 ps-px-3 ps-py-1 ps-bg-gray-100 ps-rounded-full ps-text-sm ps-text-gray-700"
              >
                {{ term.name }}
                <span class="ps-text-xs ps-text-gray-400">({{ term.photo_count }})</span>
              </span>
            </div>
          </div>
        </div>
      </slot>
    </template>
  </div>
</template>

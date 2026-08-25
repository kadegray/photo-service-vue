<script setup lang="ts">
import { computed } from 'vue'
import { buildSourceSets } from '../utils/buildSourceSets'
import type { PhotoListItem } from '../types/photo'

const props = withDefaults(defineProps<{
  photo: PhotoListItem
  alt?: string
  imgClass?: string
  imgAttrs?: Record<string, string>
  loading?: 'lazy' | 'eager'
  sizes?: string
}>(), {
  loading: 'lazy',
})

const pictureData = computed(() => buildSourceSets(props.photo))
</script>

<template>
  <picture>
    <source
      v-for="source in pictureData.sources"
      :key="source.type"
      :type="source.type"
      :srcset="source.srcset"
      :sizes="sizes"
    />
    <img
      v-bind="imgAttrs"
      :src="pictureData.fallback.src"
      :srcset="pictureData.fallback.srcset"
      :sizes="sizes"
      :width="pictureData.fallback.width"
      :height="pictureData.fallback.height"
      :alt="alt ?? pictureData.fallback.alt"
      :class="imgClass"
      :loading="loading"
    />
  </picture>
</template>

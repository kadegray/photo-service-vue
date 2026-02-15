# photo-service-vue

A Vue 3 component and composable library for integrating with the [Photo Service](https://example.com) API. Provides ready-to-use components for displaying photos, albums, taxonomies, and terms — with full TypeScript support and slot-based customisation.

## Installation

```bash
npm install photo-service-vue
```

### Peer Dependencies

- Vue 3.4+

## Setup

### Vue (SPA)

Register the plugin in your Vue app. Components fetch data client-side on mount.

```typescript
import { createApp } from 'vue'
import { PhotoServicePlugin } from 'photo-service-vue'
import 'photo-service-vue/style.css'

const app = createApp(App)

app.use(PhotoServicePlugin, {
  baseUrl: 'https://photoservice.ibexel.com',
  tenantId: 1,
})

app.mount('#app')
```

The `style.css` import is required for the default component styles. All CSS classes are prefixed with `ps-` to avoid conflicts with your application styles.

### Nuxt

Add the built-in Nuxt module. This works with all Nuxt rendering modes — SPA, SSR, and SSG.

The module automatically:
- Registers the plugin on both server and client
- Auto-imports all composables and components
- Includes the component styles

#### SPA

Client-side only — no server rendering. Composables fetch data in the browser on mount, the same as plain Vue.

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: false,
  modules: ['photo-service-vue/nuxt'],
  photoService: {
    baseUrl: 'https://photoservice.ibexel.com',
    tenantId: 1,
  },
})
```

#### SSR

Server-side rendering on every request. The server fetches data, renders HTML, and serializes the result into the payload so the client hydrates without re-fetching.

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['photo-service-vue/nuxt'],
  photoService: {
    baseUrl: 'https://photoservice.ibexel.com',
    tenantId: 1,
  },
})
```

`ssr: true` is the Nuxt default, so it can be omitted.

#### SSG (Static Site Generation)

Pre-renders every page at build time using `nuxt generate`. Pages are served as static HTML with no runtime server required.

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['photo-service-vue/nuxt'],
  photoService: {
    baseUrl: 'https://photoservice.ibexel.com',
    tenantId: 1,
  },
  nitro: {
    prerender: {
      crawlLinks: true,
    },
  },
})
```

Then generate the static site:

```bash
npx nuxt generate
```

`crawlLinks: true` tells Nuxt to discover and pre-render all pages linked from your routes. You can also pre-render specific routes with `nitro.prerender.routes`:

```typescript
nitro: {
  prerender: {
    routes: ['/photos', '/albums'],
  },
}
```

In both SSR and SSG modes, composables use `useAsyncData` under the hood, so data fetched on the server is serialized into the HTML payload and available on the client without re-fetching.

```vue
<!-- pages/photos.vue -->
<script setup>
const { photos, loading, pagination, nextPage, prevPage } = usePhotos({
  highlighted: true,
  per_page: 20,
})
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else>
    <img v-for="photo in photos" :key="photo.id" :src="photo.url" :alt="photo.filename" />
  </div>
</template>
```

The configuration also supports environment variable overrides: `NUXT_PUBLIC_PHOTO_SERVICE_BASE_URL` and `NUXT_PUBLIC_PHOTO_SERVICE_TENANT_ID`.

## Components

All components provide `loading`, `error`, and `default` slots for full control over rendering.

### Photos

#### `PhotoGallery`

Displays a paginated grid of photos.

```vue
<template>
  <PhotoGallery :filters="{ album_slug: 'nature' }" :columns="3" />
</template>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `filters` | `PhotoFilters` | `undefined` | Filter and pagination options |
| `columns` | `number` | `3` | Number of grid columns |

**Slots:** `loading`, `error`, `default`, `photo`, `pagination`

#### `PhotoDetail`

Displays a single photo with its variants and EXIF data.

```vue
<template>
  <PhotoDetail photo-id="abc-123" />
</template>
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `photoId` | `string` | Yes | The photo ID to display |

**Slots:** `loading`, `error`, `default`, `variant`

### Albums

#### `AlbumList`

Displays a paginated grid of albums.

```vue
<template>
  <AlbumList :filters="{ has_photos: true }" :columns="3" />
</template>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `filters` | `AlbumFilters` | `undefined` | Filter and pagination options |
| `columns` | `number` | `3` | Number of grid columns |

**Slots:** `loading`, `error`, `default`, `album`, `pagination`

#### `AlbumDetail`

Displays a single album with its thumbnail photos.

```vue
<template>
  <AlbumDetail :album-id="1" />
</template>
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `albumId` | `number \| string` | Yes | The album ID to display |

**Slots:** `loading`, `error`, `default`

#### `AlbumPhotos`

Displays a paginated grid of photos within an album.

```vue
<template>
  <AlbumPhotos :album-id="1" :columns="4" />
</template>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `albumId` | `number` | Required | The album ID |
| `params` | `PaginationParams` | `undefined` | Pagination options |
| `columns` | `number` | `3` | Number of grid columns |

**Slots:** `loading`, `error`, `default`, `photo`, `pagination`

### Taxonomies

#### `TaxonomyList`

Displays a paginated list of taxonomies.

```vue
<template>
  <TaxonomyList :filters="{ has_terms: true }" />
</template>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `filters` | `TaxonomyFilters` | `undefined` | Filter and pagination options |

**Slots:** `loading`, `error`, `default`, `taxonomy`, `pagination`

#### `TaxonomyDetail`

Displays a single taxonomy with its terms.

```vue
<template>
  <TaxonomyDetail :taxonomy-id="1" />
</template>
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `taxonomyId` | `number \| string` | Yes | The taxonomy ID to display |

**Slots:** `loading`, `error`, `default`

#### `TaxonomyTerms`

Displays a paginated list of terms within a taxonomy.

```vue
<template>
  <TaxonomyTerms :taxonomy-id="1" :params="{ name: 'landscape' }" />
</template>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `taxonomyId` | `number` | Required | The taxonomy ID |
| `params` | `PaginationParams & { name?, slug? }` | `undefined` | Pagination and filter options |

**Slots:** `loading`, `error`, `default`, `term`, `pagination`

### Terms

#### `TermList`

Displays a paginated list of terms across all taxonomies.

```vue
<template>
  <TermList :filters="{ has_photos: true }" />
</template>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `filters` | `TermFilters` | `undefined` | Filter and pagination options |

**Slots:** `loading`, `error`, `default`, `term`, `pagination`

#### `TermDetail`

Displays a single term.

```vue
<template>
  <TermDetail :term-id="1" />
</template>
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `termId` | `number \| string` | Yes | The term ID to display |

**Slots:** `loading`, `error`, `default`

#### `TermPhotos`

Displays a paginated grid of photos tagged with a term.

```vue
<template>
  <TermPhotos :term-id="1" :columns="3" />
</template>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `termId` | `number \| string` | Required | The term ID |
| `params` | `PaginationParams` | `undefined` | Pagination options |
| `columns` | `number` | `3` | Number of grid columns |

**Slots:** `loading`, `error`, `default`, `photo`, `pagination`

## Slot Customisation

All components support named slots for customising rendering. Slot props provide access to the component's data and state.

```vue
<template>
  <PhotoGallery :filters="{ highlighted: true }">
    <template #loading>
      <p>Loading photos...</p>
    </template>

    <template #error="{ error }">
      <p>Something went wrong: {{ error.message }}</p>
    </template>

    <template #photo="{ photo }">
      <img :src="photo.url" :alt="photo.filename" />
    </template>

    <template #pagination="{ pagination, nextPage, prevPage }">
      <button @click="prevPage" :disabled="!pagination?.from">Previous</button>
      <span>Page {{ pagination?.current_page }} of {{ pagination?.last_page }}</span>
      <button @click="nextPage" :disabled="pagination?.current_page === pagination?.last_page">Next</button>
    </template>
  </PhotoGallery>
</template>
```

## Composables

For programmatic access, each component has a corresponding composable:

| Composable | Description |
|------------|-------------|
| `usePhotos(filters?)` | Fetch paginated photos |
| `usePhoto(photoId)` | Fetch a single photo with variants |
| `useAlbums(filters?)` | Fetch paginated albums |
| `useAlbum(albumId)` | Fetch a single album |
| `useAlbumPhotos(albumId, params?)` | Fetch photos in an album |
| `useTaxonomies(filters?)` | Fetch paginated taxonomies |
| `useTaxonomy(taxonomyId)` | Fetch a single taxonomy |
| `useTaxonomyTerms(taxonomyId, params?)` | Fetch terms in a taxonomy |
| `useTerms(filters?)` | Fetch paginated terms |
| `useTerm(termId)` | Fetch a single term |
| `useTermPhotos(termId, params?)` | Fetch photos tagged with a term |

All composables return reactive state:

```typescript
const { data, loading, error, pagination, fetch, nextPage, prevPage } = usePhotos({
  album_slug: 'nature',
  per_page: 12,
})
```

Composables accept both static values and Vue refs. When a ref is passed, data is automatically refetched when the value changes:

```typescript
const albumId = ref(1)
const { data: photos } = useAlbumPhotos(albumId)

// Changing albumId automatically fetches the new album's photos
albumId.value = 2
```

## API Client

For direct API access without Vue reactivity:

```typescript
import { createApiClient } from 'photo-service-vue'

const client = createApiClient('https://photoservice.ibexel.com', 1)

const { data, meta } = await client.getPhotos({ per_page: 10 })
const photo = await client.getPhoto('abc-123')
```

## Error Handling

API errors throw an `ApiError` with the HTTP status code and any validation errors:

```typescript
import { ApiError } from 'photo-service-vue'

try {
  const photo = await client.getPhoto('invalid-id')
} catch (err) {
  if (err instanceof ApiError) {
    console.log(err.status)  // HTTP status code
    console.log(err.errors)  // Validation errors (if any)
  }
}
```

## License

[MIT](LICENSE)

// Plugin
export { PhotoServicePlugin, usePhotoService, PHOTO_SERVICE_KEY } from './plugin'
export type { PhotoServiceOptions } from './plugin'

// API Client
export { createApiClient, ApiError } from './client'
export type { ApiClient } from './client'

// Components
export {
  PhotoGallery,
  PhotoDetail,
  AlbumList,
  AlbumDetail,
  AlbumPhotos,
  TaxonomyList,
  TaxonomyDetail,
  TaxonomyTerms,
  TermList,
  TermDetail,
  TermPhotos,
} from './components'

// Composables
export {
  usePhotos,
  usePhoto,
  useAlbums,
  useAlbum,
  useAlbumPhotos,
  useTaxonomies,
  useTaxonomy,
  useTaxonomyTerms,
  useTerms,
  useTerm,
  useTermPhotos,
} from './composables'

// Types
export type {
  PaginationLinks,
  PaginationMeta,
  PaginatedResponse,
  PaginationParams,
  PhotoExif,
  Photo,
  PhotoWithVariants,
  PhotoFilters,
  AlbumThumbnailPhoto,
  Album,
  AlbumFilters,
  Taxonomy,
  TaxonomyFilters,
  TermTaxonomy,
  Term,
  TermFilters,
} from './types'

// Styles
import './style.css'

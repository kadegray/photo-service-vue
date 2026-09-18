import type { PaginationParams } from './pagination'

export interface PhotoExif {
  camera_make: string | null
  camera_model: string | null
  lens: string | null
  iso: number | null
  aperture: string | null
  shutter_speed: string | null
  focal_length: string | null
  /** Truncated to month precision, e.g. "2025-11" (not a full ISO datetime). */
  taken_at: string | null
}

export interface PhotoTermTaxonomy {
  id: number
  name: string
  slug: string
}

export interface PhotoTerm {
  id: number
  taxonomy_id: number
  taxonomy: PhotoTermTaxonomy | null
  name: string
  slug: string
  description: string | null
  sort_order: number
}

export interface Photo {
  id: string
  photo_id: string
  filename: string
  url: string
  width: number
  height: number
  file_size: number
  mime_type: string
  pixel_count: number
  aspect_ratio: number
  exif: PhotoExif | null
  // Only present when requested via `include_terms`.
  terms?: PhotoTerm[]
  created_at: string
  updated_at: string
}

export interface PhotoWithVariants {
  original: Photo
  variants: Photo[]
}

// List endpoints (e.g. /photos, /albums/{id}/photos) return a flat Photo per
// item; only the single-photo show endpoint returns the PhotoWithVariants wrapper.
export type PhotoListItem = PhotoWithVariants | Photo

export interface PhotoFilters extends PaginationParams {
  photo_id?: string
  highlighted?: boolean | 0 | 1

  // Camera & EXIF
  camera_make?: string
  camera_model?: string
  lens?: string
  iso_min?: number
  iso_max?: number
  aperture_min?: number
  aperture_max?: number
  focal_length_min?: number
  focal_length_max?: number
  exif_search?: string

  // Date
  taken_from?: string
  taken_to?: string

  // Dimensions
  width_min?: number
  width_max?: number
  height_min?: number
  height_max?: number

  // Album
  album_id?: number
  album_ids?: number[]
  album_slug?: string
  album_slugs?: string[]

  // Term
  term_id?: number
  term_ids?: number[]
  term_slug?: string
  term_slugs?: string[]

  // Taxonomy
  taxonomy_id?: number
  taxonomy_ids?: number[]
  taxonomy_slug?: string
  taxonomy_slugs?: string[]

  // Negative filters & term eager-loading
  no_album?: boolean | 0 | 1
  no_terms?: boolean | 0 | 1
  /** Taxonomy id; mutually exclusive with no_taxonomy_terms_slug. */
  no_taxonomy_terms?: number
  /** Taxonomy slug; mutually exclusive with no_taxonomy_terms. */
  no_taxonomy_terms_slug?: string
  include_terms?: boolean | 0 | 1
}

import type { PaginationParams } from './pagination'

export interface PhotoExif {
  camera_make: string | null
  camera_model: string | null
  lens: string | null
  iso: number | null
  aperture: string | null
  shutter_speed: string | null
  focal_length: string | null
  taken_at: string | null
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
  is_original: boolean
  pixel_count: number
  aspect_ratio: number
  exif: PhotoExif | null
  created_at: string
  updated_at: string
}

export interface PhotoWithVariants {
  original: Photo
  variants: Photo[]
}

export interface PhotoFilters extends PaginationParams {
  photo_id?: string
  highlighted?: boolean | 0 | 1
  is_original?: boolean | 0 | 1

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
}

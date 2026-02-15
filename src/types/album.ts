import type { PaginationParams } from './pagination'

export interface AlbumThumbnailPhoto {
  id: string
  photo_id: string
  url: string
  width: number
  height: number
}

export interface Album {
  id: number
  tenant_id: number
  name: string
  description: string | null
  slug: string
  color: string | null
  sort_order: number
  sort_type: string | null
  sort_field: string | null
  sort_direction: string
  photo_count: number
  thumbnail_photos: AlbumThumbnailPhoto[]
  created_at: string
  updated_at: string
}

export interface AlbumFilters extends PaginationParams {
  name?: string
  slug?: string
  color?: string
  has_photos?: boolean | 0 | 1
  photo_count_min?: number
  photo_count_max?: number
}

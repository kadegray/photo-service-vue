import type { PaginationParams } from './pagination'

export interface TermTaxonomy {
  id: number
  name: string
  slug: string
}

export interface Term {
  id: number
  taxonomy_id: number
  taxonomy?: TermTaxonomy
  tenant_id: number
  name: string
  slug: string
  description: string | null
  sort_order: number
  photo_count: number
  created_at: string
  updated_at: string
}

export interface TermFilters extends PaginationParams {
  taxonomy_id?: number
  taxonomy_ids?: number[]
  taxonomy_slug?: string
  taxonomy_slugs?: string[]
  name?: string
  slug?: string
  has_photos?: boolean | 0 | 1
  photo_count_min?: number
  photo_count_max?: number
}

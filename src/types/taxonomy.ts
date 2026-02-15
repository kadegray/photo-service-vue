import type { PaginationParams } from './pagination'
import type { Term } from './term'

export interface Taxonomy {
  id: number
  tenant_id: number
  name: string
  slug: string
  description: string | null
  sort_order: number
  term_count: number
  terms?: Term[]
  created_at: string
  updated_at: string
}

export interface TaxonomyFilters extends PaginationParams {
  name?: string
  slug?: string
  has_terms?: boolean | 0 | 1
  term_count_min?: number
  term_count_max?: number
}

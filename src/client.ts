import type { PaginatedResponse } from './types/pagination'
import type { Photo, PhotoWithVariants, PhotoFilters } from './types/photo'
import type { Album, AlbumFilters } from './types/album'
import type { Taxonomy, TaxonomyFilters } from './types/taxonomy'
import type { Term, TermFilters } from './types/term'
import type { PaginationParams } from './types/pagination'

function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue

    if (Array.isArray(value)) {
      for (const item of value) {
        searchParams.append(`${key}[]`, String(item))
      }
    } else if (typeof value === 'boolean') {
      searchParams.append(key, value ? '1' : '0')
    } else {
      searchParams.append(key, String(value))
    }
  }

  const qs = searchParams.toString()
  return qs ? `?${qs}` : ''
}

export interface ApiClient {
  getPhotos(filters?: PhotoFilters): Promise<PaginatedResponse<Photo>>
  getPhoto(photoId: string): Promise<PhotoWithVariants>
  getAlbums(filters?: AlbumFilters): Promise<PaginatedResponse<Album>>
  getAlbum(id: number | string): Promise<{ data: Album }>
  getAlbumPhotos(albumId: number, params?: PaginationParams): Promise<PaginatedResponse<Photo>>
  getTaxonomies(filters?: TaxonomyFilters): Promise<PaginatedResponse<Taxonomy>>
  getTaxonomy(id: number | string): Promise<{ data: Taxonomy }>
  getTaxonomyTerms(taxonomyId: number, params?: PaginationParams & { name?: string; slug?: string }): Promise<PaginatedResponse<Term>>
  getTerms(filters?: TermFilters): Promise<PaginatedResponse<Term>>
  getTerm(id: number | string): Promise<{ data: Term }>
  getTermPhotos(termId: number | string, params?: PaginationParams): Promise<PaginatedResponse<Photo>>
}

export function createApiClient(baseUrl: string, tenantId: string | number): ApiClient {
  const base = `${baseUrl.replace(/\/$/, '')}/api/tenants/${tenantId}`

  async function request<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    const url = `${base}${path}${params ? buildQueryString(params) : ''}`
    const response = await fetch(url)

    if (!response.ok) {
      const body = await response.json().catch(() => null)
      const message = body?.message || `Request failed with status ${response.status}`
      throw new ApiError(message, response.status, body?.errors)
    }

    return response.json()
  }

  return {
    getPhotos(filters?: PhotoFilters) {
      return request<PaginatedResponse<Photo>>('/photos', filters as Record<string, unknown>)
    },

    getPhoto(photoId: string) {
      return request<PhotoWithVariants>(`/photos/${encodeURIComponent(photoId)}`)
    },

    getAlbums(filters?: AlbumFilters) {
      return request<PaginatedResponse<Album>>('/albums', filters as Record<string, unknown>)
    },

    getAlbum(id: number | string) {
      return request<{ data: Album }>(`/albums/${encodeURIComponent(String(id))}`)
    },

    getAlbumPhotos(albumId: number, params?: PaginationParams) {
      return request<PaginatedResponse<Photo>>(`/albums/${albumId}/photos`, params as Record<string, unknown>)
    },

    getTaxonomies(filters?: TaxonomyFilters) {
      return request<PaginatedResponse<Taxonomy>>('/taxonomies', filters as Record<string, unknown>)
    },

    getTaxonomy(id: number | string) {
      return request<{ data: Taxonomy }>(`/taxonomies/${encodeURIComponent(String(id))}`)
    },

    getTaxonomyTerms(taxonomyId: number, params?: PaginationParams & { name?: string; slug?: string }) {
      return request<PaginatedResponse<Term>>(`/taxonomies/${taxonomyId}/terms`, params as Record<string, unknown>)
    },

    getTerms(filters?: TermFilters) {
      return request<PaginatedResponse<Term>>('/terms', filters as Record<string, unknown>)
    },

    getTerm(id: number | string) {
      return request<{ data: Term }>(`/terms/${encodeURIComponent(String(id))}`)
    },

    getTermPhotos(termId: number | string, params?: PaginationParams) {
      return request<PaginatedResponse<Photo>>(`/terms/${encodeURIComponent(String(termId))}/photos`, params as Record<string, unknown>)
    },
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Record<string, string[]>,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

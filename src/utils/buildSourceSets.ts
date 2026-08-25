import type { PhotoListItem } from '../types/photo'
import { hasVariants } from './photoListItem'

export interface SourceSet {
  type: string
  srcset: string
}

export interface PictureData {
  sources: SourceSet[]
  fallback: {
    src: string
    srcset: string
    width: number
    height: number
    alt: string
  }
}

const FORMAT_PRIORITY: Record<string, number> = {
  'image/avif': 0,
  'image/webp': 1,
  'image/png': 2,
  'image/jpeg': 3,
  'image/jpg': 3,
}

function formatPriority(mimeType: string): number {
  return FORMAT_PRIORITY[mimeType] ?? 2
}

export function buildSourceSets(photo: PhotoListItem): PictureData {
  const original = hasVariants(photo) ? photo.original : photo
  const variants = hasVariants(photo) ? photo.variants : []
  const allPhotos = [original, ...variants]

  const groups = new Map<string, { url: string; width: number }[]>()
  for (const p of allPhotos) {
    const entries = groups.get(p.mime_type) ?? []
    entries.push({ url: p.url, width: p.width })
    groups.set(p.mime_type, entries)
  }

  for (const entries of groups.values()) {
    entries.sort((a, b) => a.width - b.width)
  }

  const fallbackMimeType = original.mime_type
  const fallbackEntries = groups.get(fallbackMimeType) ?? [
    { url: original.url, width: original.width },
  ]

  const fallbackSrcset = fallbackEntries.map((e) => `${e.url} ${e.width}w`).join(', ')

  const sources: SourceSet[] = []
  for (const [mimeType, entries] of groups) {
    if (mimeType === fallbackMimeType) continue
    sources.push({
      type: mimeType,
      srcset: entries.map((e) => `${e.url} ${e.width}w`).join(', '),
    })
  }

  sources.sort((a, b) => formatPriority(a.type) - formatPriority(b.type))

  return {
    sources,
    fallback: {
      src: original.url,
      srcset: fallbackSrcset,
      width: original.width,
      height: original.height,
      alt: original.filename,
    },
  }
}

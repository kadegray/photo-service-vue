import type { Photo, PhotoListItem, PhotoWithVariants } from '../types/photo'

export function hasVariants(photo: PhotoListItem): photo is PhotoWithVariants {
  return 'original' in photo
}

export function getOriginalPhoto(photo: PhotoListItem): Photo {
  return hasVariants(photo) ? photo.original : photo
}

export function getPhotoId(photo: PhotoListItem): string {
  return getOriginalPhoto(photo).id
}

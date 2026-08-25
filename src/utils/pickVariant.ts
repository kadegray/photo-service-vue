import type { Photo, PhotoWithVariants } from '../types/photo'

/**
 * Pick the smallest variant whose width is >= targetWidth, falling back to
 * the largest available variant if none qualify. Used e.g. to upgrade a
 * small grid thumbnail to a sharper image once it's opened in a lightbox.
 */
export function pickLargestSuitableVariant(photo: PhotoWithVariants, targetWidth: number): Photo {
  const candidates = photo.variants.length ? photo.variants : [photo.original]

  const atLeastTarget = candidates
    .filter((variant) => variant.width >= targetWidth)
    .sort((a, b) => a.width - b.width)
  if (atLeastTarget.length) return atLeastTarget[0]

  return [...candidates].sort((a, b) => b.width - a.width)[0]
}

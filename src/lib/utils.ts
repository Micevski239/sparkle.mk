import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

const priceFormatter = new Intl.NumberFormat('mk-MK', {
  style: 'currency',
  currency: 'MKD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatPrice(price: number): string {
  return priceFormatter.format(price);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Only JPEG, PNG, WebP, and GIF images are allowed';
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return 'File size must be under 5MB';
  }
  return null;
}

/**
 * Compresses and resizes an image before upload.
 * Converts to WebP at 80% quality and caps dimensions.
 */
export async function compressImage(
  file: File,
  maxWidth = 1200,
  quality = 0.8
): Promise<File> {
  // Skip GIFs (animated) and already-small files (< 100KB)
  if (file.type === 'image/gif' || file.size < 100 * 1024) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;

      // Only downscale, never upscale
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file); // fallback to original
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) {
            // If compression made it bigger, use original
            resolve(file);
            return;
          }
          const compressed = new File([blob], file.name.replace(/\.\w+$/, '.webp'), {
            type: 'image/webp',
          });
          resolve(compressed);
        },
        'image/webp',
        quality
      );
    };
    img.onerror = () => reject(new Error('Failed to load image for compression'));
    img.src = URL.createObjectURL(file);
  });
}

/** Supabase Storage upload options with 1-year browser + CDN cache. */
export const STORAGE_CACHE_OPTIONS = { cacheControl: '31536000' };

/**
 * Derives the thumbnail URL from a full-size Supabase Storage URL.
 * Convention: inserts `thumb/` before the filename.
 * e.g. `.../products/abc.webp` → `.../products/thumb/abc.webp`
 */
export function getThumbnailUrl(url: string | null): string | null {
  if (!url) return null;
  const lastSlash = url.lastIndexOf('/');
  if (lastSlash === -1) return url;
  return url.slice(0, lastSlash) + '/thumb' + url.slice(lastSlash);
}

export function isValidUrl(url: string): boolean {
  if (url.startsWith('/')) return true;
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

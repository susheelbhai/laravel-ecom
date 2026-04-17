import type { SyntheticEvent } from 'react';

/**
 * When `/images/no-image.svg` is missing (404), naive `onError` handlers that
 * always set `src` back to that URL cause an infinite reload loop. Use this
 * handler instead: after one redirect to the public placeholder, fall back to an
 * inline data-URI SVG (always loadable).
 */
const INLINE_SVG_PLACEHOLDER =
    'data:image/svg+xml,' +
    encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="#0b0f1a"/></svg>',
    );

export const PRODUCT_FALLBACK_IMAGE_URL = '/images/no-image.svg';

function urlLooksLikeNoImagePlaceholder(url: string): boolean {
    return url.includes('no-image.svg');
}

export function handleProductImageError(
    e: SyntheticEvent<HTMLImageElement, Event>,
    fallbackUrl: string = PRODUCT_FALLBACK_IMAGE_URL,
): void {
    const img = e.currentTarget;
    const resolved = img.currentSrc || img.src || '';

    if (
        urlLooksLikeNoImagePlaceholder(resolved) ||
        img.dataset.ecomImgFallback === 'final'
    ) {
        img.onerror = null;
        img.dataset.ecomImgFallback = 'final';
        img.src = INLINE_SVG_PLACEHOLDER;
        return;
    }

    // Already retargeted once (e.g. to a custom fallback URL); never loop again.
    if (img.dataset.ecomImgFallback === '1') {
        img.onerror = null;
        img.dataset.ecomImgFallback = 'final';
        img.src = INLINE_SVG_PLACEHOLDER;
        return;
    }

    img.dataset.ecomImgFallback = '1';
    img.src = fallbackUrl;
}

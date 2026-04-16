# Image Zoom Examples

## Quick Reference

### 1. External Zoom (Amazon/Flipkart Style) - RECOMMENDED
```tsx
<ImageSlider
    images={displayImages}
    productTitle={product.title}
    productId={product.id}
    zoomType="external"
    zoomScale={2.5}
/>
```

**Layout:**
```
┌─────────────┬──────────────┬──────────────┐
│ Thumbnails  │ Main Image   │ Zoom Panel   │
│             │ (Original)   │ (Magnified)  │
│   [img1]    │              │              │
│   [img2]    │   [Image]    │   [Zoomed]   │
│   [img3]    │              │              │
└─────────────┴──────────────┴──────────────┘
```

**Features:**
- Original image stays visible on the left
- Zoomed view appears in separate panel on the right
- Lens indicator shows which area is being zoomed
- Perfect for desktop users
- Automatically hidden on mobile/tablet

---

### 2. Inline Zoom (Simple)
```tsx
<ImageSlider
    images={displayImages}
    productTitle={product.title}
    productId={product.id}
    zoomType="inline"
    zoomScale={2.5}
/>
```

**Layout:**
```
┌─────────────┬──────────────┐
│ Thumbnails  │ Main Image   │
│             │ (Zooms Here) │
│   [img1]    │              │
│   [img2]    │   [Image]    │
│   [img3]    │              │
└─────────────┴──────────────┘
```

**Features:**
- Image zooms within the same container
- Simpler, more compact layout
- Works well on all screen sizes
- Good for mobile-first designs

---

### 3. No Zoom (Disabled)
```tsx
<ImageSlider
    images={displayImages}
    productTitle={product.title}
    productId={product.id}
    zoomType="none"
/>
```

**Layout:**
```
┌─────────────┬──────────────┐
│ Thumbnails  │ Main Image   │
│             │ (Static)     │
│   [img1]    │              │
│   [img2]    │   [Image]    │
│   [img3]    │              │
└─────────────┴──────────────┘
```

**Features:**
- No zoom functionality
- Fastest performance
- Best for simple products or low-detail images

---

## Customization Options

### Zoom Scale
Control how much magnification to apply:

```tsx
zoomScale={1.5}  // Subtle zoom
zoomScale={2.5}  // Default - balanced
zoomScale={3.5}  // High detail zoom
zoomScale={5.0}  // Maximum detail
```

### Responsive Behavior

**External Zoom:**
- Desktop (lg+): Shows zoom panel
- Mobile/Tablet: Automatically hides zoom panel, shows only main image

**Inline Zoom:**
- Works on all screen sizes
- Zoom activates on hover (desktop) or tap (mobile)

---

## When to Use Each Type

| Zoom Type | Best For | Use Case |
|-----------|----------|----------|
| `external` | E-commerce products | Jewelry, electronics, clothing with details |
| `inline` | Simple products | Books, basic items, mobile-first sites |
| `none` | Performance-critical | Low-detail products, slow connections |

---

## Implementation Notes

1. **External zoom** requires more horizontal space - ensure your layout can accommodate it
2. **Inline zoom** is more compact but may feel cramped on smaller images
3. Both zoom types are disabled during image dragging/sliding
4. Zoom state resets when switching between images
5. All zoom components are fully accessible and keyboard-friendly

# Product Image Zoom Feature

## Overview
The image zoom feature provides hover zoom effects on product images with three different zoom modes.

## Components

### ImageZoom (Internal Zoom)
Zooms the image within the same container - the image scales up in place when hovering.

**Props:**
- `src` (string, required): Image URL
- `alt` (string, required): Alt text for accessibility
- `className` (string, optional): Additional CSS classes
- `zoomScale` (number, optional, default: 2.5): Zoom magnification level
- `enabled` (boolean, optional, default: true): Enable/disable zoom feature

### ImageZoomExternal (External Zoom)
Shows the original image with a lens indicator. Works with ExternalZoomOverlay component to display zoomed view.

**Props:**
- `src` (string, required): Image URL
- `alt` (string, required): Alt text for accessibility
- `className` (string, optional): Additional CSS classes
- `zoomScale` (number, optional, default: 2.5): Zoom magnification level
- `enabled` (boolean, optional, default: true): Enable/disable zoom feature
- `onZoomChange` (function, optional): Callback when zoom state changes `(isActive, position) => void`

### ExternalZoomOverlay
Displays the zoomed image as an overlay on top of other content (typically product details).

**Props:**
- `src` (string, required): Image URL to zoom
- `position` ({ x: number, y: number }, required): Zoom position (0-100%)
- `zoomScale` (number, required): Zoom magnification level
- `isVisible` (boolean, required): Whether to show the overlay

### ImageSlider
The main product image carousel with integrated zoom support.

**Props:**
- `images` (ProductImage[], required): Array of product images
- `productTitle` (string, required): Product title for alt text
- `productId` (number, required): Product ID for wishlist
- `zoomType` ('none' | 'internal' | 'external', optional, default: 'internal'): Zoom mode
- `zoomScale` (number, optional, default: 2.5): Zoom magnification level
- `onExternalZoom` (function, optional): Callback for external zoom `(isActive, position, imageUrl) => void`

## Usage

### Internal Zoom (Default)
Zooms image in the same container:
```tsx
<ImageSlider
    images={displayImages}
    productTitle={product.title}
    productId={product.id}
    zoomType="internal"
    zoomScale={2.5}
/>
```

### External Zoom (Amazon/Flipkart Style)
Shows original image on left, zoomed image overlays on the right sidebar:
```tsx
const [externalZoom, setExternalZoom] = useState({
    isActive: false,
    position: { x: 50, y: 50 },
    imageUrl: '',
});

// In your layout:
<div className="grid grid-cols-2 gap-8">
    {/* Left: Image Slider */}
    <div>
        <ImageSlider
            images={displayImages}
            productTitle={product.title}
            productId={product.id}
            zoomType="external"
            zoomScale={2.5}
            onExternalZoom={(isActive, position, imageUrl) => {
                setExternalZoom({ isActive, position, imageUrl });
            }}
        />
    </div>

    {/* Right: Product Details with Zoom Overlay */}
    <aside className="relative">
        <ExternalZoomOverlay
            src={externalZoom.imageUrl}
            position={externalZoom.position}
            zoomScale={2.5}
            isVisible={externalZoom.isActive}
        />
        {/* Your product details here */}
    </aside>
</div>
```

### No Zoom
Disables zoom feature completely:
```tsx
<ImageSlider
    images={displayImages}
    productTitle={product.title}
    productId={product.id}
    zoomType="none"
/>
```

### Custom Zoom Level
```tsx
<ImageSlider
    images={displayImages}
    productTitle={product.title}
    productId={product.id}
    zoomType="external"
    zoomScale={3.0} // Higher = more zoom
/>
```

## Zoom Types Comparison

| Type | Description | Best For |
|------|-------------|----------|
| `internal` | Zooms within same container | Default, mobile-friendly, compact UI |
| `external` | Original image + zoom overlay on right sidebar | Desktop users, detailed product inspection, e-commerce |
| `none` | No zoom effect | Performance, simple products |

## Layout Examples

### Internal Zoom Layout
```
┌─────────────┬──────────────┐
│ Thumbnails  │ Main Image   │
│             │ (Zooms Here) │
│   [img1]    │              │
│   [img2]    │   [Image]    │
│   [img3]    │              │
└─────────────┴──────────────┘
```

### External Zoom Layout
```
┌─────────────┬──────────────┐   ┌──────────────────────┐
│ Thumbnails  │ Main Image   │   │ Product Details      │
│             │ (Original)   │   │ (Zoom Overlays Here) │
│   [img1]    │              │   │                      │
│   [img2]    │   [Image]    │   │ ┌──────────────────┐ │
│   [img3]    │   + Lens     │   │ │  Zoomed Image    │ │
│             │              │   │ │  (When Hovering) │ │
└─────────────┴──────────────┘   │ └──────────────────┘ │
                                  └──────────────────────┘
```

## How It Works

### Internal Zoom
1. Hover over the image to activate zoom
2. The image scales up within the same container
3. Mouse movement controls the visible zoomed area
4. Moving away deactivates the zoom

### External Zoom
1. Hover over the image to activate zoom
2. A lens indicator shows the area being zoomed
3. The zoomed view overlays on top of the product details section (right side)
4. Move mouse to explore different areas
5. Product details remain visible underneath (on mobile) or are covered by zoom (on desktop)
6. The zoom overlay is hidden on mobile/tablet (< lg breakpoint)

## Features

- Works seamlessly with drag/swipe navigation
- Zoom is disabled during image dragging
- Only the current image can be zoomed
- Responsive design (external zoom panel hidden on mobile)
- Smooth transitions and animations
- Accessible and keyboard-friendly

## Customization
- Adjust `zoomScale` prop to change magnification (1.5 - 4.0 recommended)
- Set `zoomType="none"` to completely disable the feature
- External zoom automatically hides on screens smaller than `lg` breakpoint
- All components gracefully handle edge cases

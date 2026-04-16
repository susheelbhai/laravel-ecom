interface ExternalZoomOverlayProps {
    src: string;
    position: { x: number; y: number };
    zoomScale: number;
    isVisible: boolean;
}

export default function ExternalZoomOverlay({
    src,
    position,
    zoomScale,
    isVisible,
}: ExternalZoomOverlayProps) {
    if (!isVisible) {
        return null;
    }

    return (
        <div className="pointer-events-none absolute left-0 right-0 top-0 bottom-0 z-50 hidden lg:block">
            <div
                className="h-full w-full overflow-hidden rounded-xl border-2 border-primary bg-white shadow-2xl"
                style={{
                    backgroundImage: `url(${src})`,
                    backgroundSize: `${zoomScale * 100}%`,
                    backgroundPosition: `${position.x}% ${position.y}%`,
                    backgroundRepeat: 'no-repeat',
                }}
            />
        </div>
    );
}

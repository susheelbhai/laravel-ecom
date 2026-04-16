interface Banner {
    id: number;
    imageUrl: string;
    href: string | null;
    target: '_self' | '_blank' | '_parent' | '_top';
    alt: string;
}

interface BannerSlideProps {
    banner: Banner;
    isActive: boolean;
}

export default function BannerSlide({ banner, isActive }: BannerSlideProps) {
    const imageElement = (
        <img
            src={banner.imageUrl}
            alt={banner.alt}
            className="h-full w-full object-cover"
            loading="lazy"
        />
    );

    // If href exists, render as clickable link
    if (banner.href) {
        return (
            <a
                href={banner.href}
                target={banner.target}
                rel={banner.target === '_blank' ? 'noopener noreferrer' : undefined}
                className={`absolute inset-0 transition-opacity duration-500 ${
                    isActive ? 'opacity-100' : 'opacity-0'
                }`}
            >
                {imageElement}
            </a>
        );
    }

    // If no href, render as non-interactive div
    return (
        <div
            className={`absolute inset-0 transition-opacity duration-500 ${
                isActive ? 'opacity-100' : 'opacity-0'
            }`}
        >
            {imageElement}
        </div>
    );
}

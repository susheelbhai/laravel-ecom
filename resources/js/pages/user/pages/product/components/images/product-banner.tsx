export default function ProductBanner() {
    return (
        <section className="relative mb-8 flex h-48 w-full items-center justify-center border-b border-border bg-background2 md:h-56">
            <div className="flex w-full flex-col items-center justify-center px-4">
                <h1 className="mb-2 text-3xl font-black text-foreground md:text-5xl">
                    Our Products
                </h1>
                <p className="max-w-2xl text-center text-base leading-relaxed font-medium text-muted-foreground md:text-lg">
                    Explore our diverse range of high-quality products designed
                    to meet your Hazardous & Safe Area Applications.
                </p>
            </div>
        </section>
    );
}

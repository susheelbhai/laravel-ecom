import { Container } from '@/components/ui/container';

export default function BrandsSection({ data }: { data: any }) {
    return (
        <section className="bg-muted/30 py-16 dark:bg-muted/10">
            <Container>
                <h2 className="mb-8 text-center text-3xl font-bold text-foreground">
                    Our Brands
                </h2>
                <div className="flex flex-wrap justify-center gap-6">
                    {data?.map((brand: any, index: number) => (
                        <div
                            key={index}
                            className="rounded-lg bg-card p-4 shadow-md ring-1 ring-border"
                        >
                            <img
                                src={brand.logo}
                                alt={brand.name}
                                className="h-12"
                            />
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}

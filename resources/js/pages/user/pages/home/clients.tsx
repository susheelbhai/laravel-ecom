import { Container } from '@/components/ui/container';
export default function ClientSection(data: any) {
    return (
        <section className="bg-background2 py-10 md:py-16">
            <Container className="text-center">
                <h3 className="mb-6 text-sm font-semibold text-muted-foreground uppercase">
                    Our Partners
                </h3>
                <div className="flex flex-wrap items-center justify-center gap-10">
                    {data.data.map((logo: any) => (
                        <a
                            href={logo.url}
                            target="_blank"
                            key={logo.id}
                            className="flex h-12 w-32 items-center justify-center transition md:h-16"
                        >
                            <img
                                src={logo.logo}
                                alt={logo.name}
                                className="object-contain transition hover:scale-110"
                            />
                        </a>
                    ))}
                </div>
            </Container>
        </section>
    );
}

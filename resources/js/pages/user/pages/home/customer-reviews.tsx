import { Container } from '@/components/ui/layout/container';

export default function CustomerReviewsSection({ data }: { data: any }) {
    return (
        <section className="py-16">
            <Container>
                <h2 className="mb-8 text-center text-3xl font-bold text-foreground">
                    Customer Reviews
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {data?.map((review: any, index: number) => (
                        <div
                            key={index}
                            className="rounded-div bg-card p-6 shadow-md ring-1 ring-border"
                        >
                            <p className="text-muted-foreground">"{review.comment}"</p>
                            <p className="mt-4 font-semibold text-foreground">
                                - {review.customer}
                            </p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}

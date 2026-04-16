import { usePage } from '@inertiajs/react';
import PreviewItem from '../components/PreviewItem';
import PreviewSection from '../components/PreviewSection';

export default function PreviewAwards({ data }: { data: any }) {
    const { judging_methods, event }: any = usePage().props;

    // ✅ 1. Detect awards from both data and event props
    const awards =
        Array.isArray(data?.awards) && data.awards.length > 0
            ? data.awards
            : Array.isArray(event?.awards) && event.awards.length > 0
              ? event.awards
              : [];

    // ✅ 2. Resolve judging method title
    const judgingMethod =
        judging_methods?.find(
            (m: any) =>
                parseInt(m.id) ===
                parseInt(data.judging_method_id ?? event?.judging_method_id),
        )?.title || '—';

    return (
        <PreviewSection
            title="Judging & Awards"
            description="Overview of the judging process, awards, and festival policies."
        >
            {/* === Judging Method === */}
            <PreviewItem label="Judging Method" value={judgingMethod} />

            {/* === Awards === */}
            {awards.length > 0 ? (
                <div className="mt-6">
                    <h3 className="text-md mb-3 font-semibold text-gray-700">
                        Awards & Prizes
                    </h3>
                    <div className="space-y-4">
                        {awards.map((award: any, i: number) => (
                            <div
                                key={i}
                                className="rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm"
                            >
                                <h4 className="mb-1 text-base font-semibold text-gray-800">
                                    {award.title || `Award ${i + 1}`}
                                </h4>
                                <p className="mb-1 text-sm text-gray-700">
                                    <span className="font-semibold">
                                        Prize:
                                    </span>{' '}
                                    {award.prize || '—'}
                                </p>
                                <p className="text-sm text-gray-700">
                                    {award.description || '—'}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="mt-4 text-sm text-gray-600">No awards defined.</p>
            )}

            {/* === Judging Process === */}
            <div className="mt-6">
                <PreviewItem
                    label="How Are Films Judged?"
                    value={data.judging_process || event?.judging_process}
                    isHtml
                />
            </div>

            {/* === Judges === */}
            <div className="mt-4">
                <PreviewItem
                    label="Panel of Judges"
                    value={data.judges || event?.judges}
                    isHtml
                />
            </div>

            {/* === Laurel Policy === */}
            <div className="mt-4">
                <PreviewItem
                    label="Laurel Usage Policy"
                    value={data.laurel_uses_policy || event?.laurel_uses_policy}
                    isHtml
                />
            </div>

            {/* === Deliverables === */}
            <div className="mt-4">
                <PreviewItem
                    label="Deliverables on Selection"
                    value={
                        data.deliverable_on_selection ||
                        event?.deliverable_on_selection
                    }
                    isHtml
                />
            </div>

            {/* === Rules === */}
            <div className="mt-4">
                <PreviewItem
                    label="Rules & Terms"
                    value={data.rules || event?.rules}
                    isHtml
                />
            </div>
        </PreviewSection>
    );
}

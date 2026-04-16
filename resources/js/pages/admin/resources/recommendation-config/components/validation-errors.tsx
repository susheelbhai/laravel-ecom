type ValidationErrorsProps = {
    errors: Record<string, string>;
};

export function ValidationErrors({ errors }: ValidationErrorsProps) {
    if (Object.keys(errors).length === 0) {
        return null;
    }

    return (
        <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4">
            <h3 className="mb-2 font-semibold text-red-800">
                Validation Errors:
            </h3>
            <ul className="list-disc pl-5 text-sm text-red-700">
                {Object.entries(errors).map(([key, value]) => (
                    <li key={key}>
                        {key}: {Array.isArray(value) ? value.join(', ') : value}
                    </li>
                ))}
            </ul>
        </div>
    );
}

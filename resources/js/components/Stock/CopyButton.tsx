import { useState } from 'react';
import { Check, ClipboardCopy } from 'lucide-react';

interface CopyButtonProps {
    text: string;
    className?: string;
}

export default function CopyButton({ text, className = '' }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    function handleCopy() {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        });
    }

    return (
        <button
            type="button"
            onClick={handleCopy}
            title="Copy to clipboard"
            className={`shrink-0 text-gray-400 hover:text-gray-700 focus:outline-none dark:hover:text-gray-200 ${className}`}
        >
            {copied
                ? <Check className="h-3.5 w-3.5 text-green-500" />
                : <ClipboardCopy className="h-3.5 w-3.5" />
            }
        </button>
    );
}

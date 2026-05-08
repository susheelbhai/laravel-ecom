import { GripVertical } from 'lucide-react';

type ConfigType = {
    id: number;
    section_type: string;
    is_enabled: boolean;
    display_order: number;
};

type ConfigItemProps = {
    config: ConfigType;
    index: number;
    sectionTitle: string;
    onToggle: (id: number) => void;
    onDragStart?: (index: number, e: React.MouseEvent) => void;
    isDragging?: boolean;
    dragOffset?: { x: number; y: number };
};

export function ConfigItem({
    config,
    index,
    sectionTitle,
    onToggle,
    onDragStart,
    isDragging = false,
    dragOffset,
}: ConfigItemProps) {
    const handleDragStart = (e: React.MouseEvent) => {
        onDragStart?.(index, e);
    };

    return (
        <div
            className={`flex items-center gap-4 rounded-div border border-border bg-background p-4 transition-shadow duration-200 ${
                isDragging
                    ? 'shadow-2xl ring-2 ring-secondary/50'
                    : 'hover:shadow-md'
            }`}
            style={
                isDragging && dragOffset
                    ? {
                          position: 'fixed',
                          left: dragOffset.x,
                          top: dragOffset.y,
                          zIndex: 1000,
                          pointerEvents: 'none',
                          width: 'calc(100% - 3rem)',
                          maxWidth: '800px',
                      }
                    : undefined
            }
        >
            {/* Drag Handle */}
            <button
                type="button"
                className={`cursor-grab text-muted-foreground transition-colors hover:text-foreground active:cursor-grabbing ${
                    isDragging ? 'cursor-grabbing text-secondary' : ''
                }`}
                onMouseDown={handleDragStart}
                style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
            >
                <GripVertical className="h-5 w-5" />
            </button>

            {/* Order Number */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-white">
                {config.display_order}
            </div>

            {/* Section Title */}
            <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                    {sectionTitle}
                </h3>
                <p className="text-xs text-muted-foreground">
                    {config.section_type}
                </p>
            </div>

            {/* Toggle Switch */}
            <label className="relative inline-flex cursor-pointer items-center">
                <input
                    type="checkbox"
                    checked={config.is_enabled}
                    onChange={() => onToggle(config.id)}
                    className="peer sr-only"
                    disabled={isDragging}
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-300 transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-secondary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-secondary/20 peer-disabled:opacity-50"></div>
                <span className="ml-3 text-sm font-medium text-foreground">
                    {config.is_enabled ? 'Enabled' : 'Disabled'}
                </span>
            </label>
        </div>
    );
}

import { useState, useRef, useEffect } from 'react';
import { ConfigItem } from './config-item';

type ConfigType = {
    id: number;
    section_type: string;
    is_enabled: boolean;
    display_order: number;
};

type ConfigListProps = {
    configs: ConfigType[];
    sectionTitles: Record<string, string>;
    onToggle: (id: number) => void;
    onReorder: (fromIndex: number, toIndex: number) => void;
};

export function ConfigList({
    configs,
    sectionTitles,
    onToggle,
    onReorder,
}: ConfigListProps) {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);
    const dragStartPosRef = useRef<{ x: number; y: number } | null>(null);
    const hoverIndexRef = useRef<number | null>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // Keep ref in sync with state
    useEffect(() => {
        hoverIndexRef.current = hoverIndex;
    }, [hoverIndex]);

    const handleDragStart = (index: number, e: React.MouseEvent) => {
        setDraggedIndex(index);
        setHoverIndex(index);
        
        const rect = e.currentTarget.getBoundingClientRect();
        
        dragStartPosRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };

        setDragOffset({
            x: rect.left,
            y: rect.top,
        });

        const handleMouseMove = (moveEvent: MouseEvent) => {
            // Update drag offset to follow mouse
            if (dragStartPosRef.current) {
                setDragOffset({
                    x: moveEvent.clientX - dragStartPosRef.current.x,
                    y: moveEvent.clientY - dragStartPosRef.current.y,
                });
            }

            // Calculate hover index based on actual item positions
            if (listRef.current) {
                const items = listRef.current.querySelectorAll('[data-config-item]');
                let newHoverIndex = index;
                
                for (let i = 0; i < items.length; i++) {
                    const itemRect = items[i].getBoundingClientRect();
                    const itemMiddle = itemRect.top + itemRect.height / 2;
                    
                    if (moveEvent.clientY < itemMiddle) {
                        newHoverIndex = i;
                        break;
                    }
                    newHoverIndex = i + 1;
                }
                
                newHoverIndex = Math.max(0, Math.min(configs.length - 1, newHoverIndex));
                
                if (newHoverIndex !== hoverIndexRef.current) {
                    setHoverIndex(newHoverIndex);
                }
            }
        };

        const handleMouseUp = () => {
            const finalHoverIndex = hoverIndexRef.current;
            
            if (finalHoverIndex !== null && finalHoverIndex !== index) {
                onReorder(index, finalHoverIndex);
            }
            
            setDraggedIndex(null);
            setDragOffset(null);
            setHoverIndex(null);
            hoverIndexRef.current = null;
            dragStartPosRef.current = null;
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div ref={listRef} className="relative space-y-4">
            {configs.map((config, index) => {
                const isDragging = draggedIndex === index;
                // Show placeholder when hovering over this position and not dragging from here
                const showPlaceholderBefore = hoverIndex !== null && 
                    draggedIndex !== null && 
                    hoverIndex === index && 
                    draggedIndex !== index;
                
                return (
                    <div key={config.id}>
                        {/* Show placeholder at hover position */}
                        {showPlaceholderBefore && (
                            <div className="mb-4 h-20 rounded-lg border-2 border-dashed border-secondary/30 bg-secondary/5 transition-all duration-200" />
                        )}
                        
                        {/* Actual item (keep visible but mark with data attribute) */}
                        <div 
                            data-config-item
                            className={`transition-opacity duration-200 ${isDragging ? 'hidden' : ''}`}
                        >
                            <ConfigItem
                                config={config}
                                index={index}
                                sectionTitle={
                                    sectionTitles[config.section_type] ||
                                    config.section_type
                                }
                                onToggle={onToggle}
                                onDragStart={handleDragStart}
                            />
                        </div>
                    </div>
                );
            })}
            
            {/* Floating dragged item */}
            {draggedIndex !== null && dragOffset && (
                <ConfigItem
                    config={configs[draggedIndex]}
                    index={draggedIndex}
                    sectionTitle={
                        sectionTitles[configs[draggedIndex].section_type] ||
                        configs[draggedIndex].section_type
                    }
                    onToggle={onToggle}
                    isDragging={true}
                    dragOffset={dragOffset}
                />
            )}
        </div>
    );
}

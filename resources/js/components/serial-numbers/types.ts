export interface Product {
    id: number;
    title: string;
    sku: string | null;
}

export interface Rack {
    id: number;
    identifier: string;
    warehouse: { id: number; name: string } | null;
}

export interface SerialNumberData {
    id: number;
    serial_number: string;
    status: 'available' | 'sold' | 'stolen' | 'damaged';
    current_location: string;
    product: Product | null;
    rack: Rack | null;
    can_mark_stolen: boolean;
    can_mark_damaged: boolean;
}

export interface Movement {
    id: number;
    event_type: string;
    from_party: string | null;
    to_party: string | null;
    occurred_at: string;
    actor_label?: string | null;
    notes?: string | null;
}

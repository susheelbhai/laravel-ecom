import type { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href?: string | null;
    icon?: LucideIcon | null;
    isActive?: boolean;
    children?: NavItem[];
    permission?: string | string[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth & { settings?: any };
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    admin?: {
        unread_notifications_count?: number;
        unread_notifications?: any[];
    };
    partner?: {
        unread_notifications_count?: number;
        unread_notifications?: any[];
    };
    seller?: {
        unread_notifications_count?: number;
        unread_notifications?: any[];
    };
    appData?: {
        email?: string;
        facebook?: string;
        twitter?: string;
        linkedin?: string;
        instagram?: string;
        youtube?: string;
        [key: string]: any;
    };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Warehouse {
    id: number;
    name: string;
    address: string;
    racks_count?: number;
    created_at: string;
    updated_at: string;
}

export interface Rack {
    id: number;
    warehouse_id: number;
    identifier: string;
    description: string | null;
    warehouse?: Warehouse;
    stock_records_count?: number;
    created_at: string;
    updated_at: string;
}

export interface StockRecord {
    id: number;
    product_id: number;
    rack_id: number;
    quantity: number;
    product?: any;
    rack?: Rack;
    warehouse?: Warehouse;
    created_at: string;
    updated_at: string;
}

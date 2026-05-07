import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';
import { type BreadcrumbItem, type SharedData } from '@/types';
import AppLayoutTemplate from '../../themes/admin_default/app/app-sidebar-layout';
import {
    filteredFooterNavItems,
    filteredMainNavItems,
    filteredProfileNavItems,
} from './side-menu';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    title?: string;
}

export default ({ children, breadcrumbs, title, ...props }: AppLayoutProps) => {
    const page = usePage<SharedData>();
    const technician = page.props.technician as
        | { unread_notifications_count?: number; unread_notifications?: any[] }
        | undefined;

    breadcrumbs = [
        { title: 'Dashboard', href: '/technician' },
        ...(breadcrumbs || []),
    ];
    const unreadNotificationsCount = technician?.unread_notifications_count ?? 0;
    const unreadNotifications = technician?.unread_notifications ?? [];
    const all_notifications_url = route('technician.notification.index');
    unreadNotifications.map((notification: any) => {
        notification.href = route('technician.notification.show', notification.id);
        return notification;
    });
    const notificationData = {
        unreadNotificationsCount,
        unreadNotifications,
        all_notifications_url,
    };

    return (
        <AppLayoutTemplate
            authUser={technician}
            mainNavItems={filteredMainNavItems}
            footerNavItems={filteredFooterNavItems}
            profileNavItems={filteredProfileNavItems}
            notificationData={notificationData}
            breadcrumbs={breadcrumbs}
            {...props}
        >
            {children}
        </AppLayoutTemplate>
    );
};

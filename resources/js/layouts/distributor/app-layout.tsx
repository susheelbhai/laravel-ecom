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
    const distributor = page.props.distributor as
        | { unread_notifications_count?: number; unread_notifications?: any[] }
        | undefined;

    breadcrumbs = [
        { title: 'Dashboard', href: '/distributor' },
        ...(breadcrumbs || []),
    ];
    const unreadNotificationsCount =
        distributor?.unread_notifications_count ?? 0;
    const unreadNotifications = distributor?.unread_notifications ?? [];
    const all_notifications_url = route('distributor.notification.index');
    unreadNotifications.map((notification: any) => {
        notification.href = route(
            'distributor.notification.show',
            notification.id,
        );
        return notification;
    });
    const notificationData = {
        unreadNotificationsCount,
        unreadNotifications,
        all_notifications_url,
    };

    return (
        <AppLayoutTemplate
            authUser={distributor}
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

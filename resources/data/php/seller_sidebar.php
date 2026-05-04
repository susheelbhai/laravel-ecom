<?php

$sidebarMenu = [
    [
        'group' => 'Menu',
        'icon' => 'ri-dashboard-line',
        'items' => [
            ['name' => 'Dashboard', 'icon' => 'fas fa-tv', 'route' => 'seller.dashboard'],
        ],
    ],
];

$footerNavItems = [];

$profileNavItems = [
    [
        'title' => 'Settings',
        'routeName' => 'seller.profile.edit',
        'icon' => 'settings',
    ],
    [
        'title' => 'Log Out',
        'routeName' => 'seller.logout',
        'icon' => 'log-out',
        'method' => 'post',
    ],
];

return [
    'sidebarMenu' => $sidebarMenu,
    'footerNavItems' => $footerNavItems,
    'profileNavItems' => $profileNavItems,
];

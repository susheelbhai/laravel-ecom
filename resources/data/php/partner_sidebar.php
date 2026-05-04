<?php

$sidebarMenu = [
    [
        'group' => 'Menu',
        'icon' => 'ri-dashboard-line',
        'items' => [
            ['name' => 'Dashboard', 'icon' => 'fas fa-tv', 'route' => 'partner.dashboard'],
        ],
    ],
];

$footerNavItems = [];

$profileNavItems = [
    [
        'title' => 'Settings',
        'routeName' => 'partner.profile.edit',
        'icon' => 'settings',
    ],
    [
        'title' => 'Log Out',
        'routeName' => 'partner.logout',
        'icon' => 'log-out',
        'method' => 'post',
    ],
];

return [
    'sidebarMenu' => $sidebarMenu,
    'footerNavItems' => $footerNavItems,
    'profileNavItems' => $profileNavItems,
];

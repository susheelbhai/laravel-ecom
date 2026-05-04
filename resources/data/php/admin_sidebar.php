<?php

$sidebarMenu = [
    [
        'group' => 'Menu',
        'icon' => 'ri-dashboard-line',
        'items' => [
            ['name' => 'Dashboard', 'icon' => 'fas fa-tv', 'route' => 'admin.dashboard'],
            ['name' => 'Partner', 'icon' => 'fa-solid fa-people-arrows', 'route' => 'admin.partner.index'],
            ['name' => 'Distributor', 'icon' => 'fas fa-truck-field', 'route' => 'admin.distributor.index'],
            ['name' => 'Dealer', 'icon' => 'fas fa-store', 'route' => 'admin.dealer.index'],
            ['name' => 'User Query', 'icon' => 'fas fa-clipboard-question', 'route' => 'admin.userQuery.index'],
            ['name' => 'Newsletter', 'icon' => 'fas fa-newspaper', 'route' => 'admin.newsletter.index'],
            ['name' => 'Gallery', 'icon' => 'fas fa-image', 'route' => 'admin.gallery.index'],
            [
                'name' => 'Product',
                'icon' => 'fas fa-box',
                'children' => [
                    ['name' => 'Products Category', 'icon' => 'fas fa-folder-tree', 'route' => 'admin.product_category.index'],
                    ['name' => 'All Products', 'icon' => 'fas fa-box', 'route' => 'admin.product.index'],
                    ['name' => 'Product Enquiry', 'icon' => 'fas fa-comments', 'route' => 'admin.productEnquiry.index'],
                ],
            ],
            ['name' => 'Admin', 'icon' => 'fas fa-users-cog', 'route' => 'admin.admin.index'],
            ['name' => 'Role', 'icon' => 'fas fa-user-shield', 'route' => 'admin.role.index'],
            ['name' => 'Permission', 'icon' => 'fas fa-key', 'route' => 'admin.permission.index'],
            ['name' => 'Seller', 'icon' => 'fas fa-user-tie', 'route' => 'admin.seller.index'],
            ['name' => 'User', 'icon' => 'fas fa-user', 'route' => 'admin.user.index'],
            [
                'name' => 'App Setting',
                'icon' => 'fa fa-cog',
                'route' => 'admin.settings.general',
            ],
            [
                'name' => 'Forms',
                'icon' => 'fas fa-file-alt',
                'children' => [
                    ['name' => 'Simple', 'icon' => 'fas fa-book', 'route' => 'admin.forms.simple'],
                    ['name' => 'Editor', 'icon' => 'fas fa-edit', 'route' => 'admin.forms.editor'],
                    ['name' => 'Date', 'icon' => 'fas fa-calendar', 'route' => 'admin.forms.date'],
                    ['name' => 'Select', 'icon' => 'fas fa-list', 'route' => 'admin.forms.select'],
                    ['name' => 'File', 'icon' => 'fas fa-file', 'route' => 'admin.forms.file'],
                    ['name' => 'Image', 'icon' => 'fas fa-image', 'route' => 'admin.forms.image'],
                    ['name' => 'Wizard', 'icon' => 'fas fa-project-diagram', 'route' => 'admin.forms.wizard'],
                ],
            ],
        ],
    ],
    [
        'group' => 'Menu2',
        'icon' => 'ri-dashboard-line',
        'items' => [
            [
                'name' => 'Pages',
                'icon' => 'fas fa-file-alt',
                'children' => [
                    ['name' => 'Home', 'icon' => 'fas fa-house', 'route' => 'admin.pages.homePage'],
                    ['name' => 'About Us', 'icon' => 'fas fa-circle-info', 'route' => 'admin.pages.aboutPage'],
                    ['name' => 'Contact Us', 'icon' => 'fas fa-envelope', 'route' => 'admin.pages.contactPage'],
                    ['name' => 'Testimonial', 'icon' => 'fas fa-quote-right', 'route' => 'admin.testimonial.index'],
                    ['name' => 'Team', 'icon' => 'fas fa-users', 'route' => 'admin.team.index'],
                    ['name' => 'Portfolio', 'icon' => 'fas fa-images', 'route' => 'admin.portfolio.index'],
                    ['name' => 'FAQ', 'icon' => 'fas fa-circle-question', 'route' => 'admin.faq.index'],
                    ['name' => 'Terms & Conditions', 'icon' => 'fas fa-file-contract', 'route' => 'admin.pages.tncPage'],
                    ['name' => 'Privacy Policy', 'icon' => 'fas fa-shield-halved', 'route' => 'admin.pages.privacyPage'],
                    ['name' => 'Refund Policy', 'icon' => 'fas fa-rotate-left', 'route' => 'admin.pages.refundPage'],
                ],
            ],
            [
                'name' => 'Services',
                'icon' => 'fas fa-server',
                'children' => [
                    ['name' => 'All Services', 'icon' => 'fas fa-list', 'route' => 'admin.service.index'],
                    ['name' => 'Create Services', 'icon' => 'fas fa-plus', 'route' => 'admin.service.create'],
                ],
            ],
            [
                'name' => 'Projects',
                'icon' => 'fab fa-pagelines',
                'children' => [
                    ['name' => 'All Projects', 'icon' => 'fas fa-diagram-project', 'route' => 'admin.project.index'],
                    ['name' => 'Create Projects', 'icon' => 'fas fa-plus', 'route' => 'admin.project.create'],
                ],
            ],
            [
                'name' => 'Blogs',
                'icon' => 'fas fa-blog',
                'children' => [
                    ['name' => 'All Blog', 'icon' => 'fas fa-book-open', 'route' => 'admin.blog.index'],
                    ['name' => 'Create Blog', 'icon' => 'fas fa-pen-to-square', 'route' => 'admin.blog.create'],
                ],
            ],
            [
                'name' => 'Layouts',
                'icon' => 'fab fa-pagelines',
                'sub_groups' => [
                    [
                        'name' => 'Footer',
                        'icon' => 'fas fa-table-columns',
                        'children' => [
                            [
                                'name' => 'Important Links',
                                'icon' => 'fas fa-link',
                                'route' => 'admin.important_links.index',
                            ],
                        ],
                    ],
                ],
            ],
        ],
    ],
];

// Mirrors resources/data/js/sidebar_admin.ts — footerNavItems & profileNavItems (icon = lucide-style name for Blade SVG)
$footerNavItems = [
    [
        'title' => 'Settings',
        'routeName' => 'admin.settings.general',
        'icon' => 'settings',
    ],
];

$profileNavItems = [
    [
        'title' => 'Settings',
        'routeName' => 'admin.profile.edit',
        'icon' => 'settings',
    ],
    [
        'title' => 'Log Out',
        'routeName' => 'admin.logout',
        'icon' => 'log-out',
        'method' => 'post',
    ],
];

return [
    'sidebarMenu' => $sidebarMenu,
    'footerNavItems' => $footerNavItems,
    'profileNavItems' => $profileNavItems,
];

<?php

/**
 * User-facing header navigation — keep in sync with resources/data/js/header_user.ts
 */
return [
    'menuItems' => [
        ['name' => 'Home', 'routeName' => 'home'],
        ['name' => 'About', 'routeName' => 'about'],
        ['name' => 'Product', 'routeName' => 'product.index'],
        ['name' => 'Services', 'routeName' => 'services'],
        ['name' => 'Blogs', 'routeName' => 'blog.index'],
        ['name' => 'Contact', 'routeName' => 'contact'],
    ],
    'profileItems' => [
        ['name' => 'Profile', 'routeName' => 'profile.edit'],
        ['name' => 'Logout', 'routeName' => 'logout', 'method' => 'post'],
    ],
    'loginRoute' => 'login',
];

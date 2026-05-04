type ProfileItem = {
    name: string;
    routeName: string;
    method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
};

const menuItems = [
    { name: "Home", routeName: "home" },
    { name: "About", routeName: "about" },
    { name: "Product", routeName: "product.index" },
    { name: "Services", routeName: "services" },
    { name: "Blogs", routeName: "blog.index" },
    { name: "Contact", routeName: "contact" },
];


const profileItems: ProfileItem[] = [
    { name: 'Dashboard', routeName: 'dashboard' },
    { name: 'Profile', routeName: 'profile.edit' },
    { name: 'Orders', routeName: 'orders.index' },
    { name: 'Addresses', routeName: 'addresses.index' },
    { name: 'Logout', routeName: 'logout', method: 'post' },
];

const loginRoute = "login";
export { menuItems, profileItems, loginRoute };

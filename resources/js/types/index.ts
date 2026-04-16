export type * from './auth';
export type * from './navigation';
export type * from './ui';
export type * from './review';

import type { Auth } from './auth';

export type AppData = {
    name?: string;
    email?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
    [key: string]: unknown;
};

export type SharedData = {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    appData?: AppData;
    [key: string]: unknown;
};

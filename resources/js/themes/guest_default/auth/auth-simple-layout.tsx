import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import { Container } from '@/components/ui/container';
import { ContainerFluid } from '@/components/ui/container-fluid';
import type { SharedData } from '@/types';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    const { auth } = usePage<SharedData>().props;
    const settings = auth?.settings;

    return (
        <ContainerFluid className="m-auto bg-background2 p-0">
            <Container>
                <div className="flex min-h-screen items-center justify-center p-5 align-middle">
                    <div className="flex overflow-hidden rounded-lg border border-white">
                        {/* Left side image (hidden on mobile, visible on md+) */}
                        <div className="hidden w-1/2 items-center justify-center overflow-hidden bg-muted md:flex">
                            <img
                                src={settings?.side_image || ''}
                                alt="Auth illustration"
                                className="h-full w-full object-cover"
                            />
                        </div>

                        {/* Right side form */}
                        <div className="flex w-full items-center justify-center bg-background p-6 md:w-1/2 md:p-10">
                            <div className="w-full max-w-sm">
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col items-center gap-4">
                                        <Link
                                            href={route('home')}
                                            className="flex flex-col items-center gap-2 font-medium"
                                        >
                                            <div className="mb-1 flex items-center justify-center rounded-md">
                                                <AppLogoIcon className="" />
                                            </div>
                                            <span className="sr-only">
                                                {title}
                                            </span>
                                        </Link>

                                        <div className="space-y-2 text-center">
                                            <h1 className="text-xl font-medium">
                                                {title}
                                            </h1>
                                            <p className="text-center text-sm text-muted-foreground">
                                                {description}
                                            </p>
                                        </div>
                                    </div>
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </ContainerFluid>
    );
}

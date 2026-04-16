import { Link, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaTwitter,
    FaYoutube,
} from 'react-icons/fa';
import { Container } from '@/components/ui/container';

const Footer: React.FC = () => {
    const appData = (usePage().props as any).appData;
    const important_links = (usePage().props as any).important_links;
    const [visitors, setVisitors] = useState({ total: 0, today: 0 });

    useEffect(() => {
        fetch('/api/visitors/count')
            .then((res) => res.json())
            .then((data) => setVisitors(data))
            .catch(() => {});
    }, []);

    return (
        <footer className="bg-footer-bg text-footer-text">
            {/* Accent top border */}
            <div className="h-1 w-full bg-primary" />

            <Container className="py-10">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
                    {/* Section 1: Logo + Contact */}
                    <div className="space-y-4">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-3"
                        >
                            {appData.light_logo && (
                                <img
                                    src={appData.light_logo}
                                    alt={appData.name || 'Logo'}
                                    className="h-10 w-auto"
                                />
                            )}
                        </Link>

                        <p className="max-w-xs text-sm text-muted-foreground">
                            {appData.tagline ||
                                'Committed to delivering quality services with trust and excellence.'}
                        </p>

                        <div className="mt-4 space-y-1.5 text-sm">
                            <p>
                                <span className="mr-1.5 text-primary">📞</span>
                                <a
                                    href={`tel:${appData.phone}`}
                                    className="transition-colors hover:text-primary"
                                >
                                    {appData.phone}
                                </a>
                            </p>
                            <p>
                                <span className="mr-1.5 text-primary">✉️</span>
                                <a
                                    href={`mailto:${appData.email}`}
                                    className="break-all transition-colors hover:text-primary"
                                >
                                    {appData.email}
                                </a>
                            </p>
                            <p className="flex items-start text-sm">
                                <span className="mr-1.5 text-primary">🏢</span>
                                <span className="text-muted-foreground">
                                    {appData.address}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Section 2: Important Links */}
                    <div>
                        <h2 className="mb-4 text-base font-semibold tracking-wide text-primary-foreground">
                            Important Links
                        </h2>
                        <ul className="space-y-2 text-sm">
                            {important_links.map((link: any) => (
                                <li key={link.id}>
                                    <Link
                                        href={link.href}
                                        className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
                                    >
                                        <span className="rounded-full bg-muted" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Section 3: Social + Visitors */}
                    <div className="space-y-4">
                        <h2 className="mb-2 text-base font-semibold tracking-wide text-primary-foreground">
                            Connect With Us
                        </h2>
                        <div className="flex flex-wrap items-center gap-3">
                            {appData.facebook && (
                                <a
                                    href={appData.facebook}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground"
                                >
                                    <FaFacebookF />
                                </a>
                            )}
                            {appData.twitter && (
                                <a
                                    href={appData.twitter}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground"
                                >
                                    <FaTwitter />
                                </a>
                            )}
                            {appData.instagram && (
                                <a
                                    href={appData.instagram}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground"
                                >
                                    <FaInstagram />
                                </a>
                            )}
                            {appData.linkedin && (
                                <a
                                    href={appData.linkedin}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground"
                                >
                                    <FaLinkedinIn />
                                </a>
                            )}
                            {appData.youtube && (
                                <a
                                    href={appData.youtube}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground"
                                >
                                    <FaYoutube />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
                    <div className="flex flex-col justify-between md:flex-row md:gap-4">
                        <div className="copy">
                            © {new Date().getFullYear()}{' '}
                            <span className="font-medium">{appData.name}</span>.
                            All rights reserved.
                        </div>
                        <div className="credit">
                            Developed by{' '}
                            <a
                                href="https://digamite.com"
                                target="_blank"
                                rel="noreferrer"
                                className="hover:underline"
                            >
                                Digamite Private Limited
                            </a>
                        </div>
                    </div>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;

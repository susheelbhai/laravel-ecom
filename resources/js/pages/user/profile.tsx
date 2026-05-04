import { Link, usePage } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { InputDiv } from '@/components/form/container/input-div';
import Button from '@/components/ui/button/button';
import { Container } from '@/components/ui/layout/container';
import AppLayout from '@/layouts/user/app-layout';
import { useFormHandler } from '@/lib/use-form-handler';
import { type SharedData } from '@/types';

type FormType = {
    name: string;
    email: string;
    phone?: string;
    profile_pic: string;
};

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<SharedData>().props;
    const [isEditing, setIsEditing] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const initialValues: FormType = {
        name: auth.user.name,
        email: auth.user.email,
        phone: (auth.user.phone as string | null | undefined) ?? '',
        profile_pic: '',
    };

    const { submit, inputDivData, processing } = useFormHandler<FormType>({
        url: route('profile.update'),
        initialValues,
        method: 'PATCH',
        onSuccess: () => {
            setIsEditing(false);
            setPreviewImage(null);
        },
    });

    const { setData } = inputDivData;

    // 🔑 Keep form in sync with latest auth.user
    useEffect(() => {
        setData('name', auth.user.name);
        setData('email', auth.user.email);
        setData('phone', (auth.user.phone as string | null | undefined) ?? '');
        // don't touch profile_pic here so you don't override file input
    }, [auth.user.name, auth.user.email, auth.user.phone, setData]);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('profile_pic', file as any);
            
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8 sm:py-12">
                <Container className="max-w-5xl">
                    {/* Header Section */}
                    <div className="mb-8 text-center">
                        <div className="mb-3 inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary uppercase tracking-wide">
                            Account Settings
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            {isEditing ? 'Edit Profile' : 'Your Profile'}
                        </h1>
                        <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                            {isEditing
                                ? 'Update your name, email and other profile details.'
                                : 'View your profile details. Click edit to make changes.'}
                        </p>
                    </div>

                    {/* Main Card */}
                    <div className="overflow-hidden rounded-3xl bg-card shadow-[0_20px_60px_rgba(0,0,0,0.08)] ring-1 ring-border">
                        {/* VIEW MODE */}
                        {!isEditing && (
                            <div className="p-6 sm:p-8 lg:p-10">
                                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                                    {/* Profile Picture Section */}
                                    <div className="flex flex-col items-center space-y-4 lg:col-span-1">
                                        <div className="relative">
                                            {auth.user.profile_pic == null ? (
                                                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 ring-4 ring-primary/10">
                                                    <span className="text-4xl font-bold text-primary">
                                                        {auth.user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            ) : (
                                                <img
                                                    src={`${auth.user.profile_pic}`}
                                                    className="h-32 w-32 rounded-full object-cover ring-4 ring-primary/10"
                                                    alt="Profile Picture"
                                                />
                                            )}
                                        </div>
                                        <div className="text-center">
                                            <h2 className="text-xl font-semibold">
                                                {auth.user.name}
                                            </h2>
                                            <p className="text-sm text-muted-foreground">
                                                {auth.user.email}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Profile Details Section */}
                                    <div className="space-y-6 lg:col-span-2">
                                        <div className="grid gap-6 sm:grid-cols-2">
                                            <div className="rounded-2xl bg-muted/50 p-4 transition-colors hover:bg-muted/70">
                                                <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                                    Full Name
                                                </p>
                                                <p className="text-base font-medium text-foreground">
                                                    {auth.user.name}
                                                </p>
                                            </div>

                                            <div className="rounded-2xl bg-muted/50 p-4 transition-colors hover:bg-muted/70">
                                                <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                                    Email Address
                                                </p>
                                                <p className="break-all text-base font-medium text-foreground">
                                                    {auth.user.email}
                                                </p>
                                            </div>

                                            <div className="rounded-2xl bg-muted/50 p-4 transition-colors hover:bg-muted/70">
                                                <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                                    Phone Number
                                                </p>
                                                <p className="text-base font-medium text-foreground">
                                                    {(auth.user.phone as string) || (
                                                        <span className="text-muted-foreground">
                                                            Not added
                                                        </span>
                                                    )}
                                                </p>
                                            </div>

                                            <div className="rounded-2xl bg-muted/50 p-4 transition-colors hover:bg-muted/70">
                                                <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                                    Account Status
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <div className={`h-2 w-2 rounded-full ${auth.user.email_verified_at ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                                    <p className="text-base font-medium text-foreground">
                                                        {auth.user.email_verified_at ? 'Verified' : 'Unverified'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 pt-4">
                                            <Button
                                                type="button"
                                                onClick={() => setIsEditing(true)}
                                                className="rounded-2xl"
                                            >
                                                Edit Profile
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* EDIT MODE */}
                        {isEditing && (
                            <form onSubmit={submit} className="p-6 sm:p-8 lg:p-10">
                                <div className="space-y-6">
                                    {/* Profile Picture Section */}
                                    <div className="flex flex-col items-center space-y-4 border-b border-border pb-6">
                                        <div className="relative group">
                                            {previewImage ? (
                                                <img
                                                    src={previewImage}
                                                    className="h-24 w-24 rounded-full object-cover ring-4 ring-primary/10"
                                                    alt="Preview"
                                                />
                                            ) : auth.user.profile_pic == null ? (
                                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 ring-4 ring-primary/10">
                                                    <span className="text-3xl font-bold text-primary">
                                                        {auth.user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            ) : (
                                                <img
                                                    src={`${auth.user.profile_pic}`}
                                                    className="h-24 w-24 rounded-full object-cover ring-4 ring-primary/10"
                                                    alt="Profile Picture"
                                                />
                                            )}
                                            <button
                                                type="button"
                                                onClick={handleImageClick}
                                                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-2 ring-background transition-transform hover:scale-110"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            {previewImage ? 'New image selected - click Save Changes to update' : 'Click the pen icon to update your profile picture'}
                                        </p>
                                    </div>

                                    {/* Form Fields */}
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <InputDiv
                                            type="text"
                                            name="name"
                                            label="Full Name"
                                            inputDivData={inputDivData}
                                        />
                                        <InputDiv
                                            type="email"
                                            name="email"
                                            label="Email Address"
                                            inputDivData={inputDivData}
                                        />
                                    </div>
                                    
                                    <InputDiv
                                        type="text"
                                        name="phone"
                                        label="Phone Number"
                                        inputDivData={inputDivData}
                                    />

                                    <div className="flex items-center gap-3 pt-4">
                                        <Button disabled={processing} className="rounded-2xl">
                                            {processing ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsEditing(false)}
                                            disabled={processing}
                                            className="rounded-2xl"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Email Verification Alert */}
                    {mustVerifyEmail && auth.user.email_verified_at === null && (
                        <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/50 dark:bg-yellow-900/20">
                            <div className="flex items-start gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/40">
                                    <svg className="h-5 w-5 text-yellow-600 dark:text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                        Your email address is unverified.{' '}
                                        <Link
                                            href={route('verification.send')}
                                            method="post"
                                            as="button"
                                            className="font-semibold underline decoration-yellow-400 underline-offset-2 transition-colors hover:text-yellow-900 dark:decoration-yellow-600 dark:hover:text-yellow-100"
                                        >
                                            Click here to resend the verification email.
                                        </Link>
                                    </p>
                                    {status === 'verification-link-sent' && (
                                        <div className="mt-2 text-sm font-medium text-green-700 dark:text-green-400">
                                            ✓ A new verification link has been sent to your email address.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </Container>
            </div>
        </AppLayout>
    );
}

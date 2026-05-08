import { Head, useForm, usePage } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { useState } from 'react';

import ContinueWithSocial from '@/components/auth/ContinueWithSocial';
import ContinueWithText from '@/components/auth/ContinueWithText';
import { FormContainer } from '@/components/form/container/form-container';
import InputError from '@/components/form/input/input-error';
import TextLink from '@/components/ui/button/text-link';
import Button from '@/components/ui/button/button';
import { Checkbox } from '@/components/form/input/checkbox';
import { Input } from '@/components/form/input/input';
import { Label } from '@/components/form/input/label';
import AuthLayout from '@/layouts/dealer/auth-layout';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    submitUrl?: string;
    status?: string;
    canResetPassword: boolean;
}

export default function Login({
    submitUrl,
    status,
    canResetPassword,
}: LoginProps) {
    const { data, setData, post, processing, errors } = useForm<
        Required<LoginForm>
    >({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const page = usePage();
    const flashError = (
        page.props as { flash?: { error?: string } }
    ).flash?.error;
    const socialData = (usePage().props.socialData as any[]) ?? [];

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (submitUrl) {
            post(submitUrl);
        }
    };

    return (
        <AuthLayout
            title="Dealer login"
            description="Use the email and password your distributor provided. You can sign in after an administrator has approved your account."
        >
            <Head title="Log in" />
            {flashError && (
                <div className="mb-4 rounded-div border border-red-200 bg-red-50 p-3 text-center text-sm text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100">
                    {flashError}
                </div>
            )}
            {socialData.map((item: any, id: number) => {
                const key = Object.keys(item)[0];
                const itemData = item[key];
                return (
                    <ContinueWithSocial
                        key={id}
                        platform={key as any}
                        href={itemData.href}
                    />
                );
            })}
            {socialData.length > 0 && <ContinueWithText />}

            <FormContainer
                onSubmit={submit}
                processing={processing}
                buttonLabel="Log in"
            >
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email or phone</Label>
                        <Input
                            id="email"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="username"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            {canResetPassword && (
                                <TextLink
                                    href={route('dealer.password.request')}
                                    className="ml-auto text-sm"
                                    tabIndex={5}
                                >
                                    Forgot password?
                                </TextLink>
                            )}
                        </div>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                placeholder="Password"
                                className="pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-500" />
                                ) : (
                                    <Eye className="h-4 w-4 text-gray-500" />
                                )}
                            </Button>
                        </div>
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onClick={() => setData('remember', !data.remember)}
                            tabIndex={3}
                        />
                        <Label htmlFor="remember">Remember me</Label>
                    </div>
                </div>
            </FormContainer>
        </AuthLayout>
    );
}

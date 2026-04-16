import { FormEventHandler } from 'react';

import { Head, useForm } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/user/auth-layout';

export default function TwoFactorChallenge() {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
        recovery_code: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('two-factor.login'));
    };

    return (
        <AuthLayout title="Two-factor authentication">
            <Head title="Two-factor authentication" />

            <form onSubmit={submit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="code">Authentication code</Label>
                    <Input
                        id="code"
                        name="code"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        autoFocus
                        value={data.code}
                        onChange={(e) => setData('code', e.target.value)}
                    />
                    <InputError message={errors.code} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="recovery_code">Recovery code</Label>
                    <Input
                        id="recovery_code"
                        name="recovery_code"
                        autoComplete="off"
                        value={data.recovery_code}
                        onChange={(e) =>
                            setData('recovery_code', e.target.value)
                        }
                    />
                    <InputError message={errors.recovery_code} />
                </div>

                <Button type="submit" className="w-full" disabled={processing}>
                    Continue
                </Button>
            </form>
        </AuthLayout>
    );
}

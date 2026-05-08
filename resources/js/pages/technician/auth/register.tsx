import { Head, useForm, usePage } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import type { FormEventHandler, ReactNode } from 'react';
import { useState } from 'react';

import { FormContainer } from '@/components/form/container/form-container';
import InputError from '@/components/form/input/input-error';
import Button from '@/components/ui/button/button';
import { Input } from '@/components/form/input/input';
import { Label } from '@/components/form/input/label';
import AuthLayout from '@/layouts/technician/register-layout';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/layout/container';

type Option = { value: string; label: string };

type RegisterForm = {
    name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
    specialization: string;
    experience_years: string;
    certification: string;
    address: string;
    city: string;
    state_id: string;
    pincode: string;
    id_type: string;
    id_number: string;
    referral_source: string;
};

const selectClassName = cn(
    'border-input flex h-9 w-full rounded-div border bg-transparent px-3 py-1 text-base shadow-xs outline-none md:text-sm',
    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
);

const textAreaClassName = cn(
    'border-input placeholder:text-muted-foreground flex min-h-[88px] w-full rounded-div border bg-transparent px-3 py-2 text-base shadow-xs outline-none md:text-sm',
    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
);

function Section({
    title,
    description,
    children,
    cols = 3,
}: {
    title: string;
    description?: string;
    children: ReactNode;
    cols?: 2 | 3;
}) {
    return (
        <section className="space-y-4 rounded-div border border-border bg-card/30 p-4">
            <div>
                <h2 className="text-base font-semibold text-foreground">{title}</h2>
                {description && (
                    <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                )}
            </div>
            <div className={`grid grid-cols-1 gap-4 ${cols === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
                {children}
            </div>
        </section>
    );
}

function Field({
    label,
    error,
    required,
    full,
    span2,
    children,
}: {
    label: string;
    error?: string;
    required?: boolean;
    full?: boolean;
    span2?: boolean;
    children: ReactNode;
}) {
    return (
        <div className={cn('grid gap-1.5', full && 'md:col-span-3', span2 && 'md:col-span-2')}>
            <Label>
                {label}
                {required && <span className="ml-0.5 text-destructive">*</span>}
            </Label>
            {children}
            {error && <InputError message={error} />}
        </div>
    );
}

export default function Register({ submitUrl }: { submitUrl?: string }) {
    const page = usePage<{
        specializations?: Option[];
        idTypes?: Option[];
        states?: Option[];
    }>();
    const specializations = page.props.specializations ?? [];
    const idTypes = page.props.idTypes ?? [];
    const states = page.props.states ?? [];

    const { data, setData, post, processing, errors } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        specialization: '',
        experience_years: '',
        certification: '',
        address: '',
        city: '',
        state_id: '',
        pincode: '',
        id_type: '',
        id_number: '',
        referral_source: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (submitUrl) post(submitUrl);
    };

    return (
        <AuthLayout
            title="Technician registration"
            description="Provide your personal, professional, and identity details. An administrator will verify your application before you can access the dashboard."
        >
            <Head title="Register" />
            <Container>
                <FormContainer
                    onSubmit={submit}
                    processing={processing}
                    buttonLabel="Submit application"
                    className="w-full space-y-6"
                >
                    {/* ── 1. Account & contact ── */}
                    <Section
                        title="Account & contact"
                        description="Login credentials and primary contact information."
                    >
                        <Field label="Full name" error={errors.name} required full>
                            <Input
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                autoComplete="name"
                                placeholder="As on government ID"
                            />
                        </Field>
                        <Field label="Email address" error={errors.email} required>
                            <Input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                autoComplete="email"
                                placeholder="email@example.com"
                            />
                        </Field>
                        <Field label="Mobile number" error={errors.phone} required>
                            <Input
                                type="tel"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                autoComplete="tel"
                                placeholder="10-digit mobile number"
                            />
                        </Field>
                        <Field label="Password" error={errors.password} required>
                            <div className="relative">
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    autoComplete="new-password"
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
                                    {showPassword
                                        ? <EyeOff className="h-4 w-4 text-gray-500" />
                                        : <Eye className="h-4 w-4 text-gray-500" />}
                                </Button>
                            </div>
                        </Field>
                        <Field label="Confirm password" error={errors.password_confirmation} required>
                            <Input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                autoComplete="new-password"
                            />
                        </Field>
                    </Section>

                    {/* ── 2. Professional details ── */}
                    <Section
                        title="Professional details"
                        description="Your area of expertise and work experience."
                    >
                        <Field label="Specialization" error={errors.specialization} required>
                            <select
                                className={selectClassName}
                                value={data.specialization}
                                onChange={(e) => setData('specialization', e.target.value)}
                            >
                                <option value="">Select…</option>
                                {specializations.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Years of experience (optional)" error={errors.experience_years}>
                            <Input
                                type="number"
                                min={0}
                                max={50}
                                value={data.experience_years}
                                onChange={(e) => setData('experience_years', e.target.value)}
                                placeholder="e.g. 5"
                            />
                        </Field>
                        <Field label="Certification / qualification (optional)" error={errors.certification}>
                            <Input
                                value={data.certification}
                                onChange={(e) => setData('certification', e.target.value)}
                                placeholder="e.g. ITI, Diploma in Electrical Engineering"
                            />
                        </Field>
                        <Field label="How did you hear about us? (optional)" error={errors.referral_source}>
                            <Input
                                value={data.referral_source}
                                onChange={(e) => setData('referral_source', e.target.value)}
                            />
                        </Field>
                    </Section>

                    {/* ── 3. Address ── */}
                    <Section
                        title="Address"
                        description="Your current residential or work address."
                    >
                        <Field label="Street address" error={errors.address} required full>
                            <textarea
                                className={textAreaClassName}
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                rows={2}
                            />
                        </Field>
                        <Field label="City / district" error={errors.city} required>
                            <Input
                                value={data.city}
                                onChange={(e) => setData('city', e.target.value)}
                            />
                        </Field>
                        <Field label="State / UT" error={errors.state_id} required>
                            <select
                                className={selectClassName}
                                value={data.state_id}
                                onChange={(e) => setData('state_id', e.target.value)}
                            >
                                <option value="">Select state…</option>
                                {states.map((s) => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                        </Field>
                        <Field label="PIN code" error={errors.pincode} required>
                            <Input
                                inputMode="numeric"
                                maxLength={6}
                                value={data.pincode}
                                onChange={(e) => setData('pincode', e.target.value)}
                                placeholder="6-digit PIN"
                            />
                        </Field>
                    </Section>

                    {/* ── 4. Identity verification ── */}
                    <Section
                        title="Identity verification"
                        description="Government-issued ID for verification."
                        cols={2}
                    >
                        <Field label="ID type" error={errors.id_type} required>
                            <select
                                className={selectClassName}
                                value={data.id_type}
                                onChange={(e) => setData('id_type', e.target.value)}
                            >
                                <option value="">Select…</option>
                                {idTypes.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </Field>
                        <Field label="ID number" error={errors.id_number} required>
                            <Input
                                value={data.id_number}
                                onChange={(e) => setData('id_number', e.target.value)}
                                autoComplete="off"
                            />
                        </Field>
                    </Section>
                </FormContainer>
            </Container>
        </AuthLayout>
    );
}

import { Head, useForm, usePage } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import type { FormEventHandler, ReactNode } from 'react';
import { useState } from 'react';

import { FormContainer } from '@/components/form/container/form-container';
import InputError from '@/components/form/input/input-error';
import TextLink from '@/components/ui/button/text-link';
import Button from '@/components/ui/button/button';
import { Input } from '@/components/form/input/input';
import { Label } from '@/components/form/input/label';
import AuthLayout from '@/layouts/technician/auth-layout';
import { cn } from '@/lib/utils';

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
    state: string;
    pincode: string;
    id_type: string;
    id_number: string;
    referral_source: string;
};

const selectClassName = cn(
    'border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none md:text-sm',
    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
);

const textAreaClassName = cn(
    'border-input placeholder:text-muted-foreground flex min-h-[88px] w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs outline-none md:text-sm',
    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
);

function Section({
    title,
    description,
    children,
}: {
    title: string;
    description?: string;
    children: ReactNode;
}) {
    return (
        <section className="space-y-4 rounded-lg border border-border bg-card/30 p-4">
            <div>
                <h2 className="text-base font-semibold text-foreground">
                    {title}
                </h2>
                {description ? (
                    <p className="mt-1 text-sm text-muted-foreground">
                        {description}
                    </p>
                ) : null}
            </div>
            <div className="grid gap-4">{children}</div>
        </section>
    );
}

export default function Register({ submitUrl }: { submitUrl?: string }) {
    const page = usePage<{
        specializations?: Option[];
        idTypes?: Option[];
    }>();
    const specializations = page.props.specializations ?? [];
    const idTypes = page.props.idTypes ?? [];

    const { data, setData, post, processing, errors } = useForm<
        Required<RegisterForm>
    >({
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
        state: '',
        pincode: '',
        id_type: '',
        id_number: '',
        referral_source: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (submitUrl) {
            post(submitUrl);
        }
    };

    return (
        <AuthLayout
            fullWidth
            title="Technician registration"
            description="Provide your personal, professional, and identity details. An administrator will verify your application before you can access the dashboard."
        >
            <Head title="Register" />
            <FormContainer
                onSubmit={submit}
                processing={processing}
                buttonLabel="Submit application"
                className="w-full space-y-6"
            >
                <div className="grid w-full gap-6">
                    <Section
                        title="Account & contact"
                        description="Login credentials and primary contact information."
                    >
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="name">Full name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    required
                                    autoComplete="name"
                                    placeholder="As on government ID"
                                />
                                <InputError message={errors.name} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    required
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Mobile number</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData('phone', e.target.value)
                                    }
                                    required
                                    autoComplete="tel"
                                    placeholder="10-digit mobile number"
                                />
                                <InputError message={errors.phone} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        required
                                        autoComplete="new-password"
                                        className="pr-10"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
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
                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Confirm password
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            'password_confirmation',
                                            e.target.value,
                                        )
                                    }
                                    required
                                    autoComplete="new-password"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>
                        </div>
                    </Section>

                    <Section
                        title="Professional details"
                        description="Your area of expertise and work experience."
                    >
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="specialization">
                                    Specialization
                                </Label>
                                <select
                                    id="specialization"
                                    className={selectClassName}
                                    value={data.specialization}
                                    onChange={(e) =>
                                        setData(
                                            'specialization',
                                            e.target.value,
                                        )
                                    }
                                    required
                                >
                                    <option value="">Select…</option>
                                    {specializations.map((o) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.specialization} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="experience_years">
                                    Years of experience (optional)
                                </Label>
                                <Input
                                    id="experience_years"
                                    type="number"
                                    min={0}
                                    max={50}
                                    value={data.experience_years}
                                    onChange={(e) =>
                                        setData(
                                            'experience_years',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="e.g. 5"
                                />
                                <InputError message={errors.experience_years} />
                            </div>
                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="certification">
                                    Certification / qualification (optional)
                                </Label>
                                <Input
                                    id="certification"
                                    value={data.certification}
                                    onChange={(e) =>
                                        setData('certification', e.target.value)
                                    }
                                    placeholder="e.g. ITI, Diploma in Electrical Engineering"
                                />
                                <InputError message={errors.certification} />
                            </div>
                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="referral_source">
                                    How did you hear about us? (optional)
                                </Label>
                                <Input
                                    id="referral_source"
                                    value={data.referral_source}
                                    onChange={(e) =>
                                        setData(
                                            'referral_source',
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError message={errors.referral_source} />
                            </div>
                        </div>
                    </Section>

                    <Section
                        title="Address"
                        description="Your current residential or work address."
                    >
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="address">Street address</Label>
                                <textarea
                                    id="address"
                                    className={textAreaClassName}
                                    value={data.address}
                                    onChange={(e) =>
                                        setData('address', e.target.value)
                                    }
                                    required
                                    rows={3}
                                />
                                <InputError message={errors.address} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="city">City / district</Label>
                                <Input
                                    id="city"
                                    value={data.city}
                                    onChange={(e) =>
                                        setData('city', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.city} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="state">State / UT</Label>
                                <Input
                                    id="state"
                                    value={data.state}
                                    onChange={(e) =>
                                        setData('state', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.state} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="pincode">PIN code</Label>
                                <Input
                                    id="pincode"
                                    inputMode="numeric"
                                    maxLength={6}
                                    value={data.pincode}
                                    onChange={(e) =>
                                        setData('pincode', e.target.value)
                                    }
                                    required
                                    placeholder="6-digit PIN"
                                />
                                <InputError message={errors.pincode} />
                            </div>
                        </div>
                    </Section>

                    <Section
                        title="Identity verification"
                        description="Government-issued ID for verification. Details should match your supporting documents."
                    >
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="id_type">ID type</Label>
                                <select
                                    id="id_type"
                                    className={selectClassName}
                                    value={data.id_type}
                                    onChange={(e) =>
                                        setData('id_type', e.target.value)
                                    }
                                    required
                                >
                                    <option value="">Select…</option>
                                    {idTypes.map((o) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.id_type} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="id_number">ID number</Label>
                                <Input
                                    id="id_number"
                                    value={data.id_number}
                                    onChange={(e) =>
                                        setData('id_number', e.target.value)
                                    }
                                    required
                                    autoComplete="off"
                                />
                                <InputError message={errors.id_number} />
                            </div>
                        </div>
                    </Section>
                </div>
            </FormContainer>

            <div className="mt-4 space-x-1 text-center text-sm text-muted-foreground">
                <span>Already have an account?</span>
                <TextLink href={route('technician.login')}>Log in</TextLink>
            </div>
        </AuthLayout>
    );
}

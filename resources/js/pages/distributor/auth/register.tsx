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
import AuthLayout from '@/layouts/distributor/auth-layout';
import { cn } from '@/lib/utils';

type Option = { value: string; label: string };

type RegisterForm = {
    name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
    legal_business_name: string;
    trade_name: string;
    business_constitution: string;
    authorized_signatory_designation: string;
    kyc_id_type: string;
    kyc_id_number: string;
    dob: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    warehouse_address: string;
    pan_number: string;
    gstin: string;
    tan_number: string;
    msme_udyam_number: string;
    nature_of_business: string;
    years_in_business: string;
    expected_monthly_purchase_band: string;
    referral_source: string;
    bank_account_holder_name: string;
    bank_name: string;
    bank_branch: string;
    bank_account_number: string;
    bank_ifsc: string;
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
        businessConstitutions?: Option[];
        kycIdTypes?: Option[];
        purchaseBands?: Option[];
    }>();
    const businessConstitutions = page.props.businessConstitutions ?? [];
    const kycIdTypes = page.props.kycIdTypes ?? [];
    const purchaseBands = page.props.purchaseBands ?? [];

    const { data, setData, post, processing, errors } = useForm<
        Required<RegisterForm>
    >({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        legal_business_name: '',
        trade_name: '',
        business_constitution: '',
        authorized_signatory_designation: '',
        kyc_id_type: '',
        kyc_id_number: '',
        dob: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        warehouse_address: '',
        pan_number: '',
        gstin: '',
        tan_number: '',
        msme_udyam_number: '',
        nature_of_business: '',
        years_in_business: '',
        expected_monthly_purchase_band: '',
        referral_source: '',
        bank_account_holder_name: '',
        bank_name: '',
        bank_branch: '',
        bank_account_number: '',
        bank_ifsc: '',
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
            title="Distributor registration"
            description="Provide KYC, business, tax, and bank details as on your official documents. An administrator will verify your application before you can access the dashboard."
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
                        title="Account & primary contact"
                        description="Login credentials and the main person we should contact."
                    >
                        <div className="grid gap-2 md:grid-cols-2">
                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="name">
                                    Authorized signatory full name
                                </Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    required
                                    autoComplete="name"
                                />
                                <InputError message={errors.name} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Business email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    required
                                    autoComplete="email"
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
                        title="Business / shop details"
                        description="Legal entity name and constitution as per registration."
                    >
                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="legal_business_name">
                                Legal business name
                            </Label>
                            <Input
                                id="legal_business_name"
                                value={data.legal_business_name}
                                onChange={(e) =>
                                    setData(
                                        'legal_business_name',
                                        e.target.value,
                                    )
                                }
                                required
                                placeholder="As per GST / incorporation certificate"
                            />
                            <InputError message={errors.legal_business_name} />
                        </div>
                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="trade_name">
                                Trade / shop name (optional)
                            </Label>
                            <Input
                                id="trade_name"
                                value={data.trade_name}
                                onChange={(e) =>
                                    setData('trade_name', e.target.value)
                                }
                                placeholder="If different from legal name"
                            />
                            <InputError message={errors.trade_name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="business_constitution">
                                Constitution of business
                            </Label>
                            <select
                                id="business_constitution"
                                className={selectClassName}
                                value={data.business_constitution}
                                onChange={(e) =>
                                    setData(
                                        'business_constitution',
                                        e.target.value,
                                    )
                                }
                                required
                            >
                                <option value="">Select…</option>
                                {businessConstitutions.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.business_constitution} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="authorized_signatory_designation">
                                Designation of signatory
                            </Label>
                            <Input
                                id="authorized_signatory_designation"
                                value={data.authorized_signatory_designation}
                                onChange={(e) =>
                                    setData(
                                        'authorized_signatory_designation',
                                        e.target.value,
                                    )
                                }
                                required
                                placeholder="e.g. Proprietor, Managing Director"
                            />
                            <InputError
                                message={
                                    errors.authorized_signatory_designation
                                }
                            />
                        </div>
                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="nature_of_business">
                                Nature of business & product categories
                            </Label>
                            <textarea
                                id="nature_of_business"
                                className={textAreaClassName}
                                value={data.nature_of_business}
                                onChange={(e) =>
                                    setData(
                                        'nature_of_business',
                                        e.target.value,
                                    )
                                }
                                required
                                rows={4}
                                placeholder="Describe goods you distribute, territories, and relevant experience."
                            />
                            <InputError message={errors.nature_of_business} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="years_in_business">
                                Years in business (optional)
                            </Label>
                            <Input
                                id="years_in_business"
                                type="number"
                                min={0}
                                max={100}
                                value={data.years_in_business}
                                onChange={(e) =>
                                    setData(
                                        'years_in_business',
                                        e.target.value,
                                    )
                                }
                            />
                            <InputError message={errors.years_in_business} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="expected_monthly_purchase_band">
                                Expected monthly purchase (optional)
                            </Label>
                            <select
                                id="expected_monthly_purchase_band"
                                className={selectClassName}
                                value={data.expected_monthly_purchase_band}
                                onChange={(e) =>
                                    setData(
                                        'expected_monthly_purchase_band',
                                        e.target.value,
                                    )
                                }
                            >
                                <option value="">Select…</option>
                                {purchaseBands.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={errors.expected_monthly_purchase_band}
                            />
                        </div>
                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="referral_source">
                                How did you hear about us? (optional)
                            </Label>
                            <Input
                                id="referral_source"
                                value={data.referral_source}
                                onChange={(e) =>
                                    setData('referral_source', e.target.value)
                                }
                            />
                            <InputError message={errors.referral_source} />
                        </div>
                    </Section>

                    <Section
                        title="Principal place of business"
                        description="Registered office or main shop address."
                    >
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
                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="warehouse_address">
                                Additional warehouse / branch address (optional)
                            </Label>
                            <textarea
                                id="warehouse_address"
                                className={textAreaClassName}
                                value={data.warehouse_address}
                                onChange={(e) =>
                                    setData(
                                        'warehouse_address',
                                        e.target.value,
                                    )
                                }
                                rows={3}
                            />
                            <InputError message={errors.warehouse_address} />
                        </div>
                    </Section>

                    <Section
                        title="KYC — authorized person"
                        description="Government ID for the person named above. Details should match supporting documents you can provide on request."
                    >
                        <div className="grid gap-2">
                            <Label htmlFor="kyc_id_type">ID type</Label>
                            <select
                                id="kyc_id_type"
                                className={selectClassName}
                                value={data.kyc_id_type}
                                onChange={(e) =>
                                    setData('kyc_id_type', e.target.value)
                                }
                                required
                            >
                                <option value="">Select…</option>
                                {kycIdTypes.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.kyc_id_type} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="kyc_id_number">ID number</Label>
                            <Input
                                id="kyc_id_number"
                                value={data.kyc_id_number}
                                onChange={(e) =>
                                    setData('kyc_id_number', e.target.value)
                                }
                                required
                                autoComplete="off"
                            />
                            <InputError message={errors.kyc_id_number} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="dob">Date of birth (optional)</Label>
                            <Input
                                id="dob"
                                type="text"
                                value={data.dob}
                                onChange={(e) =>
                                    setData('dob', e.target.value)
                                }
                                placeholder="DD-MM-YYYY or as on ID"
                            />
                            <InputError message={errors.dob} />
                        </div>
                    </Section>

                    <Section
                        title="Tax & compliance (India)"
                        description="PAN and GSTIN must match your business records. TAN / Udyam are optional."
                    >
                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="pan_number">PAN (10 characters)</Label>
                            <Input
                                id="pan_number"
                                value={data.pan_number}
                                onChange={(e) =>
                                    setData(
                                        'pan_number',
                                        e.target.value.toUpperCase(),
                                    )
                                }
                                required
                                maxLength={10}
                                className="font-mono uppercase"
                                placeholder="ABCDE1234F"
                            />
                            <InputError message={errors.pan_number} />
                        </div>
                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="gstin">GSTIN (15 characters)</Label>
                            <Input
                                id="gstin"
                                value={data.gstin}
                                onChange={(e) =>
                                    setData(
                                        'gstin',
                                        e.target.value
                                            .toUpperCase()
                                            .replace(/\s/g, ''),
                                    )
                                }
                                required
                                maxLength={15}
                                className="font-mono uppercase"
                                placeholder="As on GST registration certificate"
                            />
                            <InputError message={errors.gstin} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="tan_number">TAN (optional)</Label>
                            <Input
                                id="tan_number"
                                value={data.tan_number}
                                onChange={(e) =>
                                    setData(
                                        'tan_number',
                                        e.target.value.toUpperCase(),
                                    )
                                }
                                className="font-mono uppercase"
                            />
                            <InputError message={errors.tan_number} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="msme_udyam_number">
                                MSME Udyam (optional)
                            </Label>
                            <Input
                                id="msme_udyam_number"
                                value={data.msme_udyam_number}
                                onChange={(e) =>
                                    setData(
                                        'msme_udyam_number',
                                        e.target.value,
                                    )
                                }
                            />
                            <InputError message={errors.msme_udyam_number} />
                        </div>
                    </Section>

                    <Section
                        title="Bank details for settlements"
                        description="Account must be in the name of the business or authorized signatory as per your mandate."
                    >
                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="bank_account_holder_name">
                                Account holder name
                            </Label>
                            <Input
                                id="bank_account_holder_name"
                                value={data.bank_account_holder_name}
                                onChange={(e) =>
                                    setData(
                                        'bank_account_holder_name',
                                        e.target.value,
                                    )
                                }
                                required
                            />
                            <InputError
                                message={errors.bank_account_holder_name}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="bank_name">Bank name</Label>
                            <Input
                                id="bank_name"
                                value={data.bank_name}
                                onChange={(e) =>
                                    setData('bank_name', e.target.value)
                                }
                                required
                            />
                            <InputError message={errors.bank_name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="bank_branch">Branch</Label>
                            <Input
                                id="bank_branch"
                                value={data.bank_branch}
                                onChange={(e) =>
                                    setData('bank_branch', e.target.value)
                                }
                                required
                            />
                            <InputError message={errors.bank_branch} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="bank_account_number">
                                Account number
                            </Label>
                            <Input
                                id="bank_account_number"
                                value={data.bank_account_number}
                                onChange={(e) =>
                                    setData(
                                        'bank_account_number',
                                        e.target.value,
                                    )
                                }
                                required
                                autoComplete="off"
                            />
                            <InputError message={errors.bank_account_number} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="bank_ifsc">IFSC code</Label>
                            <Input
                                id="bank_ifsc"
                                value={data.bank_ifsc}
                                onChange={(e) =>
                                    setData(
                                        'bank_ifsc',
                                        e.target.value.toUpperCase(),
                                    )
                                }
                                required
                                maxLength={11}
                                className="font-mono uppercase"
                                placeholder="e.g. HDFC0000123"
                            />
                            <InputError message={errors.bank_ifsc} />
                        </div>
                    </Section>
                </div>
            </FormContainer>
            <div className="mt-4 space-x-1 text-center text-sm text-muted-foreground">
                <span>Already approved?</span>
                <TextLink href={route('distributor.login')}>Log in</TextLink>
            </div>
        </AuthLayout>
    );
}

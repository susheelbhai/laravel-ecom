import { Head, useForm, usePage } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import type { FormEventHandler, ReactNode } from 'react';
import { useState } from 'react';

import { FormContainer } from '@/components/form/container/form-container';
import InputError from '@/components/form/input/input-error';
import Button from '@/components/ui/button/button';
import { Input } from '@/components/form/input/input';
import { Label } from '@/components/form/input/label';
import AuthLayout from '@/layouts/distributor/register-layout';
import { cn } from '@/lib/utils';

import { Container } from '@/components/ui/layout/container';
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
    state_id: string;
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
    cols = 2,
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
        businessConstitutions?: Option[];
        kycIdTypes?: Option[];
        purchaseBands?: Option[];
        states?: Option[];
    }>();
    const businessConstitutions = page.props.businessConstitutions ?? [];
    const kycIdTypes = page.props.kycIdTypes ?? [];
    const purchaseBands = page.props.purchaseBands ?? [];
    const states = page.props.states ?? [];

    const { data, setData, post, processing, errors } = useForm<Required<RegisterForm>>({
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
        state_id: '',
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
        if (submitUrl) post(submitUrl);
    };

    return (
        <AuthLayout
            fullWidth
            title="Distributor registration"
            description="Provide KYC, business, tax, and bank details as on your official documents. An administrator will verify your application before you can access the dashboard."
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
                        title="Account & primary contact"
                        description="Login credentials and the main person we should contact."
                        cols={3}
                    >
                        <Field label="Authorized signatory full name" error={errors.name} required full>
                            <Input
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                autoComplete="name"
                            />
                        </Field>
                        <Field label="Business email" error={errors.email} required>
                            <Input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                autoComplete="email"
                            />
                        </Field>
                        <Field label="Mobile number" error={errors.phone} required>
                            <Input
                                type="tel"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                autoComplete="tel"
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

                    {/* ── 2. Business details ── */}
                    <Section
                        title="Business / shop details"
                        description="Legal entity name and constitution as per registration."
                        cols={3}
                    >
                        <Field label="Legal business name" error={errors.legal_business_name} required span2>
                            <Input
                                value={data.legal_business_name}
                                onChange={(e) => setData('legal_business_name', e.target.value)}
                                placeholder="As per GST / incorporation certificate"
                            />
                        </Field>
                        <Field label="Trade / shop name (optional)" error={errors.trade_name}>
                            <Input
                                value={data.trade_name}
                                onChange={(e) => setData('trade_name', e.target.value)}
                                placeholder="If different from legal name"
                            />
                        </Field>
                        <Field label="Constitution of business" error={errors.business_constitution} required>
                            <select
                                className={selectClassName}
                                value={data.business_constitution}
                                onChange={(e) => setData('business_constitution', e.target.value)}
                            >
                                <option value="">Select…</option>
                                {businessConstitutions.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Designation of signatory" error={errors.authorized_signatory_designation} required>
                            <Input
                                value={data.authorized_signatory_designation}
                                onChange={(e) => setData('authorized_signatory_designation', e.target.value)}
                                placeholder="e.g. Proprietor, Managing Director"
                            />
                        </Field>
                        <Field label="Nature of business & product categories" error={errors.nature_of_business} required full>
                            <textarea
                                className={textAreaClassName}
                                value={data.nature_of_business}
                                onChange={(e) => setData('nature_of_business', e.target.value)}
                                rows={3}
                                placeholder="Describe goods you distribute, territories, and relevant experience."
                            />
                        </Field>
                        <Field label="Years in business (optional)" error={errors.years_in_business}>
                            <Input
                                type="number"
                                min={0}
                                max={100}
                                value={data.years_in_business}
                                onChange={(e) => setData('years_in_business', e.target.value)}
                            />
                        </Field>
                        <Field label="Expected monthly purchase (optional)" error={errors.expected_monthly_purchase_band}>
                            <select
                                className={selectClassName}
                                value={data.expected_monthly_purchase_band}
                                onChange={(e) => setData('expected_monthly_purchase_band', e.target.value)}
                            >
                                <option value="">Select…</option>
                                {purchaseBands.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
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
                        title="Principal place of business"
                        description="Registered office or main shop address."
                        cols={3}
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
                        <Field label="Additional warehouse / branch address (optional)" error={errors.warehouse_address} full>
                            <textarea
                                className={textAreaClassName}
                                value={data.warehouse_address}
                                onChange={(e) => setData('warehouse_address', e.target.value)}
                                rows={2}
                            />
                        </Field>
                    </Section>

                    {/* ── 4. KYC ── */}
                    <Section
                        title="KYC — authorized person"
                        description="Government ID for the person named above."
                        cols={3}
                    >
                        <Field label="ID type" error={errors.kyc_id_type} required>
                            <select
                                className={selectClassName}
                                value={data.kyc_id_type}
                                onChange={(e) => setData('kyc_id_type', e.target.value)}
                            >
                                <option value="">Select…</option>
                                {kycIdTypes.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </Field>
                        <Field label="ID number" error={errors.kyc_id_number} required>
                            <Input
                                value={data.kyc_id_number}
                                onChange={(e) => setData('kyc_id_number', e.target.value)}
                                autoComplete="off"
                            />
                        </Field>
                        <Field label="Date of birth (optional)" error={errors.dob}>
                            <Input
                                type="text"
                                value={data.dob}
                                onChange={(e) => setData('dob', e.target.value)}
                                placeholder="DD-MM-YYYY or as on ID"
                            />
                        </Field>
                    </Section>

                    {/* ── 5. Tax & compliance ── */}
                    <Section
                        title="Tax & compliance (India)"
                        description="PAN and GSTIN must match your business records."
                        cols={3}
                    >
                        <Field label="PAN (10 characters)" error={errors.pan_number} required>
                            <Input
                                value={data.pan_number}
                                onChange={(e) => setData('pan_number', e.target.value.toUpperCase())}
                                maxLength={10}
                                className="font-mono uppercase"
                                placeholder="ABCDE1234F"
                            />
                        </Field>
                        <Field label="GSTIN (15 characters)" error={errors.gstin} required>
                            <Input
                                value={data.gstin}
                                onChange={(e) => setData('gstin', e.target.value.toUpperCase().replace(/\s/g, ''))}
                                maxLength={15}
                                className="font-mono uppercase"
                                placeholder="As on GST registration certificate"
                            />
                        </Field>
                        <Field label="TAN (optional)" error={errors.tan_number}>
                            <Input
                                value={data.tan_number}
                                onChange={(e) => setData('tan_number', e.target.value.toUpperCase())}
                                className="font-mono uppercase"
                            />
                        </Field>
                        <Field label="MSME Udyam (optional)" error={errors.msme_udyam_number}>
                            <Input
                                value={data.msme_udyam_number}
                                onChange={(e) => setData('msme_udyam_number', e.target.value)}
                            />
                        </Field>
                    </Section>

                    {/* ── 6. Bank details ── */}
                    <Section
                        title="Bank details for settlements"
                        description="Account must be in the name of the business or authorized signatory."
                        cols={3}
                    >
                        <Field label="Account holder name" error={errors.bank_account_holder_name} required full>
                            <Input
                                value={data.bank_account_holder_name}
                                onChange={(e) => setData('bank_account_holder_name', e.target.value)}
                            />
                        </Field>
                        <Field label="Bank name" error={errors.bank_name} required>
                            <Input
                                value={data.bank_name}
                                onChange={(e) => setData('bank_name', e.target.value)}
                            />
                        </Field>
                        <Field label="Branch" error={errors.bank_branch} required>
                            <Input
                                value={data.bank_branch}
                                onChange={(e) => setData('bank_branch', e.target.value)}
                            />
                        </Field>
                        <Field label="Account number" error={errors.bank_account_number} required>
                            <Input
                                value={data.bank_account_number}
                                onChange={(e) => setData('bank_account_number', e.target.value)}
                                autoComplete="off"
                                className="font-mono"
                            />
                        </Field>
                        <Field label="IFSC code" error={errors.bank_ifsc} required>
                            <Input
                                value={data.bank_ifsc}
                                onChange={(e) => setData('bank_ifsc', e.target.value.toUpperCase())}
                                className="font-mono uppercase"
                                placeholder="SBIN0001234"
                            />
                        </Field>
                    </Section>

                </FormContainer>
            </Container>
        </AuthLayout>
    );
}

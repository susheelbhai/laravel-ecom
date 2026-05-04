import AuthLayoutTemplate from '../../themes/admin_default/auth/auth-card-layout';

export default function AuthLayout({
    children,
    title,
    description,
    fullWidth = false,
    ...props
}: {
    children: React.ReactNode;
    title: string;
    description: string;
    fullWidth?: boolean;
}) {
    return (
        <AuthLayoutTemplate
            title={title}
            description={description}
            fullWidth={fullWidth}
            {...props}
        >
            {children}
        </AuthLayoutTemplate>
    );
}

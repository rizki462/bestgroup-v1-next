import UserManagement from "./_components/user";

export const metadata = {
    title: 'User Management',
    viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
    },
    icons: {
        icon: '/images/bg.png',
    },
    description: 'Best Group',
    keywords: 'Best Group',
};

export default function UserManagementPage() {
    return (
        <UserManagement />
    );
};
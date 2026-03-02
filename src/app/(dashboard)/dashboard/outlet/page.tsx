import OutletManagement from "./_components/outlet";

export const metadata = {
    title: 'Outlet Management',
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

export default function OutletManagementPage() {
    return (
        <OutletManagement />
    );
};
import StockManagement from "./_components/stock";

export const metadata = {
    title: 'Stock Management',
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

export default function StocksManagementPage() {
    return (
        <StockManagement />
    );
};
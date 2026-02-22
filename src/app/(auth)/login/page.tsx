import Login from "./_components/login"

export const metadata = {
    title: 'Best Group',
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

export default function LoginPage() {
    return <Login />
};
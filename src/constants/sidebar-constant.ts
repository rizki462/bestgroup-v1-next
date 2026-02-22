import { Archive, Clipboard, LayoutDashboard, Settings, ShoppingCart, User, Wrench } from "lucide-react";

export const SIDEBAR_MENU_LIST = {
    admin: [
        {
            title: "Dashboard",
            url: '/dashboard',
            icon: LayoutDashboard
        },
        {
            title: "Penjualan",
            url: '/penjualan',
            icon: ShoppingCart
        },
        {
            title: "Servis",
            url: '/servis',
            icon: Wrench
        },
        {
            title: "Persediaan",
            url: '/persediaan',
            icon: Archive
        },
        {
            title: "Laporan",
            url: '/laporan',
            icon: Clipboard
        },
        {
            title: "Kelola Pengguna",
            url: '/dashboard/user',
            icon: User
        },
        {
            title: "Pengaturan",
            url: '/pengaturan',
            icon: Settings
        },
    ],
    teknisi: [
        {
            title: "Dashboard",
            url: '/teknisi',
            icon: LayoutDashboard
        },
        {
            title: "Servis",
            url: '/servis',
            icon: Wrench
        },
        {
            title: "Pengaturan",
            url: '/pengaturan',
            icon: Settings
        },
    ],
    
};

export type SidebarMenuKey = keyof typeof SIDEBAR_MENU_LIST;
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
            url: '/dashboard/penjualan',
            icon: ShoppingCart
        },
        {
            title: "Servis",
            url: '/dashboard/servis',
            icon: Wrench
        },
        {
            title: "Persediaan",
            url: '/dashboard/persediaan',
            icon: Archive
        },
        {
            title: "Laporan",
            url: '/dashboard/laporan',
            icon: Clipboard
        },
        {
            title: "Kelola Pengguna",
            url: '/dashboard/user',
            icon: User
        },
        {
            title: "Pengaturan",
            url: '/dashboard/pengaturan',
            icon: Settings
        },
    ],
    teknisi: [
        {
            title: "Dashboard",
            url: '/dashboard',
            icon: LayoutDashboard
        },
        {
            title: "Servis",
            url: '/dashboard/servis',
            icon: Wrench
        },
        {
            title: "Pengaturan",
            url: '/dashboard/pengaturan',
            icon: Settings
        },
    ],
    
};

export type SidebarMenuKey = keyof typeof SIDEBAR_MENU_LIST;
import {
  Archive,
  Clipboard,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Store,
  User,
  Wrench,
  LucideIcon,
  Package,
  Handbag,
  Menu,
  ShieldUser,
  ChartColumnBig,
  Warehouse,
  Wallet,
  Shield,
  Toolbox,
} from "lucide-react";

export type SidebarMenuItemRegular = {
  title: string;
  url: string;
  icon: LucideIcon;
};
export type SidebarMenuItemGroup = {
  title: string;
  icon: LucideIcon;
  items: Array<{ title: string; url: string; icon: LucideIcon }>;
};
export type SidebarMenuItem = SidebarMenuItemRegular | SidebarMenuItemGroup;

export const SIDEBAR_MENU_LIST: Record<string, SidebarMenuItem[]> = {
  admin: [
    {
      title: "Main Menu",
      url: "/dashboard",
      icon: Menu,
    },
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      items: [
        {
          title: "Bestlaptop",
          url: "#",
          icon: Store,
        },
        {
          title: "Bestservice",
          url: "#",
          icon: Store,
        },
        {
          title: "Analitik",
          url: "#",
          icon: ChartColumnBig,
        },
      ],
    },
    {
      title: "Persediaan",
      icon: Package,
      items: [
        {
          title: "Gudang",
          url: "#",
          icon: Store,
        },
        {
          title: "Permintaan Barang",
          url: "#",
          icon: Clipboard,
        },
        {
          title: "Barang per Gudang",
          url: "/dashboard/persediaan",
          icon: Archive,
        },
        {
          title: "Barang dan Jasa",
          url: "#",
          icon: Toolbox,
        },
      ],
    },
    {
      title: "Layanan dan Penjualan",
      icon: Handbag,
      items: [
        {
          title: "Servis",
          url: "/dashboard/servis",
          icon: Wrench,
        },
        {
          title: "Penjualan",
          url: "/dashboard/penjualan",
          icon: ShoppingCart,
        },
      ],
    },
    {
      title: "Garansi",
      url: "/dashboard/garansi",
      icon: Shield,
    },
    {
      title: "Keuangan",
      url: "/dashboard/keuangan",
      icon: Wallet,
    },
    {
      title: "HR & Payrol",
      icon: ShieldCheck,
      items: [
        {
          title: "Kelola Pengguna",
          url: "/dashboard/user",
          icon: User,
        },
        {
          title: "Kelola Outlet",
          url: "/dashboard/outlet",
          icon: Warehouse,
        },
      ],
    },
    {
      title: "Pengaturan",
      url: "/dashboard/pengaturan",
      icon: Settings,
    },
  ],
  teknisi: [
    {
      title: "Main Menu",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Servis",
      url: "/dashboard/servis",
      icon: Wrench,
    },
    {
      title: "Pengaturan",
      url: "/dashboard/pengaturan",
      icon: Settings,
    },
  ],
};

export type SidebarMenuKey = keyof typeof SIDEBAR_MENU_LIST;

export function hasItems(item: SidebarMenuItem): item is {
  title: string;
  icon: LucideIcon;
  items: Array<{ title: string; url: string; icon: LucideIcon }>;
} {
  return "items" in item;
}
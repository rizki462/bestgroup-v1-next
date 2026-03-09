"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  SIDEBAR_MENU_LIST,
  SidebarMenuKey,
} from "@/constants/sidebar-constant";
import { useAuthStore } from "@/stores/auth-store";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function MenuDashboardView() {
  const profile = useAuthStore((state) => state.profile);

  const role = profile?.role as SidebarMenuKey;
  const menus = SIDEBAR_MENU_LIST[role] || [];

  const allAvailableMenus = menus.flatMap((menu) => {
    if ("items" in menu && menu.items) {
      return menu.items;
    }

    if ("url" in menu) {
      return [menu];
    }
    return [];
  });

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-bold tracking-tight">
          Selamat Datang, {profile?.name}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Silakan pilih modul di bawah ini untuk mengelola operasional <b> PT. BestGroup</b>.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center md:justify-items-start">
        {allAvailableMenus.map((menu) => (
          <Link key={menu.title} href={menu.url} className="group w-full flex justify-center md:justify-start">
            <Card className="h-56 w-56 flex items-center justify-center border-2 transition-all duration-300 hover:border-teal-200 hover:shadow-lg hover:-translate-y-1 shadow-gray-200 hover:shadow-teal-100">
              <CardContent className="flex flex-col items-center justify-center text-center p-0">
                <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 transition-colors group-hover:bg-teal-500 group-hover:text-white">
                  {menu.icon && <menu.icon size={32} />}
                </div>

                <h3 className="text-lg font-bold transition-colors group-hover:text-teal-600">
                  {menu.title}
                </h3>

                <div className="mt-6 flex items-center text-sm font-semibold text-teal-600 ">
                  Buka Modul <ArrowRight className="ml-2 size-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
"use client";

import { EllipsisVertical, LogOut, User, ChevronRight } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  SIDEBAR_MENU_LIST,
  SidebarMenuKey,
  hasItems,
} from "@/constants/sidebar-constant";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { signOut } from "@/actions/auth-action";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import Image from "next/image";

export default function AppSidebar() {
  const { isMobile, state } = useSidebar();
  const pathname = usePathname();
  const profile = useAuthStore((state) => state.profile);

  const isCollapsed = state === "collapsed";
  const role = profile?.role as SidebarMenuKey;
  const menuList = SIDEBAR_MENU_LIST[role] || [];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center gap-3 cursor-default">
                <Image src="/images/bg.png" alt="logo" width={32} height={32} />
                {!isCollapsed && (
                  <span className="text-xl font-bold transition-all duration-300">
                    Best Group
                  </span>
                )}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-3 mt-5">
              {menuList.map((item) => {
                // Cek apakah menu ini punya sub-menu
                if (hasItems(item)) {
                  // Cek apakah ada sub-item yang URL-nya aktif
                  const isSubActive = item.items.some(
                    (sub) => pathname === sub.url
                  );

                  return (
                    <SidebarMenuItem key={item.title}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuButton
                            tooltip={item.title}
                            className={cn(
                              "h-11 px-3 text-slate-600 transition-all duration-200 rounded-lg",
                              isSubActive
                                ? "bg-teal-500 text-white hover:bg-teal-600 hover:text-white shadow-md shadow-teal-100"
                                : "hover:bg-teal-50"
                            )}
                          >
                            {item.icon && (
                              <item.icon className={cn("size-5 shrink-0", isSubActive ? "text-white" : "text-slate-500")} />
                            )}
                            <span className="flex-1 truncate">
                              {item.title}
                            </span>
                            <ChevronRight className={cn(
                              "ml-auto size-4 transition-transform duration-200",
                              isSubActive ? "text-white" : "text-slate-400"
                            )} />
                          </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          className="min-w-56 rounded-xl shadow-xl border-slate-200 p-1"
                          side={isMobile ? "bottom" : "right"}
                          align="start"
                          sideOffset={10}
                        >
                          <DropdownMenuLabel className="my-2">
                            <span className="text-sm font-semibold">
                              {item.title}
                            </span>
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-red-500 mx-1 mb-2" />
                          <DropdownMenuGroup>
                            {item.items.map((sub) => {
                               const isCurrent = pathname === sub.url;
                               return (
                                <DropdownMenuItem key={sub.title} asChild>
                                  <Link
                                    href={sub.url}
                                    className={cn(
                                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 h-auto transition-all cursor-pointer",
                                      isCurrent
                                        ? "bg-teal-500 text-white hover:bg-teal-600 hover:text-white shadow-md shadow-teal-100"
                                        : "hover:bg-teal-50 text-slate-600"
                                    )}
                                  >
                                    <sub.icon className={cn("size-4 shrink-0", isCurrent ? "text-white" : "text-slate-400")} />
                                    <span>{sub.title}</span>
                                  </Link>
                                </DropdownMenuItem>
                               );
                            })}
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuItem>
                  );
                }
                // Menu Tanpa Sub-Menu
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={cn(
                        "h-11 px-3 transition-all text-slate-600 duration-200 rounded-lg",
                        isActive
                          ? "bg-teal-500 text-white hover:bg-teal-600 hover:text-white shadow-md shadow-teal-100"
                          : "hover:bg-teal-50"
                      )}
                    >
                      <Link href={item.url || "#"}>
                        {item.icon && (
                          <item.icon className={cn("size-5 shrink-0", isActive ? "text-white" : "text-slate-500")} />
                        )}
                        <span className="flex-1 truncate">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent shadow-sm border border-transparent hover:border-slate-200 rounded-xl"
                >
                  <Avatar className="h-8 w-8 rounded-lg border">
                    <AvatarImage src={profile.avatar_url} alt={profile.name} />
                    <AvatarFallback className="rounded-lg bg-teal-100 text-teal-700 font-bold uppercase">
                      {profile.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="leading-tight text-left overflow-hidden">
                    <h4 className="truncate font-bold text-slate-700">{profile.name}</h4>
                    <p className="text-slate-400 truncate text-[10px] font-bold uppercase tracking-tighter">
                      {profile.role}
                    </p>
                  </div>
                  <EllipsisVertical className="ml-auto size-4 text-slate-400" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="min-w-56 rounded-xl shadow-xl border-slate-200"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={10}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-3 py-3">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={profile.avatar_url} alt={profile.name} />
                      <AvatarFallback className="rounded-lg bg-teal-50 text-teal-700 font-bold uppercase">
                        {profile.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-bold text-slate-700">{profile.name}</span>
                      <span className="truncate text-[10px] uppercase font-bold text-slate-400 tracking-tighter">{profile.role}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup className="p-1">
                  <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-teal-50" asChild>
                    <Link href="/dashboard/pengaturan">
                      <User className="mr-2 size-4 text-slate-500" />
                      <span className="font-medium text-slate-600">Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="cursor-pointer rounded-lg text-red-600 focus:text-red-700 focus:bg-red-50"
                  >
                    <LogOut className="mr-2 size-4" />
                    <span className="font-medium">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
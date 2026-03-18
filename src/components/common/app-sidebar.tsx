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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
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
              <div className="flex items-center gap-3">
                <Image src="/images/bg.png" alt="logo" width={32} height={32} />
                <span
                  className={cn(
                    "text-xl font-bold transition-opacity",
                    isCollapsed ? "opacity-0" : "opacity-100",
                  )}
                >
                  Best Group
                </span>
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
                if (hasItems(item)) {
                  const isSubActive = item.items.some(
                    (sub) => sub.url === sub.url,
                  );

                  return (
                    <Collapsible
                      key={item.title}
                      // defaultOpen={isSubActive}
                      asChild
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={item.title}
                            className="h-11 px-3"
                          >
                            {item.icon && (
                              <item.icon className="size-5 shrink-0" />
                            )}
                            <span className="flex-1 truncate">
                              {item.title}
                            </span>
                            <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />{" "}
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub
                            className="ml-5 border-l border-slate-200 py-1"
                          >
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild>
                                  <Link
                                    href={subItem.url}
                                    className={cn(
                                      "flex w-full items-center gap-3 rounded-md px-3 py-2 h-auto transition-all",
                                      pathname === subItem.url
                                        ? "bg-teal-500  hover:bg-teal-500 text-white hover:text-white"
                                        : "hover:bg-sidebar-accent",
                                    )}
                                  >
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <Link
                        href={item.url}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-md px-3 py-2 h-auto transition-all",
                          pathname === item.url
                            ? "bg-teal-500 text-white hover:bg-teal-500 hover:text-white"
                            : "hover:bg-sidebar-accent",
                        )}
                      >
                        {item.icon && <item.icon className="size-4 shrink-0" />}
                        <span>{item.title}</span>
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
                  className="data-[state=open]:bg-sidebar-accent shadow-sm border border-transparent hover:border-slate-200"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={profile.avatar_url} alt={profile.name} />
                    <AvatarFallback className="rounded-lg bg-teal-100 text-teal-700">
                      {profile.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="leading-tight text-left overflow-hidden">
                    <h4 className="truncate font-medium">{profile.name}</h4>
                    <p className="text-muted-foreground truncate text-xs capitalize">
                      {profile.role}
                    </p>
                  </div>
                  <EllipsisVertical className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="min-w-56 rounded-lg shadow-xl border-slate-200"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={10}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-2 py-2">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={profile.avatar_url}
                        alt={profile.name}
                      />
                      <AvatarFallback className="rounded-lg">
                        {profile.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {profile.name}
                      </span>
                      <span className="truncate text-xs">{profile.role}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link href="/dashboard/pengaturan">
                      <User className="mr-2 size-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 size-4" />
                    Logout
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

import { constructMetadata } from "@/components/common/metadata";
import MenuDashboardView from "@/components/views/dashboard/menu-view";

export const metadata = constructMetadata({
  title: "Main Menu",
});

export default function MenuDashboardPage() {
  return <MenuDashboardView />;
}
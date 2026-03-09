import OutletManagement from "./_components/outlet";
import { constructMetadata } from "@/components/common/metadata";

export const metadata = constructMetadata({
    title: 'Outlet Management',
});

export default function OutletManagementPage() {
    return (
        <OutletManagement />
    );
};
import ServiceManagement from "./_components/service";
import { constructMetadata } from "@/components/common/metadata";

export const metadata = constructMetadata({
    title: 'Service Management',
});

export default function ServiceManagementPage() {
    return (
        <ServiceManagement />
    );
};
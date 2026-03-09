import UserManagement from "./_components/user";
import { constructMetadata } from "@/components/common/metadata";

export const metadata = constructMetadata({
    title: 'User Management',
});

export default function UserManagementPage() {
    return (
        <UserManagement />
    );
};
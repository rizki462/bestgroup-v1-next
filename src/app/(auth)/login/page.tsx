import Login from "./_components/login"
import { constructMetadata } from "@/components/common/metadata";

export const metadata = constructMetadata({
    title: 'Login',
});

export default function LoginPage() {
    return <Login />
};
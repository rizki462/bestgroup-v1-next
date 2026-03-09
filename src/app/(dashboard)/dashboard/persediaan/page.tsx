import StockManagement from "./_components/stock";
import { constructMetadata } from "@/components/common/metadata";

export const metadata = constructMetadata({
    title: 'Stock Management',
});

export default function StocksManagementPage() {
    return (
        <StockManagement />
    );
};
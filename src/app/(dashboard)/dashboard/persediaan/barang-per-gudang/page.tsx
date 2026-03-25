import StockManagement from "./_components/stock";
import { constructMetadata } from "@/components/common/metadata";

export const metadata = constructMetadata({
    title: 'Barang per Gudang',
});

export default function StocksManagementPage() {
    return (
        <StockManagement />
    );
};
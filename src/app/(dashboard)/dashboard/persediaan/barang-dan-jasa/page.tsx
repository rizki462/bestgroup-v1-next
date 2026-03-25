import { constructMetadata } from "@/components/common/metadata";
import { AddKategoriDialog } from "./_components/add-kategori-dialog";
import { Button } from "@/components/ui/button";
import { PackageSearch, Plus } from "lucide-react";

export const metadata = constructMetadata({
  title: "Barang dan Jasa",
});

export default function barangJasaPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:item-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Barang dan Jasa</h1>
          <p className="text-sm text-slate-500">
            Kelola data persediaan, jasa, dan barang
          </p>
        </div>

        <div className="flex item-center gap-3">
          <AddKategoriDialog />
          <Button>
            <Plus className="size-4" />
            Tambah Barang
          </Button>
        </div>

      </div>

      <div className="bg-white border rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px] border-dashed">
        <div className="size-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <PackageSearch className="size-8 text-slate-400" />
        </div>
        <p className="text-slate-500">Belum ada barang atau jasa</p>
      </div>
    </div>
  );
}

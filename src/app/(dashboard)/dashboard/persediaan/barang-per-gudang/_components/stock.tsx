"use client";

import DataTable from "@/components/common/data-table";
import DropdownAction from "@/components/common/dropdown-action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"; // Pastikan import Select sudah ada
import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Trash2, Filter } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Stock } from "@/validations/stock-validation";
import Image from "next/image";
import { cn, convertIDR } from "@/lib/utils";
import { HEADER_TABLE_STOCK, KATEGORI_LIST } from "@/constants/stock-constant";
import { OUTLET_LIST } from "@/constants/auth-constant";
import DialogCreateStock from "./dialog-create-stock";
import DialogDeleteStock from "./dialog-delete-stock";
import DialogUpdateStock from "./dialog-update-stock";

export default function StockManagement() {
  const supabase = createClient();
  const {
    currentPage,
    currentLimit,
    currentSearch,
    handleChangePage,
    handleChangeLimit,
    handleChangeSearch,
  } = useDataTable();

  // State untuk Filter
  const [filterKategori, setFilterKategori] = useState<string>("all");
  const [filterOutlet, setFilterOutlet] = useState<string>("all");

  const {
    data: stocks,
    isLoading,
    refetch,
  } = useQuery({
    // filter ke queryKey agar data refetch saat filter berubah
    queryKey: ["stocks", currentPage, currentLimit, currentSearch, filterKategori, filterOutlet],
    queryFn: async () => {
      let query = supabase
        .from("stocks")
        .select("*", { count: "exact" })
        .range((currentPage - 1) * currentLimit, currentPage * currentLimit - 1)
        .order("created_at");

      // Logic Filter Kategori
      if (filterKategori !== "all") {
        query = query.eq("kategori", filterKategori);
      }

      // Logic Filter Outlet
      if (filterOutlet !== "all") {
        query = query.eq("outlet_id", filterOutlet);
      }

      // Logic Search
      if (currentSearch) {
        query.or(
          `nama.ilike.%${currentSearch}%,deskripsi.ilike.%${currentSearch}%`
        );
      }

      const result = await query;

      if (result.error)
        toast.error("Get Stock data failed", {
          description: result.error.message,
        });

      return result;
    },
  });

  const [selectedAction, setSelectedAction] = useState<{
    data: Stock;
    type: "update" | "delete";
  } | null>(null);

  const handleChangeAction = (open: boolean) => {
    if (!open) setSelectedAction(null);
  };

  const filteredData = useMemo(() => {
    return (stocks?.data || []).map((stock: Stock, index) => {
      const isActuallyAvailable = stock.jumlah > 0;

      return [
        currentLimit * (currentPage - 1) + index + 1,
        <div className="flex items-center gap-2" key={`name-${stock.id}`}>
          <Image
            src={stock.image_url as string}
            alt={stock.nama}
            width={40}
            height={40}
            className="rounded object-cover h-10 w-10"
          />
          {stock.nama}
        </div>,
        stock.deskripsi,
        <div key={`cat-${stock.id}`}>{stock.kategori}</div>,
        <div key={`buy-${stock.id}`} className="text-red-600 font-medium">
          {convertIDR(stock.harga_beli)}
        </div>,
        <div key={`sell-${stock.id}`} className="text-green-600 font-medium">
          {convertIDR(stock.harga_jual)}
        </div>,
        <div key={`qty-${stock.id}`}>
          <p className={cn(stock.jumlah === 0 && "text-red-600 font-bold")}>
            {stock.jumlah}
          </p>
        </div>,
        <div
          key={`status-${stock.id}`}
          className={cn(
            "px-2 py-1 rounded-full text-white text-[10px] w-fit font-semibold uppercase",
            isActuallyAvailable ? "bg-green-600" : "bg-red-600",
          )}
        >
          {isActuallyAvailable ? "Available" : "Not Available"}
        </div>,
        <div key={`outlet-${stock.id}`} className="font-mono text-xs">
          {stock.outlet_id}
        </div>,
        <DropdownAction
          key={`action-${stock.id}`}
          menu={[
            {
              label: (
                <span className="flex items-center gap-2">
                  <Pencil size={16} /> Edit
                </span>
              ),
              action: () => setSelectedAction({ data: stock, type: "update" }),
            },
            {
              label: (
                <span className="flex items-center gap-2">
                  <Trash2 size={16} className="text-red-400" /> Delete
                </span>
              ),
              variant: "destructive",
              action: () => setSelectedAction({ data: stock, type: "delete" }),
            },
          ]}
        />,
      ];
    });
  }, [stocks, currentPage, currentLimit]);

  const totalPages = useMemo(() => {
    return stocks && stocks.count !== null
      ? Math.ceil(stocks.count / currentLimit)
      : 0;
  }, [stocks, currentLimit]);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Barang per Gudang</h1>
        
        <div className="flex flex-col lg:flex-row gap-3 justify-between">
          {/* Group Filter & Search */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Input
                className="w-full bg-white lg:w-62.5 pl-4"
                placeholder="Cari nama atau deskripsi..."
                onChange={(e) => handleChangeSearch(e.target.value)}
              />
            </div>

            {/* Quick Filter Kategori */}
            <Select onValueChange={setFilterKategori} defaultValue="all">
              <SelectTrigger className="w-35 md:w-45 bg-white">
                <Filter className="size-3 mr-2 text-slate-400" />
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {KATEGORI_LIST.map((kat) => (
                  <SelectItem key={kat.value} value={kat.value}>
                    {kat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Quick Filter Outlet */}
            <Select onValueChange={setFilterOutlet} defaultValue="all">
              <SelectTrigger className="w-35 md:w-45 bg-white">
                <SelectValue placeholder="Outlet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Outlet</SelectItem>
                {OUTLET_LIST.map((out) => (
                  <SelectItem key={out.value} value={out.value}>
                    {out.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-teal-500 hover:bg-teal-600 text-white w-full lg:w-auto">
                Create Stock
              </Button>
            </DialogTrigger>
            <DialogCreateStock refetch={refetch} />
          </Dialog>
        </div>
      </div>

      <DataTable
        header={HEADER_TABLE_STOCK}
        data={filteredData}
        isLoading={isLoading}
        totalPages={totalPages}
        currentPage={currentPage}
        currentLimit={currentLimit}
        onChangePage={handleChangePage}
        onChangeLimit={handleChangeLimit}
      />

      <DialogUpdateStock
        open={selectedAction !== null && selectedAction.type === "update"}
        refetch={refetch}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      />
      <DialogDeleteStock
        open={selectedAction !== null && selectedAction.type === "delete"}
        refetch={refetch}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      />
    </div>
  );
}
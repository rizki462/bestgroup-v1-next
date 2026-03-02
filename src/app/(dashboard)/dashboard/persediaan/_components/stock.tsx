"use client";

import DataTable from "@/components/common/data-table";
import DropdownAction from "@/components/common/dropdown-action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useDataTable from "@/hooks/use-data-table";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Stock } from "@/validations/stock-validation";
import Image from "next/image";
import { cn, convertIDR } from "@/lib/utils";
import { HEADER_TABLE_STOCK } from "@/constants/stock-constant";
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
  const {
    data: stocks,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["stocks", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      const query = supabase
        .from("stocks")
        .select("*", { count: "exact" })
        .range((currentPage - 1) * currentLimit, currentPage * currentLimit - 1)
        .order("created_at");

      if (currentSearch) {
        query.or(
          `nama.ilike.%${currentSearch}%,kategori.ilike.%${currentSearch}%,outlet_id.ilike.%${currentSearch}%`,
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
          className="rounded object-cover"
        />
        {stock.nama}
      </div>,
      stock.deskripsi,
      <div key={`cat-${stock.id}`}>
        <p>{stock.kategori}</p>
      </div>,
      <div key={`buy-${stock.id}`}>
        <p className="font-medium text-red-600">
          {convertIDR(stock.harga_beli)}
        </p>
      </div>,
      <div key={`sell-${stock.id}`}>
        <p className="font-medium text-green-600">
          {convertIDR(stock.harga_jual)}
        </p>
      </div>,
      <div key={`qty-${stock.id}`}>
        <p className={cn(stock.jumlah === 0 && "text-red-600 font-bold")}>
          {stock.jumlah}
        </p>
      </div>,
      <div
        key={`status-${stock.id}`}
        className={cn(
          "px-2 py-1 rounded-full text-white text-xs w-fit font-semibold",
          isActuallyAvailable ? "bg-green-600" : "bg-red-600",
        )}
      >
        {isActuallyAvailable ? "Available" : "Not Available"}
      </div>,
      <div key={`outlet-${stock.id}`}>
        <p>{stock.outlet_id}</p>
      </div>,

      <DropdownAction
        key={`action-${stock.id}`}
        menu={[
          {
            label: (
              <span className="flex item-center gap-2">
                <Pencil size={16} />
                Edit
              </span>
            ),
            action: () => {
              setSelectedAction({
                data: stock,
                type: "update",
              });
            },
          },
          {
            label: (
              <span className="flex item-center gap-2">
                <Trash2 size={16} className="text-red-400" />
                Delete
              </span>
            ),
            variant: "destructive",
            action: () => {
              setSelectedAction({
                data: stock,
                type: "delete",
              });
            },
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
  }, [stocks]);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-2xl font-bold">Stock Management</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search by name or category"
            onChange={(e) => handleChangeSearch(e.target.value)}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-teal-500 hover:bg-teal-500 text-white">Create</Button>
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

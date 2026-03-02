'use client';

import DropdownAction from '@/components/common/dropdown-action';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import useDataTable from '@/hooks/use-data-table';
import { createClient } from '@/lib/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Pencil, Phone, Store, Trash2, Search } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import DialogCreateUser from './dialog-create-user'; // Pastikan nama file sesuai (mungkin DialogCreateOutlet?)
import { Outlet } from '@/types/outlet';
// import PaginationCustom from '@/components/common/pagination-custom'; // Asumsi anda punya komponen pagination terpisah

export default function OutletManagement() {
  const supabase = createClient();
  const {
    currentPage,
    currentLimit,
    currentSearch,
    handleChangePage,
    handleChangeSearch,
  } = useDataTable();

  const {
    data: outlets,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['outlets', currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      const result = await supabase
        .from('outlets')
        .select('*', { count: 'exact' })
        .range((currentPage - 1) * currentLimit, currentPage * currentLimit - 1)
        .order('created_at')
        .ilike('nama', `%${currentSearch}%`);

      if (result.error)
        toast.error('Get Outlet data failed', {
          description: result.error.message,
        });

      return result;
    },
  });

  const [selectedAction, setSelectedAction] = useState<{
    data: Outlet;
    type: 'update' | 'delete';
  } | null>(null);

  const totalPages = outlets && outlets.count !== null
    ? Math.ceil(outlets.count / currentLimit)
    : 0;

  return (
    <div className="w-full space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Outlet Management</h1>
          <p className="text-muted-foreground">Kelola informasi lokasi dan kontak seluruh outlet.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama outlet..."
              className="pl-8"
              onChange={(e) => handleChangeSearch(e.target.value)}
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-700">Create</Button>
            </DialogTrigger>
            <DialogCreateUser refetch={refetch} />
          </Dialog>
        </div>
      </div>

      {/* CARD GRID SECTION */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {outlets?.data?.map((outlet) => (
            <Card key={outlet.id} className="overflow-hidden border-t-4 border-t-teal-500 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <Badge variant="outline" className="mb-1 text-xs font-mono">
                      {outlet.kode_outlet}
                    </Badge>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Store className="size-4 text-teal-600" />
                      {outlet.nama}
                    </CardTitle>
                  </div>
                  <DropdownAction
                    menu={[
                      {
                        label: (
                          <span className="flex items-center gap-2">
                            <Pencil className="size-4" />
                            Edit
                          </span>
                        ),
                        action: () => setSelectedAction({ data: outlet, type: 'update' }),
                      },
                      {
                        label: (
                          <span className="flex items-center gap-2">
                            <Trash2 className="size-4 text-red-500" />
                            Delete
                          </span>
                        ),
                        variant: 'destructive',
                        action: () => setSelectedAction({ data: outlet, type: 'delete' }),
                      },
                    ]}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pb-4">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="size-4 mt-0.5 shrink-0 text-teal-600" />
                  <p className="line-clamp-2">{outlet.alamat}, {outlet.kota}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="size-4 shrink-0 text-teal-600" />
                  <p>{outlet.telepon || '-'}</p>
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex justify-between items-center border-t bg-slate-50/50">
                <span className="text-xs text-muted-foreground font-medium">Status</span>
                <Badge 
                  variant={outlet.is_active ? "default" : "destructive"} 
                  className={outlet.is_active ? "bg-teal-500 hover:bg-teal-600" : ""}
                >
                  {outlet.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* PAGINATION SECTION */}
      {/* {!isLoading && totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <PaginationCustom 
            totalPages={totalPages} 
            currentPage={currentPage} 
            onChangePage={handleChangePage} 
          />
        </div>
      )} */}

      {/* RENDER DIALOG UPDATE & DELETE DISINI (SAMA SEPERTI SEBELUMNYA) */}
    </div>
  );
}
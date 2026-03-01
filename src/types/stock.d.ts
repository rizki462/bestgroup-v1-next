export type StockFormState = {
  status?: string;
  errors?: {
    id?: string[];
    nama?: string[];
    deskripsi?: string[];
    harga_beli?: string[];
    harga_jual?: string[];
    kategori?: string[];
    jumlah?: string[];
    image_url: string[];
    is_available?: string[];
    _form?: string[];
  };
};
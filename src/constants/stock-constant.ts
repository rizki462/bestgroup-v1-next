export const HEADER_TABLE_STOCK = [
  "No",
  "Nama",
  "Deskripsi",
  "Kategori",
  "Harga Beli",
  "Harga Jual",
  "Jumlah",
  "Available",
  "Action",
];

export const KATEGORI_LIST = [
  { value: "Keyboard", label: "Keyboard" },
  { value: "LCD", label: "LCD" },
  { value: "HDD", label: "HDD" },
  { value: "SSD", label: "SSD" },
  { value: "RAM", label: "RAM" },
  { value: "Baterai", label: "Baterai" },
  { value: "Charger", label: "Charger" },
  { value: "Speaker", label: "Speaker" },
];

export const INITIAL_STOCK = {
  nama: "",
  deskripsi: "",
  harga_beli: "",
  harga_jual: "",
  jumlah: "",
  kategori: "",
  image_url: "",
  is_available: "true",
};

export const INITIAL_STATE_STOCK = {
  status: "idle",
  errors: {
    id: [],
    nama: [],
    deskripsi: [],
    harga_beli: [],
    harga_jual: [],
    jumlah: [],
    is_available: [],
    _form: [],
  },
};

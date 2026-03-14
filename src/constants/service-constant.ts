export const SERVICE_STATUS = {
  antrian: "Antrian",
  konfirmasi: "Nunggu Konfirmasi",
  part: "Menunggu Part",
  pengerjaan: "Sedang Dikerjakan",
  selesai: "Selesai",
  diambil: "Sudah Diambil",
  batal: "Cancel",
};

export const SERVICE_STATUS_COLOR = {
  antrian: "gray",
  konfirmasi: "blue",
  part: "blue",
  pengerjaan: "blue",
  selesai: "green",
  diambil: "green",
  batal: "red",
};

export const INITIAL_STATE_CREATE_TICKET = {
  status: "idle",
  errors: {
    nama_pelanggan: [],
    no_wa: [],
    unit_laptop: [],
    keluhan: [],
    status: [],
    _form: [],
  },
};

export const INITIAL_CREATE_TICKET_FORM = {
  nama_pelanggan: "",
  no_wa: "",
  unit_laptop: "",
  keluhan: "",
  status: "antrian",
};

export const INITIAL_STATE_SERVICE = {
  status: "idle",
  message: "",
  errors: {},
};

export type ServiceStatus = keyof typeof SERVICE_STATUS;

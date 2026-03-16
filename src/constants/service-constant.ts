export const SERVICE_STATUS = {
  antrian: "Antrian",
  konfirmasi: "Nunggu Konfirmasi",
  part: "Nunggu Part",
  pengerjaan: "Sedang Dikerjakan",
  selesai: "Selesai",
  diambil: "Sudah Diambil",
  batal: "Batal",
};

export const SERVICE_STATUS_COLOR = {
  antrian: "gray",
  konfirmasi: "blue",
  part: "blue",
  pengerjaan: "blue",
  selesai: "green",
  diambil: "green",
  batal: "red",
} as const;

export const STATUS_UI_STYLE = {
  gray: {
    header: "bg-slate-500 text-white",
    cardBadge: "bg-slate-100 text-slate-600 border-l-slate-400",
    textStatus: "bg-slate-600",
  },
  blue: {
    header: "bg-blue-600 text-white",
    cardBadge: "bg-blue-50 text-blue-700 border-l-blue-500",
    textStatus: "bg-blue-600",
  },
  green: {
    header: "bg-emerald-600 text-white",
    cardBadge: "bg-emerald-50 text-emerald-700 border-l-emerald-500",
    textStatus: "bg-emerald-600",
  },
  red: {
    header: "bg-red-600 text-white",
    cardBadge: "bg-red-50 text-red-700 border-l-red-500",
    textStatus: "bg-red-600",
  },
} as const;

export const getServiceStyle = (status: string) => {
  const colorKey = SERVICE_STATUS_COLOR[status as keyof typeof SERVICE_STATUS_COLOR] || "gray";
  const uiStyle = STATUS_UI_STYLE[colorKey as ServiceStatusColor];

  return {
    colorKey,
    uiStyle,
  };
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

export const INSPEKSI_LIST = [
  "RAM",
  "Storage",
  "Casing",
  "Engsel",
  "LCD",
  "Keyboard",
  "Charger",
  "Port",
  "Baut",
  "Speaker",
  "Wifi",
  "Kamera",
  "Bluetooth",
  "Microphone",
];

export type ServiceStatus = keyof typeof SERVICE_STATUS;
export type ServiceStatusColor = keyof typeof STATUS_UI_STYLE;
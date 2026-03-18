export type TicketFormState = {
    status: string;
    errors?: {
        nama_pelanggan?: string[];
        no_wa?: string[];
        unit_laptop?: string[];
        keluhan?: string[];
        status?: string[];
        _form?: string[];
    };
};

export type CreateTicketForm = {
    nama_pelanggan?: string[];
    no_wa?: string[];
    unit_laptop?: string[];
    keluhan?: string[];
    status?: string[];
};

export type InspeksiFormState = {
    status: string;
    message?: string;
    errors?: {
        diagnosa_awal?: string[];
        estimasi_harga?: string[];
        estimasi_waktu?: string[];
        keterangan_unit?: string[];
        pin_password?: string[];
        _form?: string[];
    };
};

export type InspectionDetail = {
    service_id: string;
    detail_inspeksi: Record<string, string>;
    keterangan_unit: string;
    diagnosa_awal: string;
    estimasi_harga: number;
    estimasi_waktu: string;
    pin_password: string | null;
};
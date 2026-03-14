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
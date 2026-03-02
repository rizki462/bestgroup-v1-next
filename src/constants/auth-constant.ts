export const INITIAL_LOGIN_FORM = {
  email: '',
  password: '',
};

export const INITIAL_STATE_LOGIN_FORM = {
  status: 'idle',
  errors: {
    email: [],
    password: [],
    _form: [],
  },
};

export const INITIAL_STATE_PROFILE = {
  id: '',
  name: '',
  role: '',
  avatar_url: '',
};

export const INITIAL_CREATE_USER_FORM = {
  name: '',
  role: '',
  avatar_url: '',
  email: '',
  password: '',
};

export const INITIAL_STATE_CREATE_USER = {
  status: 'idle',
  errors: {
    email: [],
    password: [],
    name: [],
    role: [],
    avatar_url: [],
    _form: [],
  },
};

export const INITIAL_STATE_UPDATE_USER = {
  status: 'idle',
  errors: {
    name: [],
    role: [],
    avatar_url: [],
    _form: [],
  },
};

export const AVAILABLE_LIST = [
  { value: 'true', label: 'Ready' },
  { value: 'false', label: 'Not Ready' },
];

export const OUTLET_LIST = [
  { value: 'SMI-01', label: 'SMI - Sukabumi Pusat' },
  { value: 'HO-JKT', label: 'Head Office - Jakarta' },
  { value: 'BJM-01', label: 'BJM - Banjarmasin' },
  { value: 'BDG-01', label: 'BDG - Bandung Point' },
];

export const ROLE_LIST = [
  {
    value: 'admin',
    label: 'Admin',
  },
  {
    value: 'teknisi',
    label: 'Teknisi',
  },
  {
    value: 'service advisor',
    label: 'Service Advisor',
  },
  {
    value: 'finance',
    label: 'Finance',
  },
  {
    value: 'warehouse',
    label: 'Warehouse',
  },
];
export interface TariffInterface {
  id: string;
  created_at: string;
  deleted_at: string | null;
  is_deleted: boolean;
  is_free: boolean;
  kind: "user" | "company";
  limit: number;
  name: string;
  period: number;
  price: number;
  extra?: string;
}

export interface CompanyInterface {
  id: string;
  active: boolean;
  created_at: string;
  deleted_at: string | null;
  inn: string;
  is_free: boolean | null;
  license_id: string;
  modified_at: string;
  name: string;
  tariff_name: string;
}

export interface UserInterface {
  background_photo_id: string | null;
  birth_date: string | null;
  company_id: string | null;
  created_at: string;
  deleted_at: string | null;
  disable: boolean;
  email: string;
  id: string;
  is_admin: boolean;
  is_license_free: boolean;
  license_id: string | null;
  modified_at: string | null;
  name: string;
  photo_id: string | null;
  sex: string;
  username: string;
  tariff_name: string;
}

export interface LicenseInterface {
  id: string;
  activated_at: string;
  created_at: string;
  deleted_at: string | null;
  expires_at: string;
  is_deleted: boolean;
  is_free: boolean;
  kind: "user" | "company";
  limit: number;
  owner_id: string;
  tariff_id: string | null;
  tariff_name: string;
  tariff_period: string;
  tariff_price: number;
}

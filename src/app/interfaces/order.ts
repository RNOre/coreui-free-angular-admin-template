export interface OrderInterface {
  id: string;
  company_info?: string;
  company_name: string;
  status: string;
  inn: string;
  created_at: string;
  rejected_at: string | null;
  success_at: string | null;
  tariff_id: string;
  tariff_name: string;
  users: UserInterface[];
}

interface UserInterface {
  id?: string;
  username: string;
  is_admin: boolean;
}

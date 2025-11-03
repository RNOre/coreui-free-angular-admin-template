export interface FilterInterface {
  filter: any;
  order:{
    activatedAt?: string;
    createdAt?: string;
  },
  pagination: PaginationInterface
}

export interface PaginationInterface {
  limit: number;
  offset: number;
}

export interface PaginationMetaInterface {
  totalCount?: number;
  currentPage: number;
  perPage: number;
  currentCount: number;
}

export interface UserData {
  id: string,
  name: string | null,
  company_name?: string,
  post?: null,
  photo_link: string,
  background_photo_link: string,
  email: string,
  username: string,
  photo_id?: string,
}

export type navItem ='order' | 'company' | 'tariff' | 'license' | 'home' | 'user' | 'analysis' | 'main-legal' | 'user-legal';

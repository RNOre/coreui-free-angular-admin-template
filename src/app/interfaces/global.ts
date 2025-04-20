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

export type navItem ='order' | 'company' | 'tariff' | 'license' | 'home' | 'user' | 'analysis' | 'main-legal' | 'user-legal';

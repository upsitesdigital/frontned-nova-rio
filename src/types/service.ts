interface Service {
  id: number;
  uuid: string;
  name: string;
  description: string | null;
  icon: string | null;
  basePrice: number;
  allowSingle: boolean;
  allowPackage: boolean;
  allowRecurrence: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export type { Service, PaginatedResponse };

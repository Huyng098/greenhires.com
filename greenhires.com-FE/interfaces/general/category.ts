export interface Category {
  id: string;
  name: string;
}

export interface CategoryURLSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

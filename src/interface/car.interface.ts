import { Brand } from './brand.interface';

export interface Car {
  id: number;
  brand_id: number;
  model: string;
  description: string;
  year: number;
  stock: number;
  price: number;
  isAvailable: boolean;
  brand?: Brand;
  user?: any; // Puedes definir una interfaz User si la necesitas
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CarData {
  brand_id: number;
  model: string;
  description: string;
  year: number;
  stock: number;
  price: number;
  isAvailable?: boolean;
}

export interface CarResponse {
  data: Car[];
  total: number;
}
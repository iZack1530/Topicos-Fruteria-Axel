export type ProductCategory = 'Frutas' | 'Verduras' | 'Cítricos' | 'Temporada';

export type PaymentMethod = 'efectivo' | 'tarjeta' | 'transferencia';

export interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  stock: number;
  category: ProductCategory;
  image: string;
}

export interface SaleCartItem {
  id: number;
  quantity: number;
}

export interface TicketSummary {
  id: string;
  ago: string;
  items: number;
  total: number;
  method: string;
}

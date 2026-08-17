export type Order = {
  id?: number;

  customer_name: string;

  customer_email: string;

  customer_phone: string;

  department: string;

  city: string;

  address: string;

  notes: string;

  subtotal: number;

  shipping: number;

  total: number;

  status?: string;

  payment_status?: string;

  payment_method?: string;
};

export type OrderItem = {
  order_id?: number;

  product_id: number;

  product_name: string;

  brand: string;

  size: number;

  quantity: number;

  price: number;

  subtotal: number;
};
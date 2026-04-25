import { fetchGeneral } from './api/generalActions';

export interface OrderItemModifier {
  id: string;
  orderItemId: string;
  modifierName: string;
  selectedOption: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  notes?: string;
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
  modifiers: OrderItemModifier[];
  createdAt: string;
}

export interface Order {
  id: string;
  tableId: string | null;
  customerName: string | null;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PREPARATION' | 'READY' | 'DELIVERED' | 'CANCELLED' | 'CLOSED';
  orderType: 'LOCAL' | 'TAKEOUT';
  total: number;
  items: OrderItem[];
  table: {
    id: string;
    name: string;
    status: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderInput {
  tableId?: string;
  customerName?: string;
  orderType?: string;
}

export interface AddOrderItemsInput {
  items: {
    productId: string;
    quantity: number;
    price: number;
    notes?: string;
    modifiers?: {
      modifierName: string;
      selectedOption: string;
    }[];
  }[];
}

export interface UpdateOrderStatusInput {
  status: string;
}

export const ordersApi = {
  create: (data: CreateOrderInput) =>
    fetchGeneral<Order>('orders', 'POST', data),

  getById: (id: string) =>
    fetchGeneral<Order>(`orders/${id}`, 'GET'),

  addItems: (orderId: string, data: AddOrderItemsInput) =>
    fetchGeneral<Order>(`orders/${orderId}/items`, 'POST', data),

  updateStatus: (orderId: string, data: UpdateOrderStatusInput) =>
    fetchGeneral<Order>(`orders/${orderId}/status`, 'PUT', data),

  cancel: (orderId: string) =>
    fetchGeneral<Order>(`orders/${orderId}`, 'DELETE'),

  getActiveByTable: (tableId: string) =>
    fetchGeneral<Order | null>(`tables/${tableId}/orders/active`, 'GET'),
};

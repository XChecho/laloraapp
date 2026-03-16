import { create } from 'zustand';
import { OrderItem } from '../../core/database/mockDb';

export type KitchenItemStatus = 'PENDING' | 'READY';

export interface KitchenItem extends OrderItem {
  status: KitchenItemStatus;
  sopaStatus?: KitchenItemStatus; // Specific for lunch flow
  bandejaStatus?: KitchenItemStatus; // Specific for lunch flow
}

export interface KitchenOrder {
  id: string;
  tableId?: number;
  tableName?: string; // e.g. "Mesa 01"
  type: 'MESA' | 'LLEVAR';
  items: KitchenItem[];
  status: 'ACTIVE' | 'READY';
  requestedAt: string; // ISO date
  completedAt?: string; // ISO date when completed
}

interface KitchenStore {
  orders: KitchenOrder[];
  markItemReady: (orderId: string, itemInstanceId: string) => void;
  markSopaReady: (orderId: string, itemInstanceId: string) => void;
  markBandejaReady: (orderId: string, itemInstanceId: string) => void;
  markOrderReady: (orderId: string) => void;
}

// Generate some mock orders with delayed timestamps for testing
const now = new Date();
const twentyFiveMinsAgo = new Date(now.getTime() - 25 * 60 * 1000).toISOString();
const tenMinsAgo = new Date(now.getTime() - 10 * 60 * 1000).toISOString();
const justNow = new Date(now.getTime() - 2 * 60 * 1000).toISOString();

const MOCK_ORDERS: KitchenOrder[] = [
  {
    id: 'o1',
    tableId: 1,
    tableName: 'Mesa 01',
    type: 'MESA',
    status: 'ACTIVE',
    requestedAt: twentyFiveMinsAgo, // Delayed
    items: [
      {
        id: 'r1',
        instanceId: 'i1',
        name: 'Churrasco',
        category: 'carta',
        subcategory: 'Res',
        price: 45000,
        isAvailable: true,
        term: '3/4',
        status: 'PENDING',
      },
      {
        id: 'l1',
        instanceId: 'i2',
        name: 'Mondongo',
        category: 'almuerzo',
        price: 23000,
        isAvailable: true,
        requiresLunchFlow: true,
        protein: 'Res Asada',
        status: 'PENDING',
        sopaStatus: 'PENDING',
        bandejaStatus: 'PENDING',
      }
    ]
  },
  {
    id: 'o2',
    type: 'LLEVAR',
    status: 'ACTIVE',
    requestedAt: tenMinsAgo, // On time
    items: [
      {
        id: 'c2',
        instanceId: 'i3',
        name: 'Cerdo en Salsa',
        category: 'carta',
        subcategory: 'Cerdo',
        price: 42000,
        isAvailable: true,
        requiresSauce: true,
        sauce: 'Piña',
        notes: 'Sin ensalada - Ver en Rojo',
        status: 'PENDING',
      }
    ]
  },
  {
    id: 'o3',
    tableId: 5,
    tableName: 'Mesa 05',
    type: 'MESA',
    status: 'ACTIVE',
    requestedAt: justNow, // On time
    items: [
      {
        id: 'l5',
        instanceId: 'i4',
        name: 'Bandeja (Sin Sopa)',
        category: 'almuerzo',
        price: 19000,
        isAvailable: true,
        requiresLunchFlow: true,
        protein: 'Pollo Asado',
        status: 'PENDING',
        bandejaStatus: 'PENDING',
      }
    ]
  }
];

export const useKitchenStore = create<KitchenStore>((set) => ({
  orders: MOCK_ORDERS,
  markItemReady: (orderId, itemInstanceId) =>
    set((state) => ({
      orders: state.orders.map((order) => {
        if (order.id !== orderId) return order;
        const newItems = order.items.map((item) =>
          item.instanceId === itemInstanceId ? { ...item, status: 'READY' as KitchenItemStatus } : item
        );
        const allItemsReady = newItems.every((i) => i.status === 'READY');
        return {
          ...order,
          items: newItems,
          status: allItemsReady ? 'READY' : order.status,
          ...(allItemsReady && order.status !== 'READY' ? { completedAt: new Date().toISOString() } : {}),
        };
      }),
    })),
  markSopaReady: (orderId, itemInstanceId) =>
    set((state) => ({
      orders: state.orders.map((order) => {
        if (order.id !== orderId) return order;
        const newItems = order.items.map((item) => {
          if (item.instanceId !== itemInstanceId) return item;
          
          const newSopaStatus: KitchenItemStatus = 'READY';
          const allReady = newSopaStatus === 'READY' && item.bandejaStatus === 'READY';
          
          return {
            ...item,
            sopaStatus: newSopaStatus,
            status: allReady ? ('READY' as KitchenItemStatus) : item.status,
          };
        });
        const allItemsReady = newItems.every((i) => i.status === 'READY');
        return {
          ...order,
          items: newItems,
          status: allItemsReady ? 'READY' : order.status,
          ...(allItemsReady && order.status !== 'READY' ? { completedAt: new Date().toISOString() } : {}),
        };
      }),
    })),
  markBandejaReady: (orderId, itemInstanceId) =>
    set((state) => ({
      orders: state.orders.map((order) => {
        if (order.id !== orderId) return order;
        const newItems = order.items.map((item) => {
          if (item.instanceId !== itemInstanceId) return item;

          const newBandejaStatus: KitchenItemStatus = 'READY';
          const allReady = (item.sopaStatus === 'READY' || item.sopaStatus === undefined) && newBandejaStatus === 'READY';

          return {
            ...item,
            bandejaStatus: newBandejaStatus,
            status: allReady ? ('READY' as KitchenItemStatus) : item.status,
          };
        });
        const allItemsReady = newItems.every((i) => i.status === 'READY');
        return {
          ...order,
          items: newItems,
          status: allItemsReady ? 'READY' : order.status,
          ...(allItemsReady && order.status !== 'READY' ? { completedAt: new Date().toISOString() } : {}),
        };
      }),
    })),
  markOrderReady: (orderId) =>
    set((state) => ({
      orders: state.orders.map((order) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          status: 'READY',
          completedAt: new Date().toISOString(),
          items: order.items.map((item) => ({
            ...item,
            status: 'READY' as KitchenItemStatus,
            ...(item.category === 'almuerzo'
              ? { sopaStatus: 'READY' as KitchenItemStatus, bandejaStatus: 'READY' as KitchenItemStatus }
              : {}),
          })),
        };
      }),
    })),
}));

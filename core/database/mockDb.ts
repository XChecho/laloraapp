export interface MenuItem {
  id: string;
  name: string;
  category: 'almuerzo' | 'carta' | 'bebida' | 'cancha';
  subcategory?: string;
  image: string;
  price: number;
  isAvailable: boolean;
  requiresTerm?: boolean;
  requiresSauce?: boolean;
  requiresLunchFlow?: boolean;
  surcharge?: number;
}

export interface OrderItem extends MenuItem {
  instanceId: string; // ID único para cada vez que se agrega al carrito
  term?: string;
  sauce?: string;
  protein?: string;
  sideDrink?: string;
  notes?: string;
  requestedAt?: string; // ISO date
}

export interface Table {
  id: number;
  name: string;
  status: 'OCUPADA' | 'LIBRE';
  total: number;
  image: string;
  currentOrder: OrderItem[];
  zone: 'SALON' | 'TERRAZA';
  openedAt?: string; // ISO date
}

export type ReservationStatus = 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'EN CURSO' | 'FINALIZADA';

export interface Reservation {
  id: string;
  customer: string;
  phone: string;
  start: string;
  end: string;
  status: ReservationStatus;
}

export interface CanchaAccount {
  id: string;
  name: string;
  summary: string;
  total: number;
  closedAt?: string;
  date?: string;
  items: any[];
}

export const MOCK_DB = {
  proteins: [
    'Res Asada', 'Cerdo Asado', 'Pollo Asado', 'Chuleta de Cerdo', 
    'Chuleta de Pollo', 'Tres Telas Sudada', 'Posta Sudada', 'Carne Molida', 'Bagre'
  ],
  lunchDrinks: ['Limonada', 'Jugo de Mora', 'Jugo de Tomate de Árbol'],
  sauces: ['Piña', 'Mora', 'De la Casa'],
  
  menu: [
    // ALMUERZO DEL DÍA
    { id: 'l1', name: 'Mondongo', category: 'almuerzo', price: 23000, isAvailable: true, requiresLunchFlow: true, image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400' },
    { id: 'l2', name: 'Frijoles', category: 'almuerzo', price: 23000, isAvailable: true, requiresLunchFlow: true, image: 'https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?w=400' },
    { id: 'l3', name: 'Ajiaco', category: 'almuerzo', price: 23000, isAvailable: true, requiresLunchFlow: true, image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400' },
    { id: 'l4', name: 'Sopa de Pescado', category: 'almuerzo', price: 23000, isAvailable: false, requiresLunchFlow: true, image: 'https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?w=400' },
    { id: 'l5', name: 'Bandeja (Sin Sopa)', category: 'almuerzo', price: 19000, isAvailable: true, requiresLunchFlow: true, image: 'https://images.unsplash.com/photo-1512058560366-cd2427ba5e7a?w=400' },
    { id: 'l6', name: 'Fiambre', category: 'almuerzo', price: 23000, surcharge: 3000, isAvailable: true, requiresLunchFlow: true, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400' },

    // ENTRADAS
    { id: 'e1', name: 'Patacón con Chicharrón', category: 'carta', subcategory: 'Entradas', price: 15000, isAvailable: true, image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400' },
    { id: 'e2', name: 'Chorizo y Patacón', category: 'carta', subcategory: 'Entradas', price: 12000, isAvailable: true, image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?w=400' },

    // CARNES DE RES
    { id: 'r1', name: 'Churrasco', category: 'carta', subcategory: 'Res', price: 45000, isAvailable: true, requiresTerm: true, image: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=400' },
    { id: 'r2', name: 'Lomo a la Plancha', category: 'carta', subcategory: 'Res', price: 43000, isAvailable: true, requiresTerm: true, image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400' },
    { id: 'r3', name: 'Callana de Res o Mixta', category: 'carta', subcategory: 'Res', price: 45000, isAvailable: true, image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=400' },
    { id: 'r4', name: 'Bistec al Caballo', category: 'carta', subcategory: 'Res', price: 45000, isAvailable: true, image: 'https://images.unsplash.com/photo-1529692236671-f1f6e9460272?w=400' },
    { id: 'r5', name: 'Res en Champiñones', category: 'carta', subcategory: 'Res', price: 45000, isAvailable: true, image: 'https://images.unsplash.com/photo-1603073163308-9654c3fb70b5?w=400' },
    { id: 'r6', name: 'Res a la Cazadora', category: 'carta', subcategory: 'Res', price: 45000, isAvailable: true, image: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=400' },

    // CANCHA MENU
    { id: 'b1', name: 'Gatorade', category: 'cancha', subcategory: 'Bebidas', price: 6000, isAvailable: true, image: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=500&q=80' },
    { id: 'b2', name: 'Agua Manantial', category: 'cancha', subcategory: 'Bebidas', price: 3500, isAvailable: true, image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=500&q=80' },
    { id: 'b3', name: 'Cerveza Club Colombia', category: 'cancha', subcategory: 'Bebidas', price: 6000, isAvailable: true, image: 'https://images.unsplash.com/photo-1614316948577-ab8df33fb948?w=500&q=80' },
    { id: 'b4', name: 'Coca Cola', category: 'cancha', subcategory: 'Bebidas', price: 4500, isAvailable: true, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80' },
    { id: 'm1', name: 'Maní Especial', category: 'cancha', subcategory: 'Mecato', price: 2500, isAvailable: true, image: 'https://images.unsplash.com/photo-1590069830588-4f11409d58ba?w=500&q=80' },
    { id: 'm2', name: 'Papas Margarita', category: 'cancha', subcategory: 'Mecato', price: 3000, isAvailable: true, image: 'https://images.unsplash.com/photo-1566478989037-e924e9da46e2?w=500&q=80' },
    { id: 'm3', name: 'Chocolatina', category: 'cancha', subcategory: 'Mecato', price: 4000, isAvailable: true, image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=500&q=80' },
    { id: 'p1', name: 'Empanada Carne', category: 'cancha', subcategory: 'Piqueteadero', price: 4000, isAvailable: true, image: 'https://images.unsplash.com/photo-1626082895617-2c6b4129b800?w=500&q=80' },
    { id: 'p2', name: 'Dedo de Queso', category: 'cancha', subcategory: 'Piqueteadero', price: 4500, isAvailable: true, image: 'https://images.unsplash.com/photo-1579954115545-a95ed58079bf?w=500&q=80' },
  ] as MenuItem[],
  
  reservations: [
    { id: '1', customer: 'Juan Pérez', phone: '3001112233', start: '17:00', end: '18:00', status: 'CONFIRMADA' },
    { id: '2', customer: 'María García', phone: '3104445566', start: '18:00', end: '19:00', status: 'PENDIENTE' },
    { id: '3', customer: 'Club de Tenis S.A.', phone: '3207778899', start: '19:00', end: '20:00', status: 'PENDIENTE' },
    { id: '4', customer: '', phone: '', start: '20:00', end: '21:00', status: 'PENDIENTE' },
    { id: '5', customer: '', phone: '', start: '21:00', end: '22:00', status: 'PENDIENTE' },
    { id: '6', customer: '', phone: '', start: '22:00', end: '23:00', status: 'PENDIENTE' },
  ] as Reservation[],

  canchaAccounts: [
    { id: 'A1', name: 'Carlos Rodríguez', summary: '2 Cerveza Club Colombia, 1 Agua Natural', total: 15500, items: [{ id: 'b3', name: 'Cerveza Club Colombia', price: 6000, qty: 2 }, { id: 'b2', name: 'Agua Natural', price: 3500, qty: 1 }] },
    { id: 'A2', name: 'Ana Martínez', summary: '1 Gatorade, 1 Maní Especial', total: 8500, items: [{ id: 'b1', name: 'Gatorade', price: 6000, qty: 1 }, { id: 'm1', name: 'Maní Especial', price: 2500, qty: 1 }] },
    { id: 'A3', name: 'Luis Fer', summary: '4 Cerveza Poker, 2 Empanada Carne', total: 28000, items: [{ id: 'b5', name: 'Cerveza Poker', price: 5000, qty: 4 }, { id: 'p1', name: 'Empanada Carne', price: 4000, qty: 2 }] },
  ] as CanchaAccount[],

  canchaHistory: [
    { id: 'H1', name: 'Miguel Ángel', summary: '3 Cerveza Club Colombia, 2 Empanada Carne', total: 26000, closedAt: '15:30', items: [] },
    { id: 'H2', name: 'Laura Restrepo', summary: '1 Gatorade, 1 Maní', total: 8500, closedAt: '16:15', items: [] },
  ] as CanchaAccount[],

  tables: [
    { 
      id: 1, 
      name: 'MESA 01', 
      status: 'OCUPADA', 
      total: 45000, 
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400', 
      currentOrder: [
        { id: 'r1', name: 'Churrasco', category: 'carta', subcategory: 'Res', price: 45000, isAvailable: true, instanceId: '1', requestedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() }
      ], 
      zone: 'SALON',
      openedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
    },
    { id: 2, name: 'MESA 02', status: 'LIBRE', total: 0, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400', currentOrder: [], zone: 'SALON' },
    { 
      id: 3, 
      name: 'MESA 03', 
      status: 'OCUPADA', 
      total: 12500, 
      image: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400', 
      currentOrder: [
        { id: 'b5', name: 'Gaseosa', category: 'bebida', price: 3500, isAvailable: true, instanceId: '2', requestedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() }
      ], 
      zone: 'SALON',
      openedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString()
    },
  ] as Table[]
};

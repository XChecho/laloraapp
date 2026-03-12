export interface MenuItem {
  id: string;
  name: string;
  category: 'almuerzo' | 'carta' | 'bebida';
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
}

export interface Table {
  id: number;
  name: string;
  status: 'OCUPADA' | 'LIBRE';
  total: number;
  image: string;
  currentOrder: OrderItem[];
  zone: 'SALON' | 'TERRAZA';
}

export const MOCK_DB = {
  // ... (keep proteins, lunchDrinks, sauces)
  proteins: [
    'Res Asada', 'Cerdo Asado', 'Pollo Asado', 'Chuleta de Cerdo', 
    'Chuleta de Pollo', 'Tres Telas Sudada', 'Posta Sudada', 'Carne Molida', 'Bagre'
  ],
  lunchDrinks: ['Limonada', 'Jugo de Mora', 'Jugo de Tomate de Árbol'],
  sauces: ['Piña', 'Mora', 'De la Casa'],
  
  menu: [
    // ... (keep menu as is)
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

    // CERDO
    { id: 'c1', name: 'Milanesa de Cerdo', category: 'carta', subcategory: 'Cerdo', price: 38000, isAvailable: true, image: 'https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?w=400' },
    { id: 'c2', name: 'Cerdo en Salsa', category: 'carta', subcategory: 'Cerdo', price: 42000, isAvailable: true, requiresSauce: true, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400' },

    // POLLO
    { id: 'po1', name: 'Milanesa de Pollo', category: 'carta', subcategory: 'Pollo', price: 38000, isAvailable: true, image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400' },
    { id: 'po2', name: 'Pollo en Salsa', category: 'carta', subcategory: 'Pollo', price: 42000, isAvailable: true, requiresSauce: true, image: 'https://images.unsplash.com/photo-1606728035253-49e8a23146de?w=400' },

    // PEZ Y MARISCOS
    { id: 'pm1', name: 'Trucha Frita', category: 'carta', subcategory: 'Pez y Mariscos', price: 38000, isAvailable: true, image: 'https://images.unsplash.com/photo-1534604973900-c41ab4c5d4b0?w=400' },
    { id: 'pm7', name: 'Cazuela de Mariscos', category: 'carta', subcategory: 'Pez y Mariscos', price: 50000, isAvailable: true, image: 'https://images.unsplash.com/photo-1534080564607-317f539db499?w=400' },

    // PASTAS
    { id: 'ps1', name: 'Pasta Boloñesa', category: 'carta', subcategory: 'Pastas', price: 30000, isAvailable: true, image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400' },
    { id: 'ps4', name: 'Pasta con Camarones', category: 'carta', subcategory: 'Pastas', price: 40000, isAvailable: true, image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400' },

    // BEBIDAS
    { id: 'b5', name: 'Gaseosa', category: 'bebida', price: 3500, isAvailable: true, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400' },
    { id: 'b9', name: 'Cerveza', category: 'bebida', price: 7000, isAvailable: true, image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400' },
  ] as MenuItem[],
  
  tables: [
    { id: 1, name: 'MESA 01', status: 'OCUPADA', total: 45000, image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400', currentOrder: [], zone: 'SALON' },
    { id: 2, name: 'MESA 02', status: 'LIBRE', total: 0, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400', currentOrder: [], zone: 'SALON' },
    { id: 3, name: 'MESA 03', status: 'OCUPADA', total: 12500, image: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400', currentOrder: [], zone: 'SALON' },
    { id: 4, name: 'MESA 04', status: 'OCUPADA', total: 88200, image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400', currentOrder: [], zone: 'SALON' },
    { id: 5, name: 'MESA 05', status: 'LIBRE', total: 0, image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400', currentOrder: [], zone: 'TERRAZA' },
    { id: 6, name: 'MESA 06', status: 'OCUPADA', total: 32000, image: 'https://images.unsplash.com/photo-1525610553991-2bede1a233e9?w=400', currentOrder: [], zone: 'TERRAZA' },
  ] as Table[]
};

export interface MenuItem {
  id: string;
  name: string;
  category: 'sopa' | 'proteina' | 'bebida';
  image: string;
  requiresTerm?: boolean;
  isAvailable: boolean;
  price: number;
}

export const MENU_MOCK: MenuItem[] = [
  // Sopas
  {
    id: 's1',
    name: 'Sopa de Lentejas',
    category: 'sopa',
    price: 0,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=400&fit=crop',
  },
  {
    id: 's2',
    name: 'Crema de Tomate',
    category: 'sopa',
    price: 0,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1547592116-f6424075133d?w=400&h=400&fit=crop',
  },
  {
    id: 's3',
    name: 'Ajiaco',
    category: 'sopa',
    price: 0,
    isAvailable: false,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=400&fit=crop',
  },
  // Proteínas
  {
    id: 'p1',
    name: 'Churrasco de Res',
    category: 'proteina',
    price: 35000,
    requiresTerm: true,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=400&h=400&fit=crop',
  },
  {
    id: 'p2',
    name: 'Pollo a la Plancha',
    category: 'proteina',
    price: 25000,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=400&fit=crop',
  },
  {
    id: 'p3',
    name: 'Salmón Grillé',
    category: 'proteina',
    price: 42000,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=400&fit=crop',
  },
  // Bebidas
  {
    id: 'b1',
    name: 'Limonada Natural',
    category: 'bebida',
    price: 8000,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=400&fit=crop',
  },
  {
    id: 'b2',
    name: 'Jugo de Mora',
    category: 'bebida',
    price: 7000,
    isAvailable: true,
    image: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=400&h=400&fit=crop',
  },
];

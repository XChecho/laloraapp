# Documentación de Endpoints - Módulo Admin

Este documento describe todos los endpoints necesarios para el módulo de Administración de La Lora POS.

---

## 1. authentication (Auth)

### 1.1 Inicio de Sesión
- **Endpoint:** `POST /auth/login`
- **Body:**
```json
{
  "email": "string",
  "password": "string"
}
```
- **Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "string",
    "firstName": "string",
    "lastName": "string",
    "userType": "admin|cashier|kitchen|waitress|cancha_manager"
  }
}
```

### 1.2 Obtener Perfil
- **Endpoint:** `GET /auth/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "phone": "string",
    "role": "string",
    "profileImage": "string"
  }
}
```

### 1.3 Actualizar Perfil
- **Endpoint:** `PUT /auth/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "phone": "string",
  "profileImage": "string"
}
```

### 1.4 Cambiar Contraseña
- **Endpoint:** `PUT /auth/change-password`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

---

## 2. Users (Usuarios)

### 2.1 Listar Usuarios
- **Endpoint:** `GET /users`
- **Headers:** `Authorization: Bearer <token>`
- **Query Params:** `?search=` (opcional, búsqueda por nombre o rol)
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phone": "string",
      "role": "admin|cashier|kitchen|waitress|cancha_manager",
      "birthdate": "date",
      "entryDate": "date",
      "active": true,
      "createdAt": "datetime"
    }
  ]
}
```

### 2.2 Crear Usuario
- **Endpoint:** `POST /users`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string",
  "phone": "string",
  "role": "admin|cashier|kitchen|waitress|cancha_manager",
  "birthdate": "date",
  "entryDate": "date"
}
```
- **Notas:** 
  - El rol solo puede ser creado por administradores
  - Se envía contraseña temporal que el usuario debe cambiar

### 2.3 Obtener Usuario por ID
- **Endpoint:** `GET /users/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "role": "string",
    "birthdate": "date",
    "entryDate": "date",
    "active": true
  }
}
```

### 2.4 Actualizar Usuario
- **Endpoint:** `PUT /users/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "phone": "string",
  "role": "string",
  "birthdate": "date",
  "active": boolean
}
```

### 2.5 Eliminar Usuario
- **Endpoint:** `DELETE /users/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Notas:** 
  - Soft delete ( marcar como inactivo )
  - No elimina registros relacionados (órdenes, etc.)

---

## 3. Tables (Mesas y Espacios)

### 3.1 Listar Espacios (Zonas)
- **Endpoint:** `GET /zones`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "icon": "string",
      "tablesCount": number,
      "createdAt": "datetime"
    }
  ]
}
```

### 3.2 Crear Espacio
- **Endpoint:** `POST /zones`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "name": "string",
  "icon": "string"
}
```
- **Notas:** 
  - Iconos válidos: `restaurant`, `leaf`, `sunny`, `bonfire`, `football`, `pricetag`

### 3.3 Actualizar Espacio
- **Endpoint:** `PUT /zones/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "name": "string",
  "icon": "string"
}
```

### 3.4 Eliminar Espacio
- **Endpoint:** `DELETE /zones/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Notas:** 
  - Elimina todas las mesas asociadas

### 3.5 Listar Mesas por Espacio
- **Endpoint:** `GET /zones/:zoneId/tables`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "zoneId": "string",
      "status": "available|occupied|reserved",
      "createdAt": "datetime"
    }
  ]
}
```

### 3.6 Crear Mesa
- **Endpoint:** `POST /tables`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "name": "string",
  "zoneId": "string"
}
```
- **Notas:** 
  - Máximo 30 mesas por restaurante

### 3.7 Eliminar Mesa
- **Endpoint:** `DELETE /tables/:id`
- **Headers:** `Authorization: Bearer <token>`

---

## 4. Menu (Menú y Categorías)

### 4.1 Listar Categorías
- **Endpoint:** `GET /categories`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "icon": "string",
      "active": true,
      "itemsCount": number,
      "displayOrder": number,
      "createdAt": "datetime"
    }
  ]
}
```

### 4.2 Crear Categoría
- **Endpoint:** `POST /categories`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "name": "string",
  "description": "string",
  "icon": "string",
  "displayOrder": number
}
```

### 4.3 Actualizar Categoría
- **Endpoint:** `PUT /categories/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "name": "string",
  "description": "string",
  "icon": "string",
  "active": boolean,
  "displayOrder": number
}
```

### 4.4 Eliminar Categoría
- **Endpoint:** `DELETE /categories/:id`
- **Headers:** `Authorization: Bearer <token>`

### 4.5 Listar Productos por Categoría
- **Endpoint:** `GET /categories/:categoryId/products`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "price": number,
      "image": "string",
      "available": true,
      "createdAt": "datetime"
    }
  ]
}
```

### 4.6 Crear Producto
- **Endpoint:** `POST /products`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "name": "string",
  "description": "string",
  "price": number,
  "categoryId": "string",
  "image": "string",
  "available": boolean,
  "modifiers": [
    {
      "name": "string",
      "options": ["string"],
      "required": boolean,
      "multiple": boolean
    }
  ]
}
```

### 4.7 Actualizar Producto
- **Endpoint:** `PUT /products/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** (campos similares a crear)

### 4.8 Eliminar Producto
- **Endpoint:** `DELETE /products/:id`
- **Headers:** `Authorization: Bearer <token>`

---

## 5. Expenses (Gastos)

### 5.1 Listar Gastos
- **Endpoint:** `GET /expenses`
- **Headers:** `Authorization: Bearer <token>`
- **Query Params:** `?startDate=&endDate=&category=`
- **Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "amount": number,
      "category": "materia_prima|nomina|servicios|proveedores",
      "description": "string",
      "date": "datetime",
      "registeredBy": "string",
      "createdAt": "datetime"
    }
  ]
}
```

### 5.2 Registrar Gasto
- **Endpoint:** `POST /expenses`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "amount": number,
  "category": "materia_prima|nomina|servicios|proveedores",
  "description": "string",
  "date": "datetime"
}
```

### 5.3 Eliminar Gasto
- **Endpoint:** `DELETE /expenses/:id`
- **Headers:** `Authorization: Bearer <token>`

---

## 6. Reports (Reportes)

### 6.1 Reporte de Ventas
- **Endpoint:** `GET /reports/sales`
- **Headers:** `Authorization: Bearer <token>`
- **Query Params:** `?startDate=&endDate=&groupBy=day|week|month`
- **Response:**
```json
{
  "success": true,
  "data": {
    "totalSales": number,
    "totalOrders": number,
    "averageTicket": number,
    "chartData": [
      { "date": "string", "sales": number, "orders": number }
    ]
  }
}
```

### 6.2 Reporte de Gastos
- **Endpoint:** `GET /reports/expenses`
- **Headers:** `Authorization: Bearer <token>`
- **Query Params:** `?startDate=&endDate=`
- **Response:**
```json
{
  "success": true,
  "data": {
    "totalExpenses": number,
    "byCategory": [
      { "category": "string", "amount": number, "percentage": number }
    ]
  }
}
```

### 6.3 Reporte de Productos
- **Endpoint:** `GET /reports/products`
- **Headers:** `Authorization: Bearer <token>`
- **Query Params:** `?startDate=&endDate=&limit=`
- **Response:**
```json
{
  "success": true,
  "data": {
    "bestSellers": [
      { "productId": "string", "name": "string", "quantity": number, "revenue": number }
    ],
    "byCategory": [
      { "categoryId": "string", "name": "string", "quantity": number, "percentage": number }
    ]
  }
}
```

### 6.4 Reporte de Pedidos por Hora
- **Endpoint:** `GET /reports/orders-by-hour`
- **Headers:** `Authorization: Bearer <token>`
- **Query Params:** `?date=`
- **Response:**
```json
{
  "success": true,
  "data": [
    { "hour": number, "orders": number, "type": "local|takeout" }
  ]
}
```

### 6.5 Reporte de Mesas
- **Endpoint:** `GET /reports/tables`
- **Headers:** `Authorization: Bearer <token>`
- **Query Params:** `?startDate=&endDate=`
- **Response:**
```json
{
  "success": true,
  "data": {
    "averageOccupancy": number,
    "turnsPerTable": number,
    "revenuePerTable": number
  }
}
```

---

## 7. Orders (Órdenes) - Notas Adicionales

### 7.1 Estados de Orden
- `PENDING` - Pendiente
- `CONFIRMED` - Confirmada
- `IN_PREPARATION` - En preparación
- `READY` - Lista para servir
- `DELIVERED` - Entregada
- `CANCELLED` - Cancelada
- `CLOSED` - Cerrada (pagada)

### 7.2 Distribución Local vs Llevar
- Campo `orderType`: `local` | `takeout`

---

## 8. Users Roles

| Rol | Descripción | Permisos |
|-----|-------------|---------|
| `ADMIN` | Administrador | Full access |
| `CASHIER` | Cajero | Caja, cerrar órdenes |
| `KITCHEN` | Cocina | Ver pedidos cocina |
| `WAITRESS` | Mesero | Mesas, crear órdenes |
| `CANCHA_MANAGER` | Encargado Cancha | Gestión canchas |

---

## 9. Notas Importantes

1. **Paginación:** Todos los endpoints de lista soportan `?page=&limit=`
2. **Fechas:** Formato ISO 8601 (YYYY-MM-DDTHH:MM:SSZ)
3. **Moneda:** COP (Pesos Colombianos)
4. **Soft Delete:** Los registros no se eliminan, se marcan como `active: false`
5. **Timestamps:** Todos los registros tienen `createdAt` y `updatedAt`
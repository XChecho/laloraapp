# Laloraapp Backend — Proyecto .NET desde Cero

Este documento sirve como la guía de contexto y reglas base para la creación del backend del proyecto **Laloraapp**. El objetivo es desarrollar una API robusta, escalable y en tiempo real para soportar la aplicación móvil existente (React Native / Expo).

## 🚀 Arquitectura Core (Endpoints & Backend)
- **Framework:** .NET 8 (o superior) ASP.NET Core Web API.
- **Lenguaje:** C# 12+ (con Nullable Reference Types habilitado).
- **Arquitectura:** Clean Architecture (Domain, Application, Infrastructure, Presentation) o Vertical Slice Architecture (recomendado para máxima agilidad en endpoints por feature).
- **Base de Datos:** PostgreSQL (con Entity Framework Core). Soporte robusto y open-source.
- **Autenticación y Autorización:** JWT (JSON Web Tokens) con ASP.NET Core Identity. Roles definidos: `Admin`, `Cashier`, `Kitchen`, `Waitress`, `CanchaManager`.
- **Comunicación en Tiempo Real:** SignalR (crítico para la actualización de estados de pedidos en cocina, notificaciones al mesero y estados de canchas).

## 📦 Librerías Recomendadas
1. **Mapeo y Validaciones:** 
   - `FluentValidation`: Para validación de DTOs y requests en la capa de Application/Endpoints.
   - `Mapster` o `AutoMapper`: Para mapeo entre Entidades y DTOs (Mapster recomendado por rendimiento).
2. **CQRS y Mediador:**
   - `MediatR`: Para implementar el patrón CQRS (Command Query Responsibility Segregation).
3. **Data Access:**
   - `Microsoft.EntityFrameworkCore.PostgreSQL`: Proveedor de EF Core.
   - `Dapper` (Opcional): Para micro-optimizaciones en queries de sólo lectura (Reportes del Admin).
4. **Documentación de API:**
   - `Swashbuckle.AspNetCore` (Swagger) o `Scalar` para la exploración de endpoints.
5. **Testing:**
   - `xUnit`: Framework de pruebas.
   - `Moq` o `NSubstitute`: Para mockear dependencias.
   - `FluentAssertions`: Para aseveraciones más legibles.

## 📂 Organización del Proyecto (Solución)
Recomendación de estructura de carpetas (Clean Architecture):
- `Laloraapp.Api/` (Presentation/Host: Controllers o Minimal APIs, middlewares, configuración de DI).
- `Laloraapp.Application/` (Casos de uso: Commands, Queries, Interfaces, DTOs, Validadores).
- `Laloraapp.Domain/` (Modelos core, Enums, Excepciones de dominio, Interfaces de Repositorios).
- `Laloraapp.Infrastructure/` (Implementación de EF Core, DbContext, Migrations, Servicios externos, SignalR Hubs, Jwt providers).

## 🏢 Dominios Principales (Basado en la App Móvil)
1. **Identity & Access Management:** Manejo de usuarios, login, roles.
2. **Catalog (Menú):** Categorías, Productos, Precios, Modificadores de menú.
3. **Orders (Cocina y Meseros):** Creación de órdenes (waitress), actualización de estado (pendientes, en preparación, listas, entregadas), cálculo de tiempos y umbrales de retraso (kitchen).
4. **Tables & Canchas:** Gestión del estado de las mesas del restaurante y las canchas deportivas (disponible, ocupada, reservada).
5. **Reservations:** Sistema de reservas para canchas por bloques de tiempo.
6. **Billing (Caja):** Cierre de órdenes, métodos de pago, reportes de turnos.

## 🛠️ Reglas del Agente (Instrucciones para la IA)
1. **Inicialización Única:** Comienza generando la solución `.sln` y los proyectos `.csproj` usando la CLI de `dotnet`.
2. **Endpoints por Feature:** Al construir, agrupa y estructura los endpoints lógicamente. Prefiere **Minimal APIs** por su bajo overhead o Controllers bien estructurados.
3. **Migraciones:** Crea una estructura sólida del DbContext antes de configurar la base de datos y usa comandos asíncronos para aplicar cambios.
4. **Respuesta Estándar:** Todas las respuestas de la API deben seguir un envoltorio (wrapper) de respuesta predecible, ej: `{ "data": ..., "success": true, "message": "..." }`.
5. **Economía de Código:** Sé consiso, escribe código modular y aplica inyección de dependencias (`DI`) desde el primer momento.

---
**Instrucción de arranque para la IA:** 
"Inicia la construcción del proyecto configurando la solución .NET, la arquitectura en capas especificada, instalando los paquetes NuGet principales (EF Core Postgres, MediatR, FluentValidation) y generando el Dominio Core de Autenticación y Órdenes."

# Restaurant POS (Frontend)

MVP de gestión de mesas para restaurante, desarrollado con **React + Vite + TypeScript**.
El foco está en un flujo claro de operación en salón: tomar pedido, procesarlo y liberar mesa.

## Objetivo
Implementar una base funcional y mantenible para la sección **Mesas**, usando:
- estado local
- datos estáticos
- arquitectura por funcionalidad

## Stack
- React
- Vite
- TypeScript
- CSS plano (sin Tailwind)
- jsPDF (generación de PDF descargable)

## Funcionalidades implementadas

### Mesas
- Vista en cuadrícula responsive
- Estados visuales:
  - `FREE`
  - `IN_PREPARATION`
  - `DISPATCHED`

### Flujo de pedido
1. Click en mesa `FREE` -> modal **Tomar Pedido**
2. Ingreso de número de personas
3. Paso a modal/vista de **Agregar Productos**
4. Selección por categorías (Bebidas, Desayunos, Asados, Mariscos, Criollo)
5. Resumen con:
   - cantidad (+/-)
   - eliminar ítem
   - nota opcional
   - subtotal por ítem
   - total general
6. **Pagar** abre modal de facturación:
   - **Consumidor final**: plantilla base + descarga de PDF
   - **Factura**: solicita nombres, correo, cédula y sector, y descarga de PDF
7. Confirmación de pago -> mesa cambia a `IN_PREPARATION`

### Pedido activo
- Click en mesa no libre abre detalle de pedido activo
- Acciones por estado:
  - `IN_PREPARATION` -> **Marcar como Despachado**
  - `DISPATCHED` -> **Marcar como Libre**
- Al marcar como libre:
  - se limpia el pedido activo
  - se reinicia referencia de la mesa

### Facturación y documento
- Flujo encapsulado en `BillingDocumentModal`
- Validación básica para factura (incluye formato de correo)
- Descarga automática del comprobante PDF antes de cerrar el pago

## Navegación
- `Mesas` (implementado)
- `Historial de Pedidos` (placeholder visual, sin implementación)

## Estructura del proyecto
```text
src/
  App.tsx
  main.tsx

  features/
    tables/
      components/
      data/
      types/

  shared/
    components/Modal/
    types/

  styles/
```

## Scripts
```bash
npm run dev      # desarrollo
npm run build    # build de producción
```

## Ejecución local
```bash
npm install
npm run dev
```

## Decisiones técnicas
- Arquitectura por feature para escalar por dominio
- `shared/` para componentes y tipos reutilizables
- Modal reutilizable para mantener consistencia de UI

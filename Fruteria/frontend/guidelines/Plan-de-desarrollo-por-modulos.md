# Plan de desarrollo por módulos

Este documento organiza la app de Frutería Axel en módulos funcionales para pasar del prototipo visual a una aplicación operativa.

## Base actual

- Entrada principal del front: [src/app/App.tsx](../src/app/App.tsx)
- Rutas principales: [src/app/routes.tsx](../src/app/routes.tsx)
- Shell de navegación: [src/app/components/Layout.tsx](../src/app/components/Layout.tsx)
- Pantallas ya existentes: [src/app/pages/Home.tsx](../src/app/pages/Home.tsx), [src/app/pages/Admin.tsx](../src/app/pages/Admin.tsx), [src/app/pages/Employee.tsx](../src/app/pages/Employee.tsx), [src/app/pages/Sales.tsx](../src/app/pages/Sales.tsx), [src/app/pages/Inventory.tsx](../src/app/pages/Inventory.tsx), [src/app/pages/Settings.tsx](../src/app/pages/Settings.tsx)

## Objetivo técnico

- Separar datos mock de la lógica de negocio.
- Convertir las pantallas actuales en flujos reales de captura, consulta y edición.
- Definir un contrato claro entre front y back antes de implementar APIs.
- Estandarizar formularios, validaciones, estados de carga y manejo de errores.

## Módulos y tareas

| Módulo | Front-end | Back-end |
| --- | --- | --- |
| 1. Fundamentos de la app | Crear estructura por capas: `pages`, `components`, `services`, `stores`, `types`, `utils`. Definir layout global, navegación, tema visual y componentes base reutilizables. | Definir arquitectura de API, versión inicial de endpoints, autenticación base y convenciones de respuesta. |
| 2. Autenticación y roles | Pantalla de login, recuperación de sesión, guardas por rol, perfil activo y cierre de sesión. | Login, refresh token, permisos por rol, recuperación de contraseña y auditoría de accesos. |
| 3. Dashboard principal | Convertir la pantalla inicial en un panel con métricas reales, accesos rápidos y estado de sucursal. | Endpoint de resumen diario, ventas, caja, inventario crítico y alertas operativas. |
| 4. Administración | Gestionar accesos a productos, caja e inventario con vistas de resumen, navegación y acciones rápidas. | Configuración de sucursal, reglas operativas, parámetros de caja y catálogos administrativos. |
| 5. Inventario | Reemplazar listas estáticas por tabla/ficha filtrable, búsqueda, paginación, estados de stock y acciones sobre productos. | CRUD de productos, categorías, existencias, mínimos, máximos, kardex y movimientos de inventario. |
| 6. Registro de productos | Formularios para alta de producto, edición, carga de imagen, categoría, precio, unidad y validación. | Crear, editar y eliminar productos, validaciones de negocio, control de duplicados y almacenamiento de imágenes. |
| 7. Baja de productos | Flujo para retirar productos con motivo, cantidad, confirmación y historial visible. | Registrar bajas, motivos, autorización, impacto en inventario y trazabilidad. |
| 8. Registro de cantidades | Pantalla para capturar cantidades por producto, con búsqueda, unidad y confirmación. | Guardar conteos, recalcular stock, comparar inventario físico vs sistema y registrar ajustes. |
| 9. Control de fechas | Formularios para lote, caducidad, fecha de recepción y alertas por vencimiento. | Persistir lotes, fechas, reglas de vencimiento, alertas automáticas y bitácora. |
| 10. Registro por peso | Flujo para productos a granel con captura por kilo, cálculo automático y redondeo. | Reglas de conversión, unidades, precios por peso y validación de operaciones. |
| 11. Ventas / POS | Convertir la pantalla de ventas en punto de venta real con carrito, búsqueda, filtros, métodos de pago, tickets y estados vacíos. | Crear venta, detalle de venta, folio, pago, cancelación, devolución y actualización de stock. |
| 12. Caja y arqueo | Módulo de apertura/cierre de caja, entradas/salidas, cortes parciales y resumen de movimientos. | Apertura/cierre de caja, arqueos, conciliación, movimientos, diferencias y permisos. |
| 13. Historial y reportes | Listados, filtros por fecha, exportación básica y detalle de transacciones. | Reportes de ventas, inventario, caja, movimientos y exportación a PDF/Excel/CSV. |
| 14. Configuración | Ajustes de perfil, tema, notificaciones, idioma, accesos rápidos y preferencias. | Persistencia de preferencias, roles, parámetros de sistema y configuración por sucursal. |
| 15. Calidad y soporte | Estados de carga/error, skeletons, toasts, trazabilidad de acciones, pruebas de componentes y accesibilidad. | Logs, monitoreo, pruebas de integración, validaciones, manejo de errores y documentación de endpoints. |

## Orden sugerido de implementación

1. Fundamentos de la app.
2. Autenticación y roles.
3. Productos e inventario.
4. Ventas y caja.
5. Reportes y configuración.
6. Calidad, pruebas y endurecimiento.

## Tareas concretas para el front

- Reemplazar datos locales por consumo de API.
- Separar componentes de UI de la lógica de negocio.
- Crear un cliente HTTP centralizado con manejo de errores.
- Normalizar formularios con validación.
- Agregar loading states, empty states y feedback visual.
- Definir tipos compartidos para productos, ventas, usuarios, caja e inventario.

## Tareas concretas para el back

- Diseñar modelo de usuarios, roles y permisos.
- Crear catálogos de productos, categorías, unidades y sucursales.
- Exponer endpoints de inventario, ventas, caja y reportes.
- Registrar auditoría de cambios y movimientos.
- Implementar reglas de negocio para stock, caducidad y cortes de caja.
- Preparar autenticación segura y control de sesión.

## Entregables por fase

- Fase 1: navegación estable, layout final y base de datos de prueba.
- Fase 2: login, roles y dashboard funcional.
- Fase 3: inventario, productos y control de fechas.
- Fase 4: ventas, caja y tickets.
- Fase 5: reportes, configuración y endurecimiento.

import { Injectable } from '@angular/core';

import { MenuItem } from '../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menuClass = 'open_menu_movil';

  constructor() { }

  private menuSections: MenuItem[] = [
    { label: 'Panel', route: '/dashboard' },
    {
      label: 'Ventas',
      children: [
        { label: 'Pedidos', route: '/ventas/pedidos' },
        { label: 'Facturación', route: '/ventas/facturacion' },
        { label: 'Clientes', route: '/ventas/clientes' },
        { label: 'Reportes de Ventas', route: '/ventas/reportes' }
      ]
    },
    {
      label: 'Inventario',
      children: [
        { label: 'Productos', route: '/inventario/productos' },
        { label: 'Categorías', route: '/inventario/categorias' },
        { label: 'Proveedores', route: '/inventario/proveedores' },
        { label: 'Ajustes de Stock', route: '/inventario/stock' }
      ]
    },
    {
      label: 'Configuración',
      children: [
        { label: 'Perfil', route: '/configuracion/perfil' },
        { label: 'Seguridad', route: '/configuracion/seguridad' },
        { label: 'Métodos de Pago', route: '/configuracion/metodos-pago' },
        { label: 'Integraciones', route: '/configuracion/integraciones' }
      ]
    },
  ];

  getMenuSections(): MenuItem[] {
    return this.menuSections;
  }

  toggleMenu(): void {
    document.body.classList.toggle(this.menuClass);
  }
}

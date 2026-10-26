import { Routes } from '@angular/router';

export const CARTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../component/cart-home/cart-home.component').then((m) => m.CartHomeComponent),
    children: [
      {
        path: '',
        redirectTo: 'carts',
        pathMatch: 'full'
      },
      {
        path: 'carts',
        loadComponent: () =>
          import('../component/cart-products-list/cart-products-list.component').then(
            (m) => m.CartProductsListComponent
          )
      }
    ]
  }
];

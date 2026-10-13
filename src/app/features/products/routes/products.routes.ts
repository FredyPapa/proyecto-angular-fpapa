import { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [
    {
        path: '',
        //component: ProductHomeComponent,
        loadComponent: () => import('../component/product-home/product-home.component').then(m => m.ProductHomeComponent),
        children: [
            {
                path: '',
                redirectTo: 'products',
                pathMatch: 'full'
            },
            {
                path: 'products',
                //component: ProductListComponent
                loadComponent: () => import('../component/product-list/product-list.component').then(m => m.ProductListComponent)
            },
            {
                path: 'products/details',
                //component: ProductDetailsComponent
                loadComponent: () => import('../component/product-details/product-details.component').then(m => m.ProductDetailsComponent)
            },
            {
                path: 'products/details/:id',
                //component: ProductDetailsComponent
                loadComponent: () => import('../component/product-details/product-details.component').then(m => m.ProductDetailsComponent)
            },
        ],
    }
];

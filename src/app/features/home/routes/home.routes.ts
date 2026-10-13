import { Routes } from '@angular/router';

export const HOME_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('../component/home.component').then(m => m.HomeComponent),
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                loadComponent: () => import('../../dashboard/component/dashboard-home/dashboard-home.component').then(m => m.DashboardHomeComponent)
            },
            {
                path: 'products',
                loadChildren: () => import('../../products/routes/products.routes').then(r => r.PRODUCTS_ROUTES)
            },
            {
                path: 'users',
                loadChildren: () => import('../../users/routes/user.routes').then(r => r.USER_ROUTES)
            },
        ],
    }
];
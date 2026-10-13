import { Routes } from '@angular/router';

export const USER_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('../component/user-home/user-home.component').then(m => m.UserHomeComponent),
        children: [
            {
                path: '',
                redirectTo: 'users',
                pathMatch: 'full'
            },
            {
                path: 'users',
                loadComponent: () => import('../component/user-list/user-list.component').then(m => m.UserListComponent)
            },
            {
                path: 'users/details',
                loadComponent: () => import('../component/user-details/user-details.component').then(m => m.UserDetailsComponent)
            },
            {
                path: 'users/details/:id',
                loadComponent: () => import('../component/user-details/user-details.component').then(m => m.UserDetailsComponent)
            },
        ],
    }
];

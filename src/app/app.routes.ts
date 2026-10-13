import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'modules',
        loadChildren: () => import('./features/home/routes/home.routes').then(r => r.HOME_ROUTES)
    },
    {
        path: 'login',
        loadComponent: () => import('./core/auth/login/component/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./core/auth/register/component/user-add/user-add.component').then(m => m.UserAddComponent)
    },
    {
        path: '**',
        redirectTo: '/login'
    }
];

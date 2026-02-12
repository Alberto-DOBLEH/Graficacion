import { Routes } from '@angular/router';
import { Bienvenida } from './features/public/bienvenida/bienvenida';
import { Login } from './shared/features/auth/login/login';
import { Registro } from './shared/features/auth/registro/registro';
import { LayoutPrincipal } from './shared/layout/layout-principal';
import { Inicio } from './features/panel/inicio/inicio';
export const routes: Routes = [
  {
    path: '',
    component: Bienvenida,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'registro',
    component: Registro,
  },

  {
    path: 'app',
    component: LayoutPrincipal,
    children: [
      {
        path: 'inicio',
        loadComponent: () => import('./features/panel/inicio/inicio').then((m) => m.Inicio),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

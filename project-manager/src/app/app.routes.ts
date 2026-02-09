import { Routes } from '@angular/router';
import { Bienvenida } from './features/public/bienvenida/bienvenida';
import { Login } from './shared/features/auth/login/login';
import { Registro } from './shared/features/auth/registro/registro';
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
    path: '**',
    redirectTo: '',
  },
];

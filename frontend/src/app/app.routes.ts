import { Routes } from '@angular/router';
import { Bienvenida } from './features/public/bienvenida/bienvenida';
import { Login } from './shared/features/auth/login/login';
import { Registro } from './shared/features/auth/registro/registro';
import { LayoutPrincipal } from './shared/layout/layout-principal';

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
      {
        path: 'proyectos',
        loadComponent: () =>
          import('./features/panel/seleccion-proyecto/seleccion-proyecto').then(
            (m) => m.SeleccionProyecto
          ),
      },
      {
        path: 'crear-proyecto',
        loadComponent: () =>
          import('./features/panel/crear-proyecto/crear-proyecto').then(
            (m) => m.CrearProyecto
          ),
      },
      {
        path: 'proyecto/:id',
        loadComponent: () =>
          import('./features/panel/proyecto-detalle/proyecto-detalle').then(
            (m) => m.ProyectoDetalle
          ),
      },
      {
        path: 'proyecto/:id/tecnicas/:tipo',
        loadComponent: () =>
          import('./features/panel/tecnicas-lista/tecnicas-lista').then(
            (m) => m.TecnicasLista
          ),
      },
      {
        path: 'proyecto/:id/tecnicas/:tipo/nueva',
        loadComponent: () =>
          import('./features/panel/nueva-entrada/nueva-entrada').then(
            (m) => m.NuevaEntrada
          ),
      },
      {
        path: 'proyecto/:id/requerimientos',
        loadComponent: () =>
          import('./features/panel/requerimientos/requerimientos').then(
            (m) => m.Requerimientos
          ),
      },
      {
        path: 'proyecto/:id/diagramas',
        loadComponent: () =>
          import('./features/panel/diagramas/diagramas').then(
            (m) => m.Diagramas
          ),
      },
      {
        path: 'proyecto/:id/prompt-final',
        loadComponent: () =>
          import('./features/panel/generador-prompt/generador-prompt').then(
            (m) => m.GeneradorPrompt
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

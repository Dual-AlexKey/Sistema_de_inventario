import { Routes } from '@angular/router';

import { PrincipalComponent } from './principal/principal.component';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';

export const inventoryRoutes: Routes = [
  { path: '', component: PrincipalComponent },
  {
    path: 'inventory',
    children: [
      { path: 'productos', component: ListComponent },
      { path: 'productos/nuevo', component: FormComponent },
      { path: 'productos/editar/:id', component: FormComponent },
    ]
  },
  { path: '**', redirectTo: '' } // ruta comodín redirigiendo a principal
];

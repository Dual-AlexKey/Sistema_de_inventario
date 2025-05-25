import { Routes } from '@angular/router';

import { PrincipalComponent } from './principal/principal.component';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { ProveedoresListComponent } from './proveedores-list/proveedores-list.component';
import { ProveedoresFormComponent } from './proveedores-form/proveedores-form.component';

export const inventoryRoutes: Routes = [
  { path: '', component: PrincipalComponent },
  {
    path: 'inventory',
    children: [
      // Productos
      { path: 'productos', component: ListComponent },
      { path: 'productos/nuevo', component: FormComponent },
      { path: 'productos/editar/:id', component: FormComponent },

      // Proveedores
      { path: 'proveedores', component: ProveedoresListComponent },
      { path: 'proveedores/nuevo', component: ProveedoresFormComponent },
      { path: 'proveedores/editar/:id', component: ProveedoresFormComponent },
    ]
  },
  { path: '**', redirectTo: '' } // ruta comodín redirigiendo a principal
];

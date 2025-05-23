import { Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';

export const inventoryRoutes: Routes = [
  { path: 'productos', component: ListComponent },
  { path: 'productos/nuevo', component: FormComponent },
  { path: 'productos/editar/:id', component: FormComponent },
];

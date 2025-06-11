import { Routes } from '@angular/router';
import { LoginComponent } from '../auth/login/login.component';
 // importa bien
import { PrincipalComponent } from './principal/principal.component';
import { ListComponent } from './list/list.component';
import { FormComponent } from './form/form.component';
import { ProveedoresListComponent } from './proveedores-list/proveedores-list.component';
import { ProveedoresFormComponent } from './proveedores-form/proveedores-form.component';
import { RegisterComponent } from '../auth/register/register.component';
import { ProcesoComprasComponent } from './gestion-compras-form/gestion-compras-form.component'; // Importa el nuevo componente de compras

// Opcionalmente, un guard para proteger rutas
import { AuthGuard } from '../auth/auth.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'intro', component: PrincipalComponent },
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

       // Proceso de Compras
      { path: 'proceso-compras', component: ProcesoComprasComponent }, // Ruta para el componente de proceso de compras


      // ventas
      //{path: 'procesar-ventas', component: ProcesarVentasComponent}
    ]
  },
  { path: '**', redirectTo: 'intro',pathMatch: 'full' } // ruta comodín redirigiendo a principal
];

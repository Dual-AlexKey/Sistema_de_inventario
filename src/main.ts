import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { inventoryRoutes } from './app/inventory/inventory-routing.module';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      ...inventoryRoutes,
      { path: '', redirectTo: '/productos', pathMatch: 'full' },
      { path: '**', redirectTo: '/productos' },
    ]),
  ],
});

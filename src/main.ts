import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';


import { routes } from './app/inventory/Inventory-routing.model'; // Asegúrate de que la ruta sea correcta


 // o donde lo ubiques
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import localePe from '@angular/common/locales/es-PE';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localePe);

bootstrapApplication(AppComponent, {

    providers: [
    provideRouter(routes), // 👈 no uses inventoryRoutes aquí
    importProvidersFrom(HttpClientModule),
    provideAnimations()
  ]
});

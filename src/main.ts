import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { inventoryRoutes } from './app/inventory/inventory-routing.module';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import localePe from '@angular/common/locales/es-PE';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localePe);

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      ...inventoryRoutes,
      { path: '', redirectTo: '/productos', pathMatch: 'full' },
      { path: '**', redirectTo: '/productos' },
    ]),
    importProvidersFrom(HttpClientModule),

     provideAnimations(),  // <--- Esto importa HttpClientModule
  ],
});

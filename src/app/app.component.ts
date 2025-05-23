import { Component } from '@angular/core';
import { InventoryComponent } from './inventory/inventory.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [InventoryComponent],
  template: `<app-inventory></app-inventory>`,
})
export class AppComponent {}

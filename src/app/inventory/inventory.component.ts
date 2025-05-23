import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent {
  products = [
    { id: 1, nombre: 'Producto A', cantidad: 10, categoria: 'Categoría 1', precio: 100 },
    { id: 2, nombre: 'Producto B', cantidad: 5, categoria: 'Categoría 2', precio: 200 },
  ];

  newProduct = { id: 0, nombre: '', cantidad: 0, categoria: '', precio: 0 };

  addProduct() {
    if (!this.newProduct.nombre.trim()) return;
    this.newProduct.id = Date.now();
    this.products.push({ ...this.newProduct });
    this.newProduct = { id: 0, nombre: '', cantidad: 0, categoria: '', precio: 0 };
  }

  deleteProduct(id: number) {
    this.products = this.products.filter(p => p.id !== id);
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { ProductoService, Producto } from '../../services/producto.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule, FormsModule],  // <- Asegúrate de agregar FormsModule aquí
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  private productoService = inject(ProductoService);
  private router = inject(Router);

  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];

  searchTerm = '';

  // Paginación simple
  paginaActual = 1;
  itemsPorPagina = 10;

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.getProductos().subscribe((data) => {
      this.productos = data;
      this.filtrarProductos();
    });
  }

  filtrarProductos() {
    const term = this.searchTerm.toLowerCase();
    this.productosFiltrados = this.productos.filter((p) =>
      p.nombre.toLowerCase().includes(term)
    );
    this.paginaActual = 1;
  }

  eliminar(id: number) {
    if (!confirm('¿Eliminar este producto?')) return;
    this.productoService.deleteProducto(id).subscribe(() => {
      this.productos = this.productos.filter((p) => p.id !== id);
      this.filtrarProductos();
    });
  }

  cambiarPagina(n: number) {
    this.paginaActual = n;
  }

  editar(id: number) {
    this.router.navigate(['/productos/editar', id]);
  }

  nuevo() {
    this.router.navigate(['/productos/nuevo']);
  }

  get productosPaginados(): Producto[] {
    const start = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.productosFiltrados.slice(start, start + this.itemsPorPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.productosFiltrados.length / this.itemsPorPagina);
  }
}

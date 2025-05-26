import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ProcesarVentasService,
  OrdenCompraProducto,
} from '../../services/procesar-ventas.service';

@Component({
  selector: 'app-procesar-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './procesar-ventas.component.html',
  styleUrls: ['./procesar-ventas.component.css'],
})
export class ProcesarVentasComponent implements OnInit {
  private router = inject(Router);
  private ventasService = inject(ProcesarVentasService);

  ordenes: OrdenCompraProducto[] = [];
  productos: { id: number; nombre: string }[] = [];

  ordenesFiltradas: OrdenCompraProducto[] = [];
  ordenesPaginadas: OrdenCompraProducto[] = [];

  searchTerm = '';
  paginaActual = 1;
  itemsPorPagina = 10;
  totalPaginas = 0;

  ngOnInit(): void {
    this.ventasService.getProductos().subscribe((prods) => {
      this.productos = prods;

      this.ventasService.getOrdenes().subscribe((ordenes) => {
        this.ordenes = ordenes;
        this.filtrar();
      });
    });
  }

  volver(): void {
    this.router.navigate(['/']);
  }

  getNombreProducto(id: number): string {
    const producto = this.productos.find((p) => p.id === id);
    return producto ? producto.nombre : 'Desconocido';
  }

  filtrar(): void {
    const term = this.searchTerm.toLowerCase();
    this.ordenesFiltradas = this.ordenes.filter((o) => {
      const nombre = this.getNombreProducto(o.productos_id).toLowerCase();
      return (
        o.id.toString().includes(term) ||
        nombre.includes(term) ||
        o.cantidad.toString().includes(term) ||
        o.precio_unitario.toString().includes(term) ||
        (o.observaciones || '').toLowerCase().includes(term)
      );
    });

    this.paginaActual = 1;
    this.paginar();
  }

  paginar(): void {
    this.totalPaginas = Math.ceil(this.ordenesFiltradas.length / this.itemsPorPagina);
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.ordenesPaginadas = this.ordenesFiltradas.slice(inicio, fin);
  }

  cambiarPagina(pagina: number): void {
    this.paginaActual = pagina;
    this.paginar();
  }
}

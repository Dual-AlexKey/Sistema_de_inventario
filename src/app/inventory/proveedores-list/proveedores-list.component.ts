import { Component, OnInit, inject } from '@angular/core';
import { ProveedoresService, Proveedor } from '../../services/proveedor.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';  // importa Route

@Component({
  selector: 'app-proveedores-list',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './proveedores-list.component.html',
  styleUrls: ['./proveedores-list.component.css'],
})
export class ProveedoresListComponent implements OnInit {
  private proveedoresService = inject(ProveedoresService);
  private router = inject(Router); // inyecta Router aquí

  proveedores: Proveedor[] = [];

  proveedoresFiltrados: Proveedor[] = [];
  searchTerm = '';
  paginaActual = 1;
  itemsPorPagina = 10;

  ngOnInit(): void {
    this.cargarProveedores();
  }

 cargarProveedores() {
    this.proveedoresService.getProveedores().subscribe((data) => {
      this.proveedores = data;
      this.filtrarProveedores();
    });
  }


filtrarProveedores() {
  const term = this.searchTerm.toLowerCase();
  this.proveedoresFiltrados = this.proveedores.filter(p =>
    p.nombre.toLowerCase().includes(term)
  );
  this.paginaActual = 1;
}
onChangeItemsPorPagina() {
  this.paginaActual = 1;
  this.filtrarProveedores();
}

  eliminar(id: number) {
    if (!confirm('¿Eliminar este proveedor?')) return;
    this.proveedoresService.deleteProveedor(id).subscribe(() => {
      this.proveedores = this.proveedores.filter(p => p.id !== id);
      this.filtrarProveedores();
    });
  }

 cambiarPagina(n: number) {
  this.paginaActual = n;
}
editar(id: number) {
  this.router.navigate(['/inventory/proveedores/editar', id]);
}

  nuevo() {
    this.router.navigate(['/inventory/proveedores/nuevo']);
  }

  volver() {
    this.router.navigate(['/intro']);
  }

  get proveedoresPaginados(): Proveedor[] {
  const start = (this.paginaActual - 1) * this.itemsPorPagina;
  return this.proveedoresFiltrados.slice(start, start + this.itemsPorPagina);
}

  get totalPaginas(): number {
    return Math.ceil(this.proveedoresFiltrados.length / this.itemsPorPagina);
  }

}

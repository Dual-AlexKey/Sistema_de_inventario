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
  searchTerm = '';

  ngOnInit(): void {
    this.cargarProveedores();
  }

  cargarProveedores() {
    this.proveedoresService.getProveedores().subscribe({
      next: (data) => (this.proveedores = data),
      error: (e) => console.error(e),
    });
  }

  filtrarProveedores() {
    // Puedes implementar filtrado local o llamar al backend con query params
    if (!this.searchTerm) {
      this.cargarProveedores();
      return;
    }
    this.proveedores = this.proveedores.filter((p) =>
      p.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  eliminar(id: number) {
    if (confirm('¿Desea eliminar este proveedor?')) {
      this.proveedoresService.deleteProveedor(id).subscribe(() => {
        this.cargarProveedores();
      });
    }
  }

  volver() {
    this.router.navigate(['/']); // o la ruta principal que uses
  }
}

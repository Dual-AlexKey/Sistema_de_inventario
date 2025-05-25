import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProveedoresService, Proveedor } from '../../services/proveedor.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-proveedores-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './proveedores-form.component.html',
  styleUrls: ['./proveedores-form.component.css'],
})
export class ProveedoresFormComponent implements OnInit {
  private proveedoresService = inject(ProveedoresService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  proveedor: Partial<Proveedor> = {
    nombre: '',
    ruc: '',
    direccion: '',
    estado: true,
  };

  editMode = false;
  proveedorId?: number;

  ngOnInit(): void {
    this.proveedorId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.proveedorId) {
      this.editMode = true;
      this.cargarProveedor(this.proveedorId);
    }
  }

  cargarProveedor(id: number) {
    this.proveedoresService.getProveedorById(id).subscribe({
      next: (data) => (this.proveedor = data),
      error: (err) => {
        console.error('Error al cargar proveedor', err);
        alert('No se pudo cargar el proveedor');
        this.router.navigate(['/inventory/proveedores']);
      },
    });
  }

  guardar(form: NgForm) {
    if (form.invalid) return;

    if (this.editMode && this.proveedorId) {
      this.proveedoresService
        .updateProveedor(this.proveedorId, this.proveedor as Omit<Proveedor, 'id'>)
        .subscribe({
          next: () => {
            alert('Proveedor actualizado correctamente');
            this.router.navigate(['/inventory/proveedores']);
          },
          error: (err) => {
            console.error('Error al actualizar proveedor', err);
            alert('Error al actualizar proveedor');
          },
        });
    } else {
      this.proveedoresService
        .addProveedor(this.proveedor as Omit<Proveedor, 'id'>)
        .subscribe({
          next: () => {
            alert('Proveedor agregado correctamente');
            this.router.navigate(['/inventory/proveedores']);
          },
          error: (err) => {
            console.error('Error al agregar proveedor', err);
            alert('Error al agregar proveedor');
          },
        });
    }
  }

  cancelar() {
    this.router.navigate(['/inventory/proveedores']);
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService, Producto } from '../../services/producto.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-inventory-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  private productoService = inject(ProductoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  producto: Partial<Producto> = {
    nombre: '',
    subcategorias_id: 1,
    stock: 0,
    precio_unitario: 0,
    unidad_medida: '',
    estado: true,
  };

  editMode = false;
  productoId?: number;

  ngOnInit(): void {
    this.productoId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.productoId) {
      this.editMode = true;
      this.productoService.getProductos().subscribe((productos) => {
        const prod = productos.find((p) => p.id === this.productoId);
        if (prod) this.producto = { ...prod };
      });
    }
  }

guardar(form: NgForm) {
    if (form.invalid) return;

    if (this.editMode && this.productoId) {
      this.productoService
        .updateProducto(this.productoId, this.producto as Omit<Producto, 'id'>)
        .subscribe(() => {
          alert('Producto actualizado!');
          this.router.navigate(['/productos']);
        });
    } else {
      this.productoService
        .addProducto(this.producto as Omit<Producto, 'id'>)
        .subscribe(() => {
          alert('Producto agregado!');
          this.router.navigate(['/productos']);
        });
    }
  }
  cancelar() {
    this.router.navigate(['/productos']);
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService, Producto } from '../../services/producto.service';
import { CategoriaService, Categoria, Subcategoria } from '../../services/categoria.service';
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
  private categoriaService = inject(CategoriaService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  producto: Partial<Producto> = {
    nombre: '',
    subcategorias_id: 0,
    stock: 0,
    precio_unitario: 0,
    unidad_medida: '',
    estado: true,
  };

  categorias: Categoria[] = [];
  subcategorias: Subcategoria[] = [];

  categoriaSeleccionada!: number;

  editMode = false;
  productoId?: number;

  ngOnInit(): void {
    // Cargar categorías
    this.categoriaService.getCategorias().subscribe((cats) => {
      this.categorias = cats;
      if (cats.length > 0) {
        // Si está editando, cargará subcategorías después de cargar producto
        if (!this.editMode) {
          this.categoriaSeleccionada = cats[0].id;
          this.cargarSubcategorias();
        }
      }
    });

    // Cargar producto si editMode
    this.productoId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.productoId) {
      this.editMode = true;
      this.productoService.getProductoById(this.productoId).subscribe((prod) => {
        this.producto = { ...prod };
        // Asignar categoría basada en subcategoría (asumiendo backend o lógica propia)
        this.categoriaSeleccionada = this.getCategoriaIdFromSubcategoria(this.producto.subcategorias_id);
        this.cargarSubcategorias(true);
      });
    }
  }

  cargarSubcategorias(setSelected = false) {
    this.categoriaService.getSubcategorias(this.categoriaSeleccionada).subscribe((subs) => {
      this.subcategorias = subs;
      if (subs.length > 0) {
        if (setSelected) {
          // Si el producto ya tiene subcategoría asignada, validar que exista en la lista
          if (!this.subcategorias.some((s) => s.id === this.producto.subcategorias_id)) {
            this.producto.subcategorias_id = subs[0].id;
          }
        } else {
          this.producto.subcategorias_id = subs[0].id;
        }
      }
    });
  }

  getCategoriaIdFromSubcategoria(subcategoriaId: number | undefined): number {
    // Aquí puedes implementar la lógica para obtener la categoría de una subcategoría.
    // Si no tienes endpoint, podrías obtenerlo consultando todas las subcategorias y buscando la que coincida
    // Para simplificar, retorna 0 o la primera categoría

    if (!subcategoriaId) return 0;

    const sub = this.subcategorias.find((s) => s.id === subcategoriaId);
    return sub ? sub.categorias_id : 0;
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


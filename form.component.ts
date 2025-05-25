import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService, Producto } from '../../services/producto.service';
import { CategoriaService, Categoria, Subcategoria } from '../../services/categoria.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm,NgModel } from '@angular/forms';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-inventory-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],

  animations: [
    trigger('errorState', [
      state('visible', style({
        opacity: 1,
        maxHeight: '40px',
        marginTop: '4px',
        padding: '*',
      })),
      state('hidden', style({
        opacity: 0,
        maxHeight: '0px',
        marginTop: '0px',
        padding: '0px',
      })),
      transition('visible <=> hidden', animate('300ms ease-in-out')),
    ]),
  ],
})
export class FormComponent implements OnInit {
  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  producto: Partial<Producto> = {
    nombre: '',
    subcategorias_id: 0,
    unidad_medida: '',
    estado: true,
  };

  categorias: Categoria[] = [];
  subcategorias: Subcategoria[] = [];

  categoriaSeleccionada!: number;

  editMode = false;
  productoId?: number;
ngOnInit(): void {
  this.categoriaService.getCategorias().subscribe((cats) => {
    this.categorias = cats;

    this.productoId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.productoId) {
      this.editMode = true;
      this.productoService.getProductoById(this.productoId).subscribe((prod) => {
        this.producto = { ...prod };

        // Obtener la subcategoría para saber su categoria
        this.categoriaService.getSubcategoriaById(this.producto.subcategorias_id!).subscribe(subcat => {
          this.categoriaSeleccionada = subcat.categorias_id;
          this.cargarSubcategorias(true);
        });
      });
    } else {
      // Si es nuevo producto, selecciona la primera categoria y carga sus subcategorías
      if (cats.length > 0) {
        this.categoriaSeleccionada = cats[0].id;
        this.cargarSubcategorias(false);
      }
    }
  });
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
          this.router.navigate(['/inventory/productos']);
        });
    } else {
      this.productoService
        .addProducto(this.producto as Omit<Producto, 'id'>)
        .subscribe(() => {
          alert('Producto agregado!');
          this.router.navigate(['/inventory/productos']);
        });
    }
  }

  cancelar() {
    this.router.navigate(['/inventory/productos']);
  }
   // Método para controlar el estado de la animación de error
  getErrorState(control: NgModel | null): 'visible' | 'hidden' {
    return (control?.invalid && control?.touched) ? 'visible' : 'hidden';
  }





}


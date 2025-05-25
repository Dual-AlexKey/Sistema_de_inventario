import { Component, OnInit, inject } from '@angular/core';
import { ProductoService, Producto } from '../../services/producto.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Categoria, CategoriaService, Subcategoria } from '../../services/categoria.service';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';


@Component({
  selector: 'app-inventory-list',
  standalone: true,
  imports: [CommonModule, FormsModule],  // <- Asegúrate de agregar FormsModule aquí
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  animations: [
    trigger('listAnimation', [
      transition(':leave', [
        style({ height: '*', opacity: 1 }),
        animate('400ms ease', style({ height: '0px', opacity: 0, padding: '0', margin: '0' }))
      ])
    ]),
  ]
})
export class ListComponent implements OnInit {
  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);
  private router = inject(Router);

  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categorias: Categoria[] = []; // Cambiado a Categoria[] = [];

  categoriaSeleccionada: string = '';
  subcategorias: Subcategoria[] = []; // Cambiado a Subcategoria[] = [];

  allSubcategorias: Subcategoria[] = [];
  searchTerm = '';

  // Paginación simple
  paginaActual = 1;
  itemsPorPagina: number = 10;  // controla cantidad de elementos por página


  ngOnInit(): void {

     // Cargar categorías y todas las subcategorías
    this.categoriaService.getCategorias().pipe(
      switchMap(cats => {
        this.categorias = cats;
        return forkJoin(cats.map(cat => this.categoriaService.getSubcategorias(cat.id)));
      }),
      map(subsArrays => subsArrays.flat())
    ).subscribe(subs => {
      this.allSubcategorias = subs;
      this.subcategorias = subs; // para mostrar o usar en filtro
    });

    this.cargarProductos();
  }

getAllSubcategorias(): Observable<Subcategoria[]> {
  return this.categoriaService.getCategorias().pipe(
    switchMap(categorias =>
      forkJoin(categorias.map(cat => this.getAllSubcategorias()))
    ),
    map(subcategoriasArrays => subcategoriasArrays.flat())
  );
}


  cargarProductos() {
    this.productoService.getProductos().subscribe((data) => {
      this.productos = data;
      this.filtrarProductos();
    });
  }
filtrarPorCategoria() {
  if (this.categoriaSeleccionada) {
    this.categoriaService.getSubcategorias(Number(this.categoriaSeleccionada)).subscribe(subs => {
      this.subcategorias = subs;
      this.filtrarProductos();  // Aquí filtras productos con subcategorías cargadas
    });
  } else {
    this.subcategorias = [];
    this.filtrarProductos();
  }
}
filtrarProductos() {
   const term = this.searchTerm.toLowerCase();
    const selectedCatId = Number(this.categoriaSeleccionada);

    this.productosFiltrados = this.productos.filter(p => {
      const matchesNombre = p.nombre.toLowerCase().includes(term);

      if (!this.categoriaSeleccionada) {
        return matchesNombre;
      }

      const subcat = this.allSubcategorias.find(s => s.id === p.subcategorias_id);
      const matchesCategoria = subcat?.categorias_id === selectedCatId;

      return matchesNombre && matchesCategoria;
    });

    this.paginaActual = 1;
}





eliminar(id: number, event: Event) {
  if (!confirm('¿Eliminar este producto?')) return;

  const targetRow = (event.target as HTMLElement).closest('tr');
  if (!targetRow) return;

  // Añadir clase para animar colapso
  targetRow.classList.add('eliminando');

  setTimeout(() => {
    this.productoService.deleteProducto(id).subscribe(() => {
      this.productos = this.productos.filter((p) => p.id !== id);
      this.filtrarProductos();
    });
  }, 800); // Espera el tiempo de la animación CSS
}


  cambiarPagina(n: number) {
    this.paginaActual = n;
  }

  editar(id: number) {
    this.router.navigate(['/inventory/productos/editar', id]);
  }

obtenerNombreCategoriaPorSubcategoria(subcatId?: number): string {
   if (!subcatId) return 'Sin subcategoría';

    const subcat = this.allSubcategorias.find(s => s.id === subcatId);
    if (!subcat) return 'Sin subcategoría';

    const cat = this.categorias.find(c => c.id === subcat.categorias_id);
    return cat ? cat.nombre : 'Sin categoría';
  }




  nuevo() {
    this.router.navigate(['/inventory/productos/nuevo']);
  }
  volver() {
  this.router.navigate(['/']); // O la ruta que uses para la página principal
}


cambiarItemsPorPagina(n: number) {
  this.itemsPorPagina = n;
  this.paginaActual = 1;  // resetear a página 1 para evitar páginas vacías
  this.filtrarProductos(); // aplicar filtro para refrescar la tabla
}

get productosPaginados(): Producto[] {
  const start = (this.paginaActual - 1) * this.itemsPorPagina;
  return this.productosFiltrados.slice(start, start + this.itemsPorPagina);
}


  get totalPaginas(): number {
    return Math.ceil(this.productosFiltrados.length / this.itemsPorPagina);
  }
}

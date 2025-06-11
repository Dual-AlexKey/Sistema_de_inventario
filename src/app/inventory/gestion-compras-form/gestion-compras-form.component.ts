import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { CompraService } from '../../services/compra.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proceso-compras',
  standalone: true,
  imports: [CommonModule, RouterModule, NgForOf, FormsModule],
  templateUrl: './gestion-compras-form.component.html',
  styleUrls: ['./gestion-compras-form.component.css']
})
export class ProcesoComprasComponent implements OnInit {
  private compraService = inject(CompraService);
  private router = inject(Router);

  compras: any[] = [];
  proveedores: any[] = [];
  productos: any[] = [];
  productosFiltrados: any[] = [];
  subcategorias: any[] = [];
  marcas: string[] = [];

  selectedProveedor: number = 0;  // Esta es la propiedad que falta
  proveedorSeleccionado: number = 0;
  fechaCompra: string = '';
  cantidad: number = 0;
  precioUnitario: number = 0;
  productosSeleccionados: any[] = [];
  productoSeleccionado: number = 0;
  observaciones: string = '';
  searchTerm: string = '';
  selectedSubcategoria: number = 0;
  selectedMarca: string = '';

  // Control de visibilidad de modales
  mostrarModal: boolean = false;
  mostrarModalProducto: boolean = false;

  // Variables para paginación
  paginaActual: number = 1;
  productosPorPagina: number = 5;

  compraNumero: string = ''; // Agregar la propiedad compraNumero

  ngOnInit(): void {
    this.cargarProveedores();
    this.cargarProductos();
    this.cargarSubcategorias();
    this.cargarMarcas();
    this.cargarCompras();
  }

  cargarProveedores() {
    this.compraService.getProveedores().subscribe((data) => {
      this.proveedores = data;
    });
  }

  cargarProductos() {
    this.compraService.getProductos().subscribe((data) => {
      this.productos = data;
      this.productosFiltrados = data;
    });
  }

  cargarSubcategorias() {
    this.compraService.getSubcategorias().subscribe((data) => {
      this.subcategorias = data;
    });
  }

  cargarMarcas() {
    this.compraService.getMarcas().subscribe((data) => {
      this.marcas = data;
    });
  }

  cargarCompras() {
    this.compraService.getCompras().subscribe((data) => {
      this.compras = data;
    });
  }

  filtrarProductos() {
    this.productosFiltrados = this.productos.filter((producto) => {
      const matchesSearchTerm = producto.nombre.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesSubcategoria = this.selectedSubcategoria ? producto.subcategorias_id === this.selectedSubcategoria : true;
      const matchesMarca = this.selectedMarca ? producto.marca.toLowerCase().includes(this.selectedMarca.toLowerCase()) : true;
      return matchesSearchTerm && matchesSubcategoria && matchesMarca;
    });
  }


   // Método para filtrar compras
  filtrarCompras() {
    // Aquí puedes agregar la lógica para filtrar compras por proveedor o término de búsqueda
    this.compras = this.compras.filter(compra =>
      (this.selectedProveedor === 0 || compra.proveedor.id === this.selectedProveedor) &&
      (this.searchTerm === '' || compra.proveedor.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }
 editarCompra(compra: any) {
    console.log('Editando compra', compra);
    // Aquí puedes agregar la lógica para editar una compra
  }

  // Método para eliminar compra
  eliminarCompra(compraId: number) {
    console.log('Eliminando compra', compraId);
    // Aquí puedes agregar la lógica para eliminar una compra
  }
   volver() {
    this.router.navigate(['/intro']); // Cambia esta ruta a la que quieras navegar
  }

  // Paginación
  anteriorPagina() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
    }
  }

  siguientePagina() {
    if (this.paginaActual < Math.ceil(this.productosFiltrados.length / this.productosPorPagina)) {
      this.paginaActual++;
    }
  }

  // Abre el modal para agregar productos
  openModal() {
    this.mostrarModal = true;
  }

  // Cierra el modal de agregar productos
  closeModal() {
    this.mostrarModal = false;
  }

  agregarProducto(producto: any) {
    const productoSeleccionado = {
      producto_id: producto.id,
      cantidad: this.cantidad,
      precioUnitario: producto.precio_unitario,
      descripcion: producto.nombre
    };
    this.productosSeleccionados.push(productoSeleccionado);
    this.mostrarModalProducto = false;
  }

  // Registrar compra
  registrarCompra(form: NgForm) {
    if (form.invalid) return;
    const compraData = {
      proveedor_id: this.proveedorSeleccionado,
      fecha: this.fechaCompra,
      productos: this.productosSeleccionados,
    };
    this.compraService.registrarCompra(compraData).subscribe({
      next: () => {
        alert('Compra registrada exitosamente');
        this.router.navigate(['/inventory/proceso-compras']);
      },
      error: (err) => {
        console.error('Error al registrar compra', err);
        alert('Hubo un problema al registrar la compra');
      },
    });
  }
}

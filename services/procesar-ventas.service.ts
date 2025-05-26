import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Producto {
  id: number;
  nombre: string;
}

export interface OrdenCompraProducto {
  id: number;
  orden_compra_id: number;
  productos_id: number;
  cantidad: number;
  precio_unitario: number;
  observaciones: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ProcesarVentasService {
  private http = inject(HttpClient);

  private productosUrl = 'http://localhost:3000/api/productos';
  private ordenesUrl = 'http://localhost:3000/api/ordenes-compra-productos';

  // Solo traer id y nombre
  getProductos(): Observable<{ id: number; nombre: string }[]> {
    return this.http.get<Producto[]>(this.productosUrl).pipe(
      map(productos =>
        productos.map(({ id, nombre }) => ({ id, nombre }))
      )
    );
  }

  getOrdenes(): Observable<OrdenCompraProducto[]> {
    return this.http.get<OrdenCompraProducto[]>(this.ordenesUrl);
  }
}

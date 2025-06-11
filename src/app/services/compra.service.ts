import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  private apiUrl = 'http://localhost:3000/api'; // Reemplaza con la URL de tu backend

  constructor(private http: HttpClient) {}

  // Obtener proveedores
  getProveedores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/proveedores`);
  }

  // Obtener productos
  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/productos`);
  }

  // Obtener subcategorías
  getSubcategorias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categorias/subcategorias`);  // Cambia esta URL si es necesario
  }

  // Obtener marcas
  getMarcas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/productos/marcas`);  // Cambia esta URL si es necesario
  }

  // Registrar una compra
  registrarCompra(compraData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/compras`, compraData);
  }

  // Obtener compras
  getCompras(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/compras`);
  }
}

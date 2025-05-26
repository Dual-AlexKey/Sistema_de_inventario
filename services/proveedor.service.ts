import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Proveedor {
  id?: number;
  nombre: string;
  ruc: string;
  direccion: string;
  estado: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ProveedoresService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api/proveedores';

  getProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(this.baseUrl);
  }

  getProveedorById(id: number): Observable<Proveedor> {
    return this.http.get<Proveedor>(`${this.baseUrl}/${id}`);
  }

  addProveedor(proveedor: Omit<Proveedor, 'id'>): Observable<Proveedor> {
    return this.http.post<Proveedor>(this.baseUrl, proveedor);
  }

  updateProveedor(id: number, proveedor: Omit<Proveedor, 'id'>): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, proveedor);
  }

  deleteProveedor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

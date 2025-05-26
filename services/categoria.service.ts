import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Categoria {
  id: number;
  nombre: string;
}

export interface Subcategoria {
  id: number;
  nombre: string;
  categorias_id: number;
}

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api';

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.baseUrl}/categorias`);
  }

  getSubcategorias(categoriaId: number): Observable<Subcategoria[]> {
    return this.http.get<Subcategoria[]>(`${this.baseUrl}/subcategorias/${categoriaId}`);
  }
getAllSubcategorias(): Observable<Subcategoria[]> {
  return this.http.get<Subcategoria[]>(`${this.baseUrl}/subcategorias`);
}
getSubcategoriaById(id: number): Observable<Subcategoria> {
  return this.http.get<Subcategoria>(`${this.baseUrl}/subcategorias/id/${id}`);
}



}

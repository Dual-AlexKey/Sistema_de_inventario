
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';




@Injectable({ providedIn: 'root' })

export class AuthService {
  private baseUrl = 'http://localhost:3000/api';

  private tokenKey = 'token';

  private isLoggedInFlag = false;
  constructor(private http: HttpClient) {}

  login(correo: string, contrasena: string) {
  return this.http.post<{ token: string }>(`${this.baseUrl}/login`, { correo, contrasena }).pipe(
    tap(response => {
      localStorage.setItem('token', response.token); // Guarda el token
    })
  );
}

  guardarToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  eliminarToken() {
    localStorage.removeItem(this.tokenKey);
  }
isAuthenticated(): boolean {
  const token = localStorage.getItem('token');
  console.log('Token actual:', token);  // DEBUG
  return !!token;
}




  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  register(nombre: string, correo: string, contrasena: string, cargos_id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, { nombre, correo, contrasena, cargos_id });
  }

}

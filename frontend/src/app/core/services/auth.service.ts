import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of } from 'rxjs';
import { API_URL } from './api.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private CURRENT_USER_KEY = 'project_manager_session';

  constructor(private http: HttpClient) {}

  registro(datos: any): Observable<any> {
    return this.http.post<any>(`${API_URL}/participantes`, {
      nombre: datos.nombre,
      email: datos.email,
      password: datos.password
    });
  }

  login(email: string, pass: string): Observable<any> {

    return this.http.post<any>(`${API_URL}/auth/login`, {
      email: email,
      password: pass
    }).pipe(
      tap(res => {
        const session = {
          id: res.usuario.id,
          nombre: res.usuario.nombre,
          email: email,
          token: res.token
        };
        this.guardarSesion(session);
      })
    );
  }

  private guardarSesion(usuario: any) {
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(usuario));
  }

  logout() {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  estaLogueado(): boolean {
    return !!localStorage.getItem(this.CURRENT_USER_KEY);
  }

  obtenerSesion(): any {
    const raw = localStorage.getItem(this.CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}

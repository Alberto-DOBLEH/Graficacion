import { Injectable } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private USERS_KEY = 'project_manager_users';
  private CURRENT_USER_KEY = 'project_manager_session';

  constructor() {}

  registro(datos: any): Observable<any> {
    const usuarios = this.obtenerUsuarios();

    const existe = usuarios.find((u: any) => u.email === datos.email);
    if (existe) {
      return throwError(() => new Error('El correo ya está registrado'));
    }
    usuarios.push(datos);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(usuarios));

    return of({ mensaje: 'Usuario registrado con éxito' }).pipe(delay(1500));
  }

  login(email: string, pass: string): Observable<any> {
    const usuarios = this.obtenerUsuarios();

    const usuario = usuarios.find((u: any) => u.email === email && u.password === pass);

    if (usuario) {
      this.guardarSesion(usuario);
      return of(usuario).pipe(delay(1500));
    } else {
      return throwError(() => new Error('Credenciales incorrectas')).pipe(delay(1500));
    }
  }

  private obtenerUsuarios(): any[] {
    const usuarios = localStorage.getItem(this.USERS_KEY);
    return usuarios ? JSON.parse(usuarios) : [];
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
}

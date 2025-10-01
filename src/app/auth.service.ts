import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from './models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/users'; 

  constructor(private http: HttpClient) {}

  /**
   * Método de login:
   * Consulta en JSON Server si existe un usuario con el email y password dados.
   * Devuelve el usuario encontrado o null si no existe.
   */
  login(email: string, password: string): Observable<User | null> {
    return this.http
      .get<User[]>(`${this.apiUrl}?email=${email}&password=${password}`)
      .pipe(
        map(users => {
          if (users.length > 0) {
            return users[0]; // Usuario encontrado
          } else {
            return null; // Credenciales inválidas
          }
        })
      );
  }

  /**
   * Guardar sesión en localStorage
   */
  setSession(users: User): void {
    localStorage.setItem('currentUser', JSON.stringify(users));
  }

  /**
   * Obtener usuario actual de la sesión
   */
  getCurrentUser(): User | null {
    const users = localStorage.getItem('currentUser');
    return users ? JSON.parse(users) : null;
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    localStorage.removeItem('currentUser');
  }
}

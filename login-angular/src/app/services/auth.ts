import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    return this.http.get<any[]>(`${this.apiUrl}?email=${email}&password=${password}`)
      .pipe(map(users => users.length > 0));
  }

}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class Login {
  loginForm: FormGroup;
  errorMessage: string = '';
  submitted = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (users) => {
          if (users) {
            this.authService.setSession(users); // guarda sesión en localStorage
            this.errorMessage = '';
            this.router.navigate(['/home']);   // redirige a la ruta que quieras
          } else {
            this.errorMessage = 'Credenciales inválidas.';
          }
        },
        error: () => {
          this.errorMessage = 'Ocurrió un error al intentar iniciar sesión.';
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule] // 👈 aquí el fix
})
export class Login {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  submitted = false;

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (success) => {
          if (success) {
            this.router.navigate(['/home']);
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

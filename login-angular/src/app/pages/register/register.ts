import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  providers: [AuthService]
})
export class Register {
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  submitted = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.valid) {
      const { nombre, apellido, email, password } = this.registerForm.value;

      this.authService.register(nombre, apellido, email, password).subscribe({
        next: (success: boolean) => {
          if (success) {
            this.successMessage = 'Usuario registrado con éxito. Redirigiendo...';
            setTimeout(() => this.router.navigate(['/login']), 1500);
          } else {
            this.errorMessage = 'Error al registrar el usuario.';
          }
        },
        error: (err) => {
          this.errorMessage = err.message || 'Ocurrió un error al intentar registrar.';
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
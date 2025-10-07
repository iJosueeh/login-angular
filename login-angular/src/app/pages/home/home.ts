import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})

export class Home implements OnInit {
  user: User | null = null;
  showPassword = false;
  isDeleteChecked = false;
  editingUser: User | null = null;
  validationErrors: any = {}; 

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  confirmDelete(): void {
    if (this.user) {
      this.authService.deleteAccount(this.user.id).subscribe({
        next: () => {
          this.logout();
        },
        error: (err) => {
          console.error('Error deleting account', err);
        }
      });
    }
  }

  openEditModal(): void {
    if (this.user) {
      this.editingUser = { ...this.user };
      this.validationErrors = {}; 
    }
  }

  validateEditForm(): boolean {
    this.validationErrors = {};
    let isValid = true;

    if (!this.editingUser?.nombre) {
      this.validationErrors.nombre = 'El nombre es requerido.';
      isValid = false;
    }
    if (!this.editingUser?.apellido) {
      this.validationErrors.apellido = 'El apellido es requerido.';
      isValid = false;
    }
    if (!this.editingUser?.email) {
      this.validationErrors.email = 'El email es requerido.';
      isValid = false; 
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(this.editingUser.email)) {
      this.validationErrors.email = 'El email no es válido.';
      isValid = false;
    }
    if (!this.editingUser?.password) {
      this.validationErrors.password = 'La contraseña es requerida.';
      isValid = false;
    }

    return isValid;
  }

  applyEdit(): void {
    if (this.editingUser && this.user) {
      if (!this.validateEditForm()) {
        return; 
      }

      this.authService.updateUser(this.editingUser).subscribe({
        next: (updatedUser) => {
          this.user = updatedUser;
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          this.editingUser = null;
        },
        error: (err) => {
          console.error('Error updating user', err);
        }
      });
    }
  }
}
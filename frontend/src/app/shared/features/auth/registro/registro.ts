import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  private router = inject(Router);
  private authService = inject(AuthService);

  @Output() closeModal = new EventEmitter<void>();

  nombre: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  cargando: boolean = false;

  onRegister() {
    this.errorMessage = '';

    if (!this.nombre || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Todos los campos son obligatorios';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    this.cargando = true;

    this.authService.registro({
      nombre: this.nombre,
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res: any) => {
        // Intentar hacer login automático para crear la sesión
        this.authService.login(this.email, this.password).subscribe({
          next: () => {
            this.cargando = false;
            this.router.navigate(['/app/proyectos']);
            this.closeModal.emit();
          },
          error: (err: any) => {
            this.cargando = false;
            this.router.navigate(['/app/proyectos']);
            this.closeModal.emit();
          }
        });
      },
      error: (err: any) => {
        this.cargando = false;
        this.errorMessage = err.error?.error || 'El email ya se encuentra registrado o hubo un error';
      }
    });
  }
}

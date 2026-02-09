import { Component, inject, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  @Output() closeModal = new EventEmitter<void>();

  email: string = '';
  password: string = '';
  cargando: boolean = false;
  error: string = '';
  emailError: string = '';

  ngOnInit() {
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.email = '';
    this.password = '';
    this.error = '';
    this.emailError = '';
    this.cargando = false;
  }

  private esEmailValido(email: string): boolean {
    const patron = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return patron.test(email);
  }

  onEmailChange() {
    if (this.email.trim() === '') {
      this.emailError = 'El correo es obligatorio';
    } else if (!this.esEmailValido(this.email)) {
      this.emailError = 'Ingresa un correo válido (ej: usuario@dominio.com)';
    } else {
      this.emailError = '';
    }
  }

  onLogin() {
    this.error = '';

    if (!this.email || !this.password) {
      this.error = 'Por favor, completa todos los campos.';
      return;
    }

    this.cargando = true;

    this.authService.login(this.email, this.password).subscribe({
      next: (usuario) => {
        console.log('✅ Login exitoso', usuario);
        this.cargando = false;
        alert(`¡Bienvenido de nuevo, ${usuario.nombre || 'Usuario'}!`);
        this.closeModal.emit();
        this.router.navigate(['/app/inicio']);
      },
      error: (err) => {
        console.error('❌ Error de login', err);
        this.cargando = false;
        this.error = err.message || 'Error al iniciar sesión';
      },
    });
  }

  crearUsuarioDePrueba() {
    const usuarioTest = {
      email: 'admin@gmail.com',
      password: '123',
      nombre: 'Admin',
    };

    const key = 'project_manager_users';
    localStorage.setItem(key, JSON.stringify([usuarioTest]));
    console.log('Usuario de prueba creado: admin@gmail.com / 123');
  }
}

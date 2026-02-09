import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private router = inject(Router);

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

    if (this.emailError) {
      this.error = 'Por favor, corrige el correo electrónico.';
      return;
    }

    console.log('📤 Conectando con servidor...', { email: this.email, password: this.password });
    this.cargando = true;

    setTimeout(() => {
      this.cargando = false;

      if (this.email.includes('@')) {
        console.log('✅ Login exitoso');

        this.router.navigate(['/projects']);
      } else {
        this.error = 'Credenciales incorrectas. Intenta de nuevo.';
      }
    }, 2000);
  }
}

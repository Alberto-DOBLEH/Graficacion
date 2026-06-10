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
  errorMessage: string = '';

  ngOnInit() { }

  onEmailChange() { }

  onLogin() {
    this.errorMessage = '';
    if (!this.email || !this.password) {
      this.errorMessage = 'Email y contraseña son obligatorios';
      return;
    }

    this.cargando = true;
    this.authService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        this.cargando = false;
        this.router.navigate(['/app/inicio']);
        this.closeModal.emit();
      },
      error: (err: any) => {
        this.cargando = false;
        this.errorMessage = err.error?.error || 'Credenciales incorrectas';
      }
    });
  }
}

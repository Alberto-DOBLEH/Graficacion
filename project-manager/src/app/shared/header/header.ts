import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Login } from '../features/auth/login/login';
import { Registro } from '../features/auth/registro/registro';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, Login, Registro],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {
  isScrolled = false;
  showLoginModal = false;
  showRegisterModal = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  openLoginModal() {
    this.showLoginModal = true;
  }

  closeLoginModal() {
    this.showLoginModal = false;
  }

  openRegisterModal() {
    this.showRegisterModal = true;
  }

  closeRegisterModal() {
    this.showRegisterModal = false;
  }
}

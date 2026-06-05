import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import { ProjectService, Proyecto } from '../../../core/services/project.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit {
  private auth = inject(AuthService);
  private ps = inject(ProjectService);

  userName = 'Usuario';
  proyectos: Proyecto[] = [];
  stats = {
    proyectosActivos: 0,
    totalRequerimientos: 0,
    totalEntradas: 0
  };

  ngOnInit() {
    const sesion = this.auth.obtenerSesion();
    if (sesion && sesion.nombre) {
      this.userName = sesion.nombre;
    }

    this.proyectos = this.ps.getProyectos();
    this.stats.proyectosActivos = this.proyectos.filter(p => p.estado === 'activo').length;

    let reqsCount = 0;
    let entradasCount = 0;
    this.proyectos.forEach(p => {
      reqsCount += this.ps.getRequerimientos(p.id).length;
      entradasCount += this.ps.getTodasLasEntradas(p.id).length;
    });

    this.stats.totalRequerimientos = reqsCount;
    this.stats.totalEntradas = entradasCount;
  }
}

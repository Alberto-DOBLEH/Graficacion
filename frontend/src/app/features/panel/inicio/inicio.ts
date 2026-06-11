import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs';
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
  private cdr = inject(ChangeDetectorRef);

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
    this.cdr.markForCheck();

    this.ps.listarProyectos().subscribe({
      next: (proyectos) => {
        this.proyectos = proyectos;
        this.stats.proyectosActivos = proyectos.filter(p => p.estado === 'activo').length;
        this.cdr.markForCheck();

        if (proyectos.length === 0) return;

        const reqs$ = proyectos.map(p => this.ps.getRequerimientos(p.id_proyecto!));
        const entradas$ = proyectos.map(p => this.ps.getTodasLasEntradas(p.id_proyecto!));

        forkJoin(reqs$).subscribe(allReqs => {
          this.stats.totalRequerimientos = allReqs.reduce((sum, r) => sum + r.length, 0);
          this.cdr.markForCheck();
        });

        forkJoin(entradas$).subscribe(allEntradas => {
          this.stats.totalEntradas = allEntradas.reduce((sum, e) => sum + e.length, 0);
          this.cdr.markForCheck();
        });
      },
      error: () => {
        this.cdr.markForCheck();
      }
    });
  }
}

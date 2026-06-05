import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ProjectService, Proyecto } from '../../../core/services/project.service';

@Component({
  selector: 'app-seleccion-proyecto',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './seleccion-proyecto.html',
  styleUrl: './seleccion-proyecto.css',
})
export class SeleccionProyecto implements OnInit {
  private projectService = inject(ProjectService);
  private router = inject(Router);

  proyectos: Proyecto[] = [];

  ngOnInit() {
    this.proyectos = this.projectService.getProyectos();
  }

  abrirProyecto(id: string) {
    this.router.navigate(['/app/proyecto', id]);
  }

  estadoClase(estado: string): string {
    const mapa: Record<string, string> = {
      activo: 'badge-activo',
      pausado: 'badge-pausado',
      completado: 'badge-completado',
    };
    return mapa[estado] || 'badge-activo';
  }

  estadoLabel(estado: string): string {
    const mapa: Record<string, string> = {
      activo: 'Activo',
      pausado: 'Pausado',
      completado: 'Completado',
    };
    return mapa[estado] || estado;
  }

  formatFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}

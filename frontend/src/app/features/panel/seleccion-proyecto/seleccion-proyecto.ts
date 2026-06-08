import { Component, inject, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);  // 👈 agrega esto
  private ngZone = inject(NgZone);

  proyectos: Proyecto[] = [];
  cargando = true;
  errorMsg = '';

  ngOnInit() {
    this.projectService.listarProyectos().subscribe({
      next: (data) => {
        this.ngZone.run(() => {
          console.log('proyectos recibidos:', data);
          this.proyectos = data;
          this.cargando = false;
          this.cdr.detectChanges();  // 👈 agrega esto
        });
      },
      error: (err) => {
        this.ngZone.run(() => {  // 👈
          console.error('error:', err);
          this.errorMsg = 'No se pudieron cargar los proyectos.';
          this.cargando = false;
        });
      }
    });
  }

  abrirProyecto(id: number | string) {
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
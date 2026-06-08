import { Component, inject, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs';
import { ProjectService, Proyecto, EntradaTecnica } from '../../../core/services/project.service';

export interface TecnicaCard {
  tipo: string;
  nombre: string;
  descripcion: string;
  icono: string;
  color: string;
}

@Component({
  selector: 'app-proyecto-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './proyecto-detalle.html',
  styleUrl: './proyecto-detalle.css',
})
export class ProyectoDetalle implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private projectService = inject(ProjectService);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  proyecto: Proyecto | undefined;
  proyectoId = '';
  entradas: EntradaTecnica[] = [];
  cargando = true;

  tecnicas: TecnicaCard[] = [
    { tipo: 'entrevistas', nombre: 'Entrevistas', descripcion: 'Conversaciones estructuradas con stakeholders para obtener requisitos', icono: 'mic', color: '#6366f1' },
    { tipo: 'cuestionarios', nombre: 'Cuestionarios', descripcion: 'Recolección masiva de información mediante preguntas cerradas/abiertas', icono: 'assignment', color: '#f59e0b' },
    { tipo: 'observacion', nombre: 'Observación', descripcion: 'Análisis directo del entorno y comportamiento del usuario en su trabajo', icono: 'visibility', color: '#10b981' },
    { tipo: 'taller-jad', nombre: 'Taller JAD/RAD', descripcion: 'Sesiones grupales facilitadas para definir y priorizar requisitos', icono: 'groups', color: '#ec4899' },
    { tipo: 'prototipado', nombre: 'Prototipado', descripcion: 'Modelos visuales o funcionales para validar ideas con el cliente', icono: 'desktop_mac', color: '#3b82f6' },
    { tipo: 'casos-de-uso', nombre: 'Casos de Uso', descripcion: 'Escenarios de interacción entre actores y el sistema', icono: 'design_services', color: '#00e676' },
  ];

  ngOnInit() {
    this.proyectoId = this.route.snapshot.paramMap.get('id') ?? '';

    forkJoin({
      proyecto: this.projectService.obtenerProyecto(this.proyectoId),
      entradas: this.projectService.getTodasLasEntradas(this.proyectoId),
    }).subscribe({
      next: (res) => {
        this.ngZone.run(() => {
          this.proyecto = res.proyecto;
          this.entradas = res.entradas;
          this.cargando = false;
          this.cdr.detectChanges();  // 👈
        });
      },
      error: (err) => {
        console.error('Error en proyecto detalle:', err);
        this.ngZone.run(() => {
          this.cargando = false;
          this.cdr.detectChanges();  // 👈
        });
      }
    });
  }

  contarEntradas(tipo: string): number {
    return this.entradas.filter(e => e.tipo === tipo).length;
  }

  irATecnica(tipo: string) {
    this.router.navigate(['/app/proyecto', this.proyectoId, 'tecnicas', tipo]);
  }

  estadoBadgeClass(estado: string): string {
    const mapa: Record<string, string> = { activo: 'badge-activo', pausado: 'badge-pausado', completado: 'badge-completado' };
    return mapa[estado] || 'badge-activo';
  }

  estadoLabel(estado: string): string {
    const mapa: Record<string, string> = { activo: 'Activo', pausado: 'Pausado', completado: 'Completado' };
    return mapa[estado] || estado;
  }

  irARequerimientos() { this.router.navigate(['/app/proyecto', this.proyectoId, 'requerimientos']); }
  irADiagramas() { this.router.navigate(['/app/proyecto', this.proyectoId, 'diagramas']); }
  irAPrompt() { this.router.navigate(['/app/proyecto', this.proyectoId, 'prompt-final']); }
}
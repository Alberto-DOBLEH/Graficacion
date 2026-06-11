import { Component, inject, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { switchMap } from 'rxjs/operators';
import { ProjectService, EntradaTecnica, Proyecto } from '../../../core/services/project.service';

interface TecnicaInfo {
  nombre: string;
  icono: string;
  color: string;
  descripcion: string;
}

const TECNICAS_INFO: Record<string, TecnicaInfo> = {
  entrevistas: { nombre: 'Entrevistas', icono: 'mic', color: '#6366f1', descripcion: 'Conversaciones con stakeholders' },
  cuestionarios: { nombre: 'Cuestionarios', icono: 'assignment', color: '#f59e0b', descripcion: 'Preguntas estructuradas' },
  observacion: { nombre: 'Observación', icono: 'visibility', color: '#10b981', descripcion: 'Análisis del entorno de trabajo' },
  'taller-jad': { nombre: 'Taller JAD/RAD', icono: 'groups', color: '#ec4899', descripcion: 'Sesiones grupales facilitadas' },
  prototipado: { nombre: 'Prototipado', icono: 'desktop_mac', color: '#3b82f6', descripcion: 'Modelos visuales/funcionales' },
  'casos-de-uso': { nombre: 'Casos de Uso', icono: 'design_services', color: '#00e676', descripcion: 'Escenarios de interacción' },
  'anexos': { nombre: 'Anexos', icono: 'attach_file', color: '#0ea5e9', descripcion: 'Documentos complementarios y evidencias' },
};

@Component({
  selector: 'app-tecnicas-lista',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatIconModule],
  templateUrl: './tecnicas-lista.html',
  styleUrl: './tecnicas-lista.css',
})
export class TecnicasLista implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private projectService = inject(ProjectService);
  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);

  proyectoId = '';
  tipo = '';
  proyecto: Proyecto | undefined;
  tecnicaInfo: TecnicaInfo = TECNICAS_INFO['entrevistas'];
  entradas: EntradaTecnica[] = [];
  entradasFiltradas: EntradaTecnica[] = [];
  busqueda = '';
  cargando = true;

  ngOnInit() {
    this.proyectoId = this.route.snapshot.paramMap.get('id') ?? '';
    this.tipo = this.route.snapshot.paramMap.get('tipo') ?? '';
    this.tecnicaInfo = TECNICAS_INFO[this.tipo] ?? TECNICAS_INFO['entrevistas'];

    // Primero cargar el proyecto, luego las entradas de forma secuencial
    this.projectService.obtenerProyecto(this.proyectoId).pipe(
      switchMap(proyecto => {
        this.proyecto = proyecto;
        return this.projectService.getEntradas(this.proyectoId, this.tipo);
      })
    ).subscribe({
      next: (entradas) => {
        this.ngZone.run(() => {
          this.entradas = Array.isArray(entradas) ? entradas : [];
          this.cargando = false;
          this.filtrar();
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          console.error('❌ Error cargando datos:', err);
          this.cargando = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  cargarEntradas() {
    this.projectService.getEntradas(this.proyectoId, this.tipo).subscribe({
      next: (entradas) => {
        this.entradas = entradas;
        this.filtrar();
        this.cdr.markForCheck();
      }
    });
  }

  filtrar() {
    const q = this.busqueda.toLowerCase().trim();
    this.entradasFiltradas = q
      ? this.entradas.filter((e) => e.titulo.toLowerCase().includes(q))
      : [...this.entradas];
  }

  eliminar(id: string | number) {
    if (confirm('¿Eliminar esta entrada?')) {
      this.projectService.eliminarEntrada(id).subscribe({
        next: () => {
          this.cargarEntradas();
          this.cdr.markForCheck();
        }
      });
    }
  }

  irANueva() {
    this.router.navigate(['/app/proyecto', this.proyectoId, 'tecnicas', this.tipo, 'nueva']);
  }

  formatFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-MX', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  }

  getResumen(entrada: EntradaTecnica): string {
    const keys = Object.keys(entrada.datos).slice(0, 2);
    return keys
      .map((k) => String(entrada.datos[k] || '').substring(0, 60))
      .filter(Boolean)
      .join(' • ');
  }
}

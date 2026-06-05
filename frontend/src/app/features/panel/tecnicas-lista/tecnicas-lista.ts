import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
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

  proyectoId = '';
  tipo = '';
  proyecto: Proyecto | undefined;
  tecnicaInfo: TecnicaInfo = TECNICAS_INFO['entrevistas'];
  entradas: EntradaTecnica[] = [];
  entradasFiltradas: EntradaTecnica[] = [];
  busqueda = '';

  ngOnInit() {
    this.proyectoId = this.route.snapshot.paramMap.get('id') ?? '';
    this.tipo = this.route.snapshot.paramMap.get('tipo') ?? '';
    this.tecnicaInfo = TECNICAS_INFO[this.tipo] ?? TECNICAS_INFO['entrevistas'];
    this.proyecto = this.projectService.getProyecto(this.proyectoId);
    this.cargarEntradas();
  }

  cargarEntradas() {
    this.entradas = this.projectService.getEntradas(this.proyectoId, this.tipo);
    this.filtrar();
  }

  filtrar() {
    const q = this.busqueda.toLowerCase().trim();
    this.entradasFiltradas = q
      ? this.entradas.filter((e) => e.titulo.toLowerCase().includes(q))
      : [...this.entradas];
  }

  eliminar(id: string) {
    if (confirm('¿Eliminar esta entrada?')) {
      this.projectService.eliminarEntrada(id);
      this.cargarEntradas();
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

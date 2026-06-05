import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ProjectService, Proyecto, Requerimiento } from '../../../core/services/project.service';

@Component({
  selector: 'app-requerimientos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatIconModule],
  templateUrl: './requerimientos.html',
  styleUrl: './requerimientos.css',
})
export class Requerimientos implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ps = inject(ProjectService);

  proyectoId = '';
  proyecto: Proyecto | undefined;
  requerimientos: Requerimiento[] = [];
  tabActual: 'funcional' | 'no-funcional' | 'regla-negocio' = 'funcional';
  mostrarFormulario = false;
  editando: Requerimiento | null = null;

  // Form fields
  codigo = '';
  titulo = '';
  descripcion = '';
  prioridad: 'alta' | 'media' | 'baja' = 'media';
  estado: 'propuesto' | 'aprobado' | 'implementado' | 'descartado' = 'propuesto';
  actorPrincipal = '';
  moduloRelacionado = '';
  criteriosAceptacion = '';
  dependencias = '';
  errorMsg = '';
  guardando = false;

  tabs = [
    { key: 'funcional' as const, label: 'Req. Funcionales', icono: 'check_circle', color: '#6366f1' },
    { key: 'no-funcional' as const, label: 'Req. No Funcionales', icono: 'tune', color: '#f59e0b' },
    { key: 'regla-negocio' as const, label: 'Reglas de Negocio', icono: 'gavel', color: '#10b981' },
  ];

  ngOnInit() {
    this.proyectoId = this.route.snapshot.paramMap.get('id') ?? '';
    this.proyecto = this.ps.getProyecto(this.proyectoId);
    if (!this.proyecto) {
      this.router.navigate(['/app/proyectos']);
      return;
    }
    this.cargar();
  }

  cargar() {
    this.requerimientos = this.ps.getRequerimientosPorTipo(this.proyectoId, this.tabActual);
  }

  cambiarTab(tab: 'funcional' | 'no-funcional' | 'regla-negocio') {
    this.tabActual = tab;
    this.cerrarFormulario();
    this.cargar();
  }

  getTabInfo() {
    return this.tabs.find((t) => t.key === this.tabActual)!;
  }

  abrirNuevo() {
    this.editando = null;
    this.codigo = this.ps.generarCodigoRequerimiento(this.proyectoId, this.tabActual);
    this.titulo = '';
    this.descripcion = '';
    this.prioridad = 'media';
    this.estado = 'propuesto';
    this.actorPrincipal = '';
    this.moduloRelacionado = '';
    this.criteriosAceptacion = '';
    this.dependencias = '';
    this.errorMsg = '';
    this.mostrarFormulario = true;
  }

  abrirEdicion(req: Requerimiento) {
    this.editando = req;
    this.codigo = req.codigo;
    this.titulo = req.titulo;
    this.descripcion = req.descripcion;
    this.prioridad = req.prioridad;
    this.estado = req.estado;
    this.actorPrincipal = req.actorPrincipal;
    this.moduloRelacionado = req.moduloRelacionado;
    this.criteriosAceptacion = req.criteriosAceptacion;
    this.dependencias = req.dependencias;
    this.errorMsg = '';
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.editando = null;
    this.errorMsg = '';
  }

  guardar() {
    if (!this.titulo.trim()) {
      this.errorMsg = 'El título es obligatorio.';
      return;
    }
    if (!this.descripcion.trim()) {
      this.errorMsg = 'La descripción es obligatoria.';
      return;
    }
    this.guardando = true;
    this.errorMsg = '';

    if (this.editando) {
      this.ps.actualizarRequerimiento({
        ...this.editando,
        codigo: this.codigo,
        titulo: this.titulo.trim(),
        descripcion: this.descripcion.trim(),
        prioridad: this.prioridad,
        estado: this.estado,
        actorPrincipal: this.actorPrincipal.trim(),
        moduloRelacionado: this.moduloRelacionado.trim(),
        criteriosAceptacion: this.criteriosAceptacion.trim(),
        dependencias: this.dependencias.trim(),
      });
    } else {
      this.ps.crearRequerimiento({
        proyectoId: this.proyectoId,
        codigo: this.codigo,
        tipo: this.tabActual,
        titulo: this.titulo.trim(),
        descripcion: this.descripcion.trim(),
        prioridad: this.prioridad,
        estado: this.estado,
        actorPrincipal: this.actorPrincipal.trim(),
        moduloRelacionado: this.moduloRelacionado.trim(),
        criteriosAceptacion: this.criteriosAceptacion.trim(),
        dependencias: this.dependencias.trim(),
      });
    }

    setTimeout(() => {
      this.guardando = false;
      this.cerrarFormulario();
      this.cargar();
    }, 300);
  }

  eliminar(id: string) {
    if (confirm('¿Eliminar este requerimiento?')) {
      this.ps.eliminarRequerimiento(id);
      this.cargar();
    }
  }

  prioridadClase(p: string): string {
    return 'prioridad-' + p;
  }

  estadoClase(e: string): string {
    return 'estado-' + e;
  }

  contarPorTipo(tipo: string): number {
    return this.ps.getRequerimientosPorTipo(this.proyectoId, tipo).length;
  }
}

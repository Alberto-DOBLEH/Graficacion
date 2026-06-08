import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'app-crear-proyecto',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatIconModule],
  templateUrl: './crear-proyecto.html',
  styleUrl: './crear-proyecto.css',
})
export class CrearProyecto {
  private projectService = inject(ProjectService);
  private router = inject(Router);

  nombre = '';
  descripcion = '';
  metodologia = 'Ágil (Scrum)';
  fechaInicio = new Date().toISOString().split('T')[0];
  estado: 'activo' | 'pausado' | 'completado' = 'activo';
  guardando = false;
  errorMsg = '';

  metodologias = [
    'Ágil (Scrum)',
    'Ágil (Kanban)',
    'Cascada',
    'Híbrida',
    'RUP',
    'XP (Extreme Programming)',
    'DSDM',
    'Otra',
  ];

  onGuardar() {
    if (!this.nombre.trim()) {
      this.errorMsg = 'El nombre del proyecto es obligatorio.';
      return;
    }
    this.guardando = true;
    this.errorMsg = '';

    this.projectService.crearProyecto({
      nombre: this.nombre.trim(),
      descripcion: this.descripcion.trim(),
      estado: this.estado,
    }).subscribe({
      next: (res) => {
        this.guardando = false;
        this.router.navigate(['/app/proyecto', res.id_proyecto]);
      },
      error: (err) => {
        this.guardando = false;
        this.errorMsg = err.error?.error || 'Error al guardar el proyecto.';
      }
    });
  }
}

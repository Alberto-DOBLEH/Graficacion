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

    const nuevo = this.projectService.crearProyecto({
      nombre: this.nombre.trim(),
      descripcion: this.descripcion.trim(),
      metodologia: this.metodologia,
      fechaInicio: this.fechaInicio,
      estado: this.estado,
    });

    setTimeout(() => {
      this.guardando = false;
      this.router.navigate(['/app/proyecto', nuevo.id]);
    }, 500);
  }
}

import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ProjectService, Proyecto, Requerimiento, EntradaTecnica } from '../../../core/services/project.service';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-generador-prompt',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatIconModule],
  templateUrl: './generador-prompt.html',
  styleUrl: './generador-prompt.css',
})
export class GeneradorPrompt implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ps = inject(ProjectService);
  private cdr = inject(ChangeDetectorRef);

  proyectoId = '';
  proyecto: Proyecto | undefined;
  requerimientos: Requerimiento[] = [];
  entradas: EntradaTecnica[] = [];
  promptGenerado = '';
  copiado = false;

  // Edición
  editandoPrompt = false;
  promptOriginal = '';
  promptId: number | null = null;
  guardandoPrompt = false;

  stats = {
    reqFuncionales: 0,
    reqNoFuncionales: 0,
    reglasNegocio: 0,
    entrevistas: 0,
    cuestionarios: 0,
    casosUso: 0,
    observaciones: 0,
    talleres: 0,
    prototipos: 0,
    totalEntradas: 0,
  };

  cargando = true;
  generandoIA = false;
  errorMsg = '';

  ngOnInit() {
    this.proyectoId = this.route.snapshot.paramMap.get('id') ?? '';
    this.cdr.markForCheck();
    
    forkJoin({
      proyecto: this.ps.obtenerProyecto(this.proyectoId),
      requerimientos: this.ps.getRequerimientos(this.proyectoId),
      entradas: this.ps.getTodasLasEntradas(this.proyectoId),
      prompts: this.ps.obtenerPrompts(this.proyectoId)
    }).subscribe({
      next: (res) => {
        this.proyecto = res.proyecto;
        this.requerimientos = res.requerimientos;
        this.entradas = res.entradas;
        
        if (res.prompts && res.prompts.length > 0) {
          this.promptGenerado = res.prompts[0].contenido_prompt;
          this.promptId = res.prompts[0].id_prompt ?? null;
        } else {
          this.promptGenerado = 'Aún no se ha generado un Prompt Maestro para este proyecto. Haz clic en "Generar con Claude AI".';
        }
        
        this.cargando = false;
        this.calcularStats();
        this.cdr.markForCheck();
      },
      error: () => {
        this.cargando = false;
        this.errorMsg = 'Error al cargar los datos para el prompt.';
        this.cdr.markForCheck();
      }
    });
  }

  calcularStats() {
    this.stats.reqFuncionales = this.requerimientos.filter((r) => r.tipo === 'funcional').length;
    this.stats.reqNoFuncionales = this.requerimientos.filter((r) => r.tipo === 'no-funcional').length;
    this.stats.reglasNegocio = this.requerimientos.filter((r) => r.tipo === 'regla-negocio').length;
    this.stats.entrevistas = this.entradas.filter((e) => e.tipo === 'entrevistas').length;
    this.stats.cuestionarios = this.entradas.filter((e) => e.tipo === 'cuestionarios').length;
    this.stats.casosUso = this.entradas.filter((e) => e.tipo === 'casos-de-uso').length;
    this.stats.observaciones = this.entradas.filter((e) => e.tipo === 'observacion').length;
    this.stats.talleres = this.entradas.filter((e) => e.tipo === 'taller-jad').length;
    this.stats.prototipos = this.entradas.filter((e) => e.tipo === 'prototipado').length;
    this.stats.totalEntradas = this.entradas.length;
  }

  generarConIA() {
    this.generandoIA = true;
    this.errorMsg = '';
    this.cdr.markForCheck();
    
    this.ps.generarPromptIA(this.proyectoId).subscribe({
      next: (res) => {
        this.promptGenerado = res.contenido_prompt;
        this.generandoIA = false;
        this.cdr.markForCheck();
        alert('¡Prompt Maestro generado con éxito por Claude!');
      },
      error: (err) => {
        this.errorMsg = 'Error al generar con IA: ' + (err.error?.error || err.message);
        this.generandoIA = false;
        this.cdr.markForCheck();
      }
    });
  }

  // --- Edición ---
  iniciarEdicion() {
    this.editandoPrompt = true;
    this.promptOriginal = this.promptGenerado;
  }

  cancelarEdicion() {
    this.promptGenerado = this.promptOriginal;
    this.editandoPrompt = false;
  }

  guardarCambios() {
    if (!this.promptId) {
      this.errorMsg = 'No hay un prompt guardado aún. Genera uno primero.';
      return;
    }
    this.guardandoPrompt = true;
    this.errorMsg = '';
    this.cdr.markForCheck();
    this.ps.actualizarPrompt(this.promptId, this.promptGenerado).subscribe({
      next: () => {
        this.guardandoPrompt = false;
        this.editandoPrompt = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.guardandoPrompt = false;
        this.errorMsg = 'Error al guardar: ' + (err.error?.error || err.message);
        this.cdr.markForCheck();
      }
    });
  }

  // --- Acciones ---
  copiar() {
    navigator.clipboard.writeText(this.promptGenerado).then(() => {
      this.copiado = true;
      setTimeout(() => (this.copiado = false), 2500);
    });
  }

  descargar() {
    const blob = new Blob([this.promptGenerado], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt_${this.proyecto?.nombre?.replace(/\s/g, '_') || 'proyecto'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  exportarPDF() {
    const doc = new jsPDF();
    const titulo = `Prompt Maestro - ${this.proyecto?.nombre || 'Proyecto'}`;
    const margenX = 15;
    const margenY = 20;
    const anchoMaximo = 180;
    const altoLinea = 6;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(titulo, margenX, margenY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const lineas = doc.splitTextToSize(this.promptGenerado, anchoMaximo);

    let y = margenY + 12;
    for (const linea of lineas) {
      if (y > 280) {
        doc.addPage();
        y = margenY;
      }
      doc.text(linea, margenX, y);
      y += altoLinea;
    }

    doc.save(`prompt_${this.proyecto?.nombre?.replace(/\s/g, '_') || 'proyecto'}.pdf`);
  }
}

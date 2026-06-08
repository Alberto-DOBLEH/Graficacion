import { Component, inject, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ProjectService, Proyecto, Requerimiento, EntradaTecnica } from '../../../core/services/project.service';

@Component({
  selector: 'app-generador-prompt',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './generador-prompt.html',
  styleUrl: './generador-prompt.css',
})
export class GeneradorPrompt implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ps = inject(ProjectService);

  proyectoId = '';
  proyecto: Proyecto | undefined;
  requerimientos: Requerimiento[] = [];
  entradas: EntradaTecnica[] = [];
  promptGenerado = '';
  copiado = false;

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
        } else {
          this.promptGenerado = 'Aún no se ha generado un Prompt Maestro para este proyecto. Haz clic en "Generar con Claude AI".';
        }
        
        this.cargando = false;
        this.calcularStats();
      },
      error: () => {
        this.cargando = false;
        this.errorMsg = 'Error al cargar los datos para el prompt.';
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
    
    this.ps.generarPromptIA(this.proyectoId).subscribe({
      next: (res) => {
        this.promptGenerado = res.contenido_prompt;
        this.generandoIA = false;
        alert('¡Prompt Maestro generado con éxito por Claude!');
      },
      error: (err) => {
        this.errorMsg = 'Error al generar con IA: ' + (err.error?.error || err.message);
        this.generandoIA = false;
      }
    });
  }

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
}

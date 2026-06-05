import { Component, inject, OnInit } from '@angular/core';
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

  ngOnInit() {
    this.proyectoId = this.route.snapshot.paramMap.get('id') ?? '';
    this.proyecto = this.ps.getProyecto(this.proyectoId);
    if (!this.proyecto) {
      this.router.navigate(['/app/proyectos']);
      return;
    }
    this.requerimientos = this.ps.getRequerimientos(this.proyectoId);
    this.entradas = this.ps.getTodasLasEntradas(this.proyectoId);
    this.calcularStats();
    this.generar();
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

  generar() {
    const p = this.proyecto!;
    const funcionales = this.requerimientos.filter((r) => r.tipo === 'funcional');
    const noFuncionales = this.requerimientos.filter((r) => r.tipo === 'no-funcional');
    const reglas = this.requerimientos.filter((r) => r.tipo === 'regla-negocio');
    const casosUso = this.entradas.filter((e) => e.tipo === 'casos-de-uso');
    const entrevistas = this.entradas.filter((e) => e.tipo === 'entrevistas');

    const actores = new Set<string>();
    funcionales.forEach((r) => { if (r.actorPrincipal?.trim()) actores.add(r.actorPrincipal.trim()); });
    casosUso.forEach((cu) => { if (cu.datos['actor']?.trim()) actores.add(cu.datos['actor'].trim()); });

    const modulos = new Set<string>();
    funcionales.forEach((r) => { if (r.moduloRelacionado?.trim()) modulos.add(r.moduloRelacionado.trim()); });

    let prompt = '';

    prompt += `═══════════════════════════════════════════════════\n`;
    prompt += `  ESPECIFICACIÓN COMPLETA DEL PROYECTO\n`;
    prompt += `  "${p.nombre}"\n`;
    prompt += `  Generado automáticamente — ${new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}\n`;
    prompt += `═══════════════════════════════════════════════════\n\n`;

    prompt += `━━━ 1. CONTEXTO DEL PROYECTO ━━━━━━━━━━━━━━━━━━━━\n\n`;
    prompt += `Nombre: ${p.nombre}\n`;
    prompt += `Descripción: ${p.descripcion || 'No especificada'}\n`;
    prompt += `Metodología: ${p.metodologia}\n`;
    prompt += `Fecha de inicio: ${p.fechaInicio}\n`;
    prompt += `Estado actual: ${p.estado}\n\n`;

    prompt += `━━━ 2. ACTORES / STAKEHOLDERS IDENTIFICADOS ━━━━━\n\n`;
    if (actores.size > 0) {
      Array.from(actores).forEach((a, i) => {
        prompt += `  ${i + 1}. ${a}\n`;
      });
    } else {
      prompt += `  (No se han identificado actores aún)\n`;
    }
    prompt += `\n`;

    prompt += `━━━ 3. MÓDULOS / ÁREAS DEL SISTEMA ━━━━━━━━━━━━━━\n\n`;
    if (modulos.size > 0) {
      Array.from(modulos).forEach((m, i) => {
        const reqs = funcionales.filter((r) => r.moduloRelacionado?.trim() === m);
        prompt += `  ${i + 1}. ${m} (${reqs.length} requerimientos)\n`;
      });
    } else {
      prompt += `  (No se han definido módulos aún)\n`;
    }
    prompt += `\n`;

    prompt += `━━━ 4. REQUERIMIENTOS FUNCIONALES (${funcionales.length}) ━━━━━━━━\n\n`;
    if (funcionales.length > 0) {
      funcionales.forEach((r) => {
        prompt += `  [${r.codigo}] ${r.titulo}\n`;
        prompt += `    Prioridad: ${r.prioridad.toUpperCase()} | Estado: ${r.estado}\n`;
        prompt += `    Descripción: ${r.descripcion}\n`;
        if (r.actorPrincipal) prompt += `    Actor: ${r.actorPrincipal}\n`;
        if (r.moduloRelacionado) prompt += `    Módulo: ${r.moduloRelacionado}\n`;
        if (r.criteriosAceptacion) prompt += `    Criterios de aceptación: ${r.criteriosAceptacion}\n`;
        if (r.dependencias) prompt += `    Dependencias: ${r.dependencias}\n`;
        prompt += `\n`;
      });
    } else {
      prompt += `  (Sin requerimientos funcionales registrados)\n\n`;
    }

    prompt += `━━━ 5. REQUERIMIENTOS NO FUNCIONALES (${noFuncionales.length}) ━━━━\n\n`;
    if (noFuncionales.length > 0) {
      noFuncionales.forEach((r) => {
        prompt += `  [${r.codigo}] ${r.titulo}\n`;
        prompt += `    Prioridad: ${r.prioridad.toUpperCase()}\n`;
        prompt += `    Descripción: ${r.descripcion}\n`;
        if (r.criteriosAceptacion) prompt += `    Criterios: ${r.criteriosAceptacion}\n`;
        prompt += `\n`;
      });
    } else {
      prompt += `  (Sin requerimientos no funcionales registrados)\n\n`;
    }

    prompt += `━━━ 6. REGLAS DE NEGOCIO (${reglas.length}) ━━━━━━━━━━━━━━━━\n\n`;
    if (reglas.length > 0) {
      reglas.forEach((r) => {
        prompt += `  [${r.codigo}] ${r.titulo}\n`;
        prompt += `    ${r.descripcion}\n\n`;
      });
    } else {
      prompt += `  (Sin reglas de negocio registradas)\n\n`;
    }

    prompt += `━━━ 7. CASOS DE USO (${casosUso.length}) ━━━━━━━━━━━━━━━━━━━\n\n`;
    if (casosUso.length > 0) {
      casosUso.forEach((cu) => {
        prompt += `  ● ${cu.datos['nombre'] || cu.titulo}\n`;
        if (cu.datos['codigo']) prompt += `    ID: ${cu.datos['codigo']}\n`;
        if (cu.datos['actor']) prompt += `    Actor principal: ${cu.datos['actor']}\n`;
        if (cu.datos['precondiciones']) prompt += `    Precondiciones: ${cu.datos['precondiciones']}\n`;
        if (cu.datos['flujoNormal']) prompt += `    Flujo principal: ${cu.datos['flujoNormal']}\n`;
        if (cu.datos['flujoAlternativo']) prompt += `    Flujos alternativos: ${cu.datos['flujoAlternativo']}\n`;
        if (cu.datos['postcondiciones']) prompt += `    Postcondiciones: ${cu.datos['postcondiciones']}\n`;
        prompt += `\n`;
      });
    } else {
      prompt += `  (Sin casos de uso registrados)\n\n`;
    }

    prompt += `━━━ 8. HALLAZGOS DE TÉCNICAS DE RECOPILACIÓN ━━━━\n\n`;
    if (entrevistas.length > 0) {
      prompt += `  ── Entrevistas (${entrevistas.length}) ──\n`;
      entrevistas.forEach((e) => {
        prompt += `    • ${e.titulo}\n`;
        if (e.datos['respuestas']) prompt += `      Hallazgos: ${e.datos['respuestas']}\n`;
        if (e.datos['observaciones']) prompt += `      Notas: ${e.datos['observaciones']}\n`;
      });
      prompt += `\n`;
    }

    const observaciones = this.entradas.filter((e) => e.tipo === 'observacion');
    if (observaciones.length > 0) {
      prompt += `  ── Observaciones (${observaciones.length}) ──\n`;
      observaciones.forEach((o) => {
        prompt += `    • ${o.titulo}\n`;
        if (o.datos['problemas']) prompt += `      Problemas: ${o.datos['problemas']}\n`;
        if (o.datos['hallazgos']) prompt += `      Hallazgos: ${o.datos['hallazgos']}\n`;
      });
      prompt += `\n`;
    }

    const talleres = this.entradas.filter((e) => e.tipo === 'taller-jad');
    if (talleres.length > 0) {
      prompt += `  ── Talleres JAD/RAD (${talleres.length}) ──\n`;
      talleres.forEach((t) => {
        prompt += `    • ${t.titulo}\n`;
        if (t.datos['acuerdos']) prompt += `      Acuerdos: ${t.datos['acuerdos']}\n`;
        if (t.datos['requisitos']) prompt += `      Requisitos: ${t.datos['requisitos']}\n`;
      });
      prompt += `\n`;
    }

    if (entrevistas.length === 0 && observaciones.length === 0 && talleres.length === 0) {
      prompt += `  (Sin hallazgos de técnicas registrados)\n\n`;
    }

    prompt += `━━━ 9. RESUMEN ESTADÍSTICO ━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    prompt += `  Req. Funcionales:      ${this.stats.reqFuncionales}\n`;
    prompt += `  Req. No Funcionales:   ${this.stats.reqNoFuncionales}\n`;
    prompt += `  Reglas de Negocio:     ${this.stats.reglasNegocio}\n`;
    prompt += `  Casos de Uso:          ${this.stats.casosUso}\n`;
    prompt += `  Entrevistas:           ${this.stats.entrevistas}\n`;
    prompt += `  Cuestionarios:         ${this.stats.cuestionarios}\n`;
    prompt += `  Observaciones:         ${this.stats.observaciones}\n`;
    prompt += `  Talleres:              ${this.stats.talleres}\n`;
    prompt += `  Prototipos:            ${this.stats.prototipos}\n`;
    prompt += `  Total entradas técn.:  ${this.stats.totalEntradas}\n\n`;

    prompt += `━━━ 10. SUPER MEGA PROMPT PARA DESARROLLO ━━━━━━━\n\n`;
    prompt += `Desarrolla un sistema llamado "${p.nombre}".\n`;
    prompt += `${p.descripcion}\n\n`;
    prompt += `Metodología de desarrollo: ${p.metodologia}\n\n`;

    if (modulos.size > 0) {
      prompt += `El sistema debe contener los siguientes módulos:\n`;
      Array.from(modulos).forEach((m) => {
        prompt += `  - ${m}\n`;
      });
      prompt += `\n`;
    }

    if (actores.size > 0) {
      prompt += `Los actores/usuarios del sistema son:\n`;
      Array.from(actores).forEach((a) => {
        prompt += `  - ${a}\n`;
      });
      prompt += `\n`;
    }

    if (funcionales.length > 0) {
      prompt += `El sistema debe cumplir con las siguientes funcionalidades:\n`;
      funcionales.forEach((r) => {
        prompt += `  - ${r.codigo}: ${r.titulo} — ${r.descripcion}\n`;
        if (r.criteriosAceptacion) prompt += `    (Criterio: ${r.criteriosAceptacion})\n`;
      });
      prompt += `\n`;
    }

    if (noFuncionales.length > 0) {
      prompt += `Requerimientos no funcionales a considerar:\n`;
      noFuncionales.forEach((r) => {
        prompt += `  - ${r.titulo}: ${r.descripcion}\n`;
      });
      prompt += `\n`;
    }

    if (reglas.length > 0) {
      prompt += `Reglas de negocio que el sistema debe respetar:\n`;
      reglas.forEach((r) => {
        prompt += `  - ${r.titulo}: ${r.descripcion}\n`;
      });
      prompt += `\n`;
    }

    if (casosUso.length > 0) {
      prompt += `Casos de uso principales:\n`;
      casosUso.forEach((cu) => {
        prompt += `  - ${cu.datos['nombre'] || cu.titulo}`;
        if (cu.datos['actor']) prompt += ` (Actor: ${cu.datos['actor']})`;
        prompt += `\n`;
        if (cu.datos['flujoNormal']) prompt += `    Flujo: ${cu.datos['flujoNormal']}\n`;
      });
      prompt += `\n`;
    }

    prompt += `Genera la arquitectura completa, el código fuente, las bases de datos necesarias y la documentación técnica para este sistema.\n`;
    prompt += `\n═══════════════════════════════════════════════════\n`;
    prompt += `  FIN DE LA ESPECIFICACIÓN\n`;
    prompt += `═══════════════════════════════════════════════════\n`;

    this.promptGenerado = prompt;
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

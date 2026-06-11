import { Component, inject, OnInit, AfterViewChecked, ElementRef, ChangeDetectorRef } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ProjectService, Proyecto, Requerimiento, EntradaTecnica, Diagrama } from '../../../core/services/project.service';

declare var mermaid: any;

interface DiagramaInfo {
  key: string;
  nombre: string;
  icono: string;
  color: string;
  descripcion: string;
}

@Component({
  selector: 'app-diagramas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatIconModule],
  templateUrl: './diagramas.html',
  styleUrl: './diagramas.css',
})
export class Diagramas implements OnInit, AfterViewChecked {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ps = inject(ProjectService);
  private el = inject(ElementRef);
  private cdr = inject(ChangeDetectorRef);

  proyectoId = '';
  proyecto: Proyecto | undefined;
  requerimientos: Requerimiento[] = [];
  entradas: EntradaTecnica[] = [];
  diagramaActual = 'casos-uso';
  codigoMermaid = '';
  mermaidCargado = false;
  renderPending = false;

  diagramas: DiagramaInfo[] = [
    { key: 'casos-uso', nombre: 'Casos de Uso', icono: 'account_tree', color: '#6366f1', descripcion: 'Interacciones actor-sistema' },
    { key: 'clases', nombre: 'Clases', icono: 'class', color: '#3b82f6', descripcion: 'Estructura de clases' },
    { key: 'secuencia', nombre: 'Secuencia', icono: 'swap_vert', color: '#10b981', descripcion: 'Flujo temporal de mensajes' },
    { key: 'actividades', nombre: 'Actividades', icono: 'timeline', color: '#f59e0b', descripcion: 'Flujo de actividades' },
    { key: 'er', nombre: 'Entidad-Relación', icono: 'storage', color: '#ec4899', descripcion: 'Modelo de datos' },
  ];

  cargando = true;
  errorMsg = '';

  // Custom diagram properties
  diagramasGuardados: Diagrama[] = [];
  diagramaGuardadoId: number | null = null;
  esPersonalizado = false;
  guardando = false;
  modoEdicion = false;

  ngOnInit() {
    this.proyectoId = this.route.snapshot.paramMap.get('id') ?? '';
    this.cdr.markForCheck();
    
    forkJoin({
      proyecto: this.ps.obtenerProyecto(this.proyectoId),
      requerimientos: this.ps.getRequerimientos(this.proyectoId),
      entradas: this.ps.getTodasLasEntradas(this.proyectoId),
      diagramasGuardados: this.ps.obtenerDiagramas(this.proyectoId)
    }).subscribe({
      next: (res) => {
        this.proyecto = res.proyecto;
        this.requerimientos = res.requerimientos;
        this.entradas = res.entradas;
        this.diagramasGuardados = res.diagramasGuardados || [];
        this.cargando = false;
        this.cargarMermaid();
        this.generarDiagrama();
        this.cdr.markForCheck();
      },
      error: () => {
        this.cargando = false;
        this.errorMsg = 'Error al cargar los datos del proyecto.';
        this.cdr.markForCheck();
      }
    });
  }

  ngAfterViewChecked() {
    if (this.renderPending && this.mermaidCargado) {
      this.renderPending = false;
      this.renderMermaid();
    }
  }

  cargarMermaid() {
    if (typeof mermaid !== 'undefined') {
      this.mermaidCargado = true;
      mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'loose' });
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js';
    script.onload = () => {
      this.mermaidCargado = true;
      mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'loose' });
      this.renderPending = true;
    };
    document.head.appendChild(script);
  }

  async renderMermaid() {
    const container = this.el.nativeElement.querySelector('#mermaid-render');
    if (!container || !this.codigoMermaid) return;
    try {
      const { svg } = await mermaid.render('mermaid-svg-' + Date.now(), this.codigoMermaid);
      container.innerHTML = svg;
    } catch (e) {
      container.innerHTML = '<p style="color:#ef4444;text-align:center;padding:1.5rem;font-weight:600;">Error de sintaxis en el código del diagrama. Revisa la estructura de Mermaid.</p>';
    }
  }

  seleccionarDiagrama(key: string) {
    this.modoEdicion = false;
    this.diagramaActual = key;
    this.generarDiagrama();
  }

  getDiagramaInfo(): DiagramaInfo {
    return this.diagramas.find((d) => d.key === this.diagramaActual)!;
  }

  generarDiagrama() {
    // Buscar si hay un código personalizado guardado para este tipo de diagrama
    const guardado = this.diagramasGuardados.find(d => d.tipo_diagrama === this.diagramaActual);
    if (guardado) {
      this.codigoMermaid = guardado.codigo_generado;
      this.diagramaGuardadoId = guardado.id_diagrama ?? null;
      this.esPersonalizado = true;
    } else {
      this.diagramaGuardadoId = null;
      this.esPersonalizado = false;
      switch (this.diagramaActual) {
        case 'casos-uso': this.codigoMermaid = this.generarCasosDeUso(); break;
        case 'clases': this.codigoMermaid = this.generarClases(); break;
        case 'secuencia': this.codigoMermaid = this.generarSecuencia(); break;
        case 'actividades': this.codigoMermaid = this.generarActividades(); break;
        case 'er': this.codigoMermaid = this.generarER(); break;
      }
    }
    this.renderPending = true;
  }

  onCodeChange() {
    this.renderPending = true;
    this.cdr.markForCheck();
  }

  guardarDiagrama() {
    if (!this.codigoMermaid.trim()) {
      alert('El código del diagrama no puede estar vacío.');
      return;
    }
    this.guardando = true;
    this.errorMsg = '';
    this.cdr.markForCheck();

    const payload: Partial<Diagrama> = {
      id_proyecto: Number(this.proyectoId),
      tipo_diagrama: this.diagramaActual,
      codigo_generado: this.codigoMermaid.trim()
    };

    if (this.diagramaGuardadoId) {
      this.ps.actualizarDiagrama(this.diagramaGuardadoId, payload).subscribe({
        next: () => {
          this.guardando = false;
          const idx = this.diagramasGuardados.findIndex(d => d.id_diagrama === this.diagramaGuardadoId);
          if (idx !== -1) {
            this.diagramasGuardados[idx].codigo_generado = this.codigoMermaid;
          }
          this.esPersonalizado = true;
          this.modoEdicion = false;
          this.cdr.markForCheck();
          alert('Diagrama personalizado actualizado con éxito.');
        },
        error: () => {
          this.guardando = false;
          this.errorMsg = 'Error al actualizar el diagrama personalizado.';
          this.cdr.markForCheck();
        }
      });
    } else {
      this.ps.guardarDiagrama(payload).subscribe({
        next: (res) => {
          this.guardando = false;
          this.diagramaGuardadoId = res.id_diagrama;
          this.diagramasGuardados.push({
            id_diagrama: res.id_diagrama,
            id_proyecto: Number(this.proyectoId),
            tipo_diagrama: this.diagramaActual,
            codigo_generado: this.codigoMermaid
          });
          this.esPersonalizado = true;
          this.modoEdicion = false;
          this.cdr.markForCheck();
          alert('Diagrama personalizado guardado con éxito.');
        },
        error: () => {
          this.guardando = false;
          this.errorMsg = 'Error al guardar el diagrama personalizado.';
          this.cdr.markForCheck();
        }
      });
    }
  }

  restaurarOriginal() {
    if (confirm('¿Estás seguro de que deseas eliminar tu versión personalizada y volver al diseño automático?')) {
      if (this.diagramaGuardadoId) {
        this.guardando = true;
        this.cdr.markForCheck();
        this.ps.eliminarDiagrama(this.diagramaGuardadoId).subscribe({
          next: () => {
            this.diagramasGuardados = this.diagramasGuardados.filter(d => d.id_diagrama !== this.diagramaGuardadoId);
            this.diagramaGuardadoId = null;
            this.esPersonalizado = false;
            this.modoEdicion = false;
            this.guardando = false;
            this.generarDiagrama();
            this.cdr.markForCheck();
          },
          error: () => {
            this.guardando = false;
            this.errorMsg = 'Error al eliminar el diagrama personalizado.';
            this.cdr.markForCheck();
          }
        });
      } else {
        this.modoEdicion = false;
        this.generarDiagrama();
        this.cdr.markForCheck();
      }
    }
  }

  private getActoresUnicos(): string[] {
    const actores = new Set<string>();
    this.requerimientos.forEach((r) => {
      if (r.actorPrincipal?.trim()) actores.add(r.actorPrincipal.trim());
    });
    const casosUso = this.entradas.filter((e) => e.tipo === 'casos-de-uso');
    casosUso.forEach((cu) => {
      if (cu.datos['actor']?.trim()) actores.add(cu.datos['actor'].trim());
      if (cu.datos['actoresSecundarios']?.trim()) {
        cu.datos['actoresSecundarios'].split(',').forEach((a: string) => {
          if (a.trim()) actores.add(a.trim());
        });
      }
    });
    if (actores.size === 0) actores.add('Usuario');
    return Array.from(actores);
  }

  private getModulosUnicos(): string[] {
    const modulos = new Set<string>();
    this.requerimientos.forEach((r) => {
      if (r.moduloRelacionado?.trim()) modulos.add(r.moduloRelacionado.trim());
    });
    if (modulos.size === 0) modulos.add('Sistema');
    return Array.from(modulos);
  }

  private sanitize(text: string): string {
    return text.replace(/[()[\]{}<>"'&]/g, '').replace(/\s+/g, ' ').trim().substring(0, 50);
  }

  generarCasosDeUso(): string {
    const actores = this.getActoresUnicos();
    const funcionales = this.requerimientos.filter((r) => r.tipo === 'funcional');
    const casosUso = this.entradas.filter((e) => e.tipo === 'casos-de-uso');

    if (funcionales.length === 0 && casosUso.length === 0) {
      return `graph TD\n  A["Sin datos"] --> B["Agrega requerimientos funcionales o casos de uso"]`;
    }

    let code = `graph LR\n`;
    actores.forEach((a, i) => {
      code += `  actor${i}(("${this.sanitize(a)}"))\n`;
    });
    code += `  subgraph Sistema["${this.sanitize(this.proyecto?.nombre || 'Sistema')}"]\n`;
    funcionales.forEach((r, i) => {
      code += `    uc${i}["${this.sanitize(r.codigo + ' ' + r.titulo)}"]\n`;
    });
    casosUso.forEach((cu, i) => {
      code += `    cu${i}["${this.sanitize(cu.datos['nombre'] || cu.titulo)}"]\n`;
    });
    code += `  end\n`;

    funcionales.forEach((r, i) => {
      const actorIdx = r.actorPrincipal?.trim()
        ? actores.indexOf(r.actorPrincipal.trim())
        : 0;
      code += `  actor${Math.max(0, actorIdx)} --> uc${i}\n`;
    });
    casosUso.forEach((cu, i) => {
      const actorIdx = cu.datos['actor']?.trim()
        ? actores.indexOf(cu.datos['actor'].trim())
        : 0;
      code += `  actor${Math.max(0, actorIdx)} --> cu${i}\n`;
    });

    return code;
  }

  generarClases(): string {
    const modulos = this.getModulosUnicos();
    const funcionales = this.requerimientos.filter((r) => r.tipo === 'funcional');

    if (funcionales.length === 0) {
      return `graph TD\n  A["Sin datos"] --> B["Agrega requerimientos funcionales"]`;
    }

    let code = `classDiagram\n`;
    modulos.forEach((m) => {
      const reqs = funcionales.filter((r) => r.moduloRelacionado?.trim() === m);
      code += `  class ${this.sanitize(m).replace(/\s/g, '')} {\n`;
      code += `    +String nombre\n`;
      code += `    +String descripcion\n`;
      reqs.forEach((r) => {
        code += `    +${this.sanitize(r.titulo).replace(/\s/g, '')}()\n`;
      });
      code += `  }\n`;
    });

    if (modulos.length > 1) {
      for (let i = 0; i < modulos.length - 1; i++) {
        code += `  ${this.sanitize(modulos[i]).replace(/\s/g, '')} --> ${this.sanitize(modulos[i + 1]).replace(/\s/g, '')}\n`;
      }
    }

    return code;
  }

  generarSecuencia(): string {
    const funcionales = this.requerimientos.filter((r) => r.tipo === 'funcional').slice(0, 8);
    const actores = this.getActoresUnicos();

    if (funcionales.length === 0) {
      return `graph TD\n  A["Sin datos"] --> B["Agrega requerimientos funcionales"]`;
    }

    let code = `sequenceDiagram\n`;
    const actorPrincipal = actores[0] || 'Usuario';
    code += `  participant U as ${this.sanitize(actorPrincipal)}\n`;
    code += `  participant S as Sistema\n`;
    code += `  participant DB as Base de Datos\n`;

    funcionales.forEach((r) => {
      const label = this.sanitize(r.titulo);
      code += `  U->>S: ${label}\n`;
      code += `  S->>DB: Procesar ${this.sanitize(r.codigo)}\n`;
      code += `  DB-->>S: Resultado\n`;
      code += `  S-->>U: Respuesta ${this.sanitize(r.codigo)}\n`;
    });

    return code;
  }

  generarActividades(): string {
    const funcionales = this.requerimientos.filter((r) => r.tipo === 'funcional');

    if (funcionales.length === 0) {
      return `graph TD\n  A["Sin datos"] --> B["Agrega requerimientos funcionales"]`;
    }

    let code = `graph TD\n`;
    code += `  START(("Inicio"))\n`;

    funcionales.forEach((r, i) => {
      const label = this.sanitize(r.codigo + ' ' + r.titulo);
      code += `  act${i}["${label}"]\n`;
    });
    code += `  FIN(("Fin"))\n`;

    code += `  START --> act0\n`;
    for (let i = 0; i < funcionales.length - 1; i++) {
      code += `  act${i} --> act${i + 1}\n`;
    }
    code += `  act${funcionales.length - 1} --> FIN\n`;

    return code;
  }

  generarER(): string {
    const modulos = this.getModulosUnicos();
    const funcionales = this.requerimientos.filter((r) => r.tipo === 'funcional');

    if (funcionales.length === 0) {
      return `graph TD\n  A["Sin datos"] --> B["Agrega requerimientos funcionales"]`;
    }

    let code = `erDiagram\n`;
    modulos.forEach((m) => {
      const mClean = this.sanitize(m).replace(/\s/g, '_');
      code += `  ${mClean} {\n`;
      code += `    int id PK\n`;
      code += `    string nombre\n`;
      code += `    string descripcion\n`;
      code += `    datetime fecha_creacion\n`;
      code += `  }\n`;
    });

    if (modulos.length > 1) {
      for (let i = 0; i < modulos.length - 1; i++) {
        const m1 = this.sanitize(modulos[i]).replace(/\s/g, '_');
        const m2 = this.sanitize(modulos[i + 1]).replace(/\s/g, '_');
        code += `  ${m1} ||--o{ ${m2} : "contiene"\n`;
      }
    }

    return code;
  }

  copiarCodigo() {
    navigator.clipboard.writeText(this.codigoMermaid).then(() => {
      alert('Código Mermaid copiado al portapapeles');
    });
  }
}

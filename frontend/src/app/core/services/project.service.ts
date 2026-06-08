import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Proyecto {
  id_proyecto?: number;
  nombre: string;
  descripcion?: string;
  estado?: string;
  metodologia?: string;
  fechaInicio?: string;
  fecha_creacion?: string;
}

export interface Requerimiento {
  id?: string | number;
  proyectoId?: string;
  tipo: string;
  codigo: string;
  titulo: string;
  descripcion: string;
  prioridad: 'alta' | 'media' | 'baja';
  estado: 'propuesto' | 'aprobado' | 'implementado' | 'descartado';
  actorPrincipal: string;
  moduloRelacionado: string;
  criteriosAceptacion: string;
  dependencias: string;
}

export interface EntradaTecnica {
  id?: string | number;
  proyectoId?: string;
  tipo: string;
  titulo: string;
  datos: Record<string, any>;
  fecha?: string;
}

export interface AnalisisRequerimiento {
  id_analisis?: number;
  id_proyecto: number;
  tipo_metodo: string;
  contenido: any;
  creado_en?: string;
}

export interface Diagrama {
  id_diagrama?: number;
  id_proyecto: number;
  tipo_diagrama: string;
  codigo_generado: string;
  creado_en?: string;
}

export interface Prompt {
  id_prompt?: number;
  id_proyecto: number;
  contenido_prompt: string;
  creado_en?: string;
}

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3300/api';

  /** Obtiene las cabeceras de autorización con el token de sesión */
  private getAuthHeaders(): { headers: { Authorization: string } } {
    const raw = localStorage.getItem('project_manager_session');

    if (!raw) {
      console.warn('⚠️ No hay sesión en localStorage');
      return { headers: { Authorization: '' } };
    }

    const sesion = JSON.parse(raw);

    if (!sesion?.token) {
      console.warn('⚠️ Sesión existe pero sin token:', sesion);
      return { headers: { Authorization: '' } };
    }

    return {
      headers: {
        Authorization: `Bearer ${sesion.token}`
      }
    };
  }

  // --- PROYECTOS ---
  listarProyectos(): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(
      `${this.apiUrl}/proyectos`,
      this.getAuthHeaders()
    );
  }

  obtenerProyecto(id: number | string): Observable<Proyecto> {
    return this.http.get<Proyecto>(
      `${this.apiUrl}/proyectos/${id}`,
      this.getAuthHeaders()
    );
  }

  crearProyecto(proyecto: Partial<Proyecto>): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/proyectos`,
      proyecto,
      this.getAuthHeaders()
    );
  }

  actualizarProyecto(id: number | string, proyecto: Partial<Proyecto>): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/proyectos/${id}`,
      proyecto,
      this.getAuthHeaders()
    );
  }

  eliminarProyecto(id: number | string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/proyectos/${id}`,
      this.getAuthHeaders()
    );
  }

  // --- ENTRADAS TECNICAS ---
  getTodasLasEntradas(id_proyecto: string | number): Observable<EntradaTecnica[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/analisis/proyecto/${id_proyecto}`,
      this.getAuthHeaders()
    ).pipe(
      map(res => res.map(r => ({ ...r.contenido, id: r.id_analisis, tipo: r.contenido?.tipo || r.tipo_metodo } as EntradaTecnica)))
    );
  }

  getEntradas(id_proyecto: string | number, tipo: string): Observable<EntradaTecnica[]> {
    return this.getTodasLasEntradas(id_proyecto).pipe(
      map(entradas => entradas.filter(e => e.tipo === tipo))
    );
  }

  crearEntrada(entrada: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/analisis`,
      {
        id_proyecto: entrada.proyectoId,
        tipo_metodo: entrada.tipo === 'taller-jad' ? 'focus_group' : (entrada.tipo === 'entrevistas' ? 'entrevista' : 'documentos'),
        contenido: entrada
      },
      this.getAuthHeaders()
    );
  }

  eliminarEntrada(id: string | number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/analisis/${id}`,
      this.getAuthHeaders()
    );
  }

  // --- REQUERIMIENTOS (ANALISIS) ---
  getRequerimientosPorTipo(id_proyecto: string | number, tipo: string): Observable<Requerimiento[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/analisis/proyecto/${id_proyecto}`,
      this.getAuthHeaders()
    ).pipe(
      map(res => res
        .map(r => ({ ...r.contenido, id: r.id_analisis } as Requerimiento))
        .filter(r => r.tipo === tipo)
      )
    );
  }

  getRequerimientos(id_proyecto: string | number): Observable<Requerimiento[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/analisis/proyecto/${id_proyecto}`,
      this.getAuthHeaders()
    ).pipe(
      map(res => res.map(r => ({ ...r.contenido, id: r.id_analisis } as Requerimiento)))
    );
  }

  crearRequerimiento(req: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/analisis`,
      {
        id_proyecto: req.proyectoId,
        tipo_metodo: 'historias_usuarios',
        contenido: req
      },
      this.getAuthHeaders()
    );
  }

  actualizarRequerimiento(req: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/analisis/${req.id}`,
      {
        tipo_metodo: 'historias_usuarios',
        contenido: req
      },
      this.getAuthHeaders()
    );
  }

  eliminarRequerimiento(id: string | number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/analisis/${id}`,
      this.getAuthHeaders()
    );
  }

  generarCodigoRequerimiento(proyectoId: string, tipo: string): string {
    const prefijos: Record<string, string> = {
      'funcional': 'RF',
      'no-funcional': 'RNF',
      'regla-negocio': 'RN',
    };
    return `${prefijos[tipo] || 'R'}-${Math.floor(Math.random() * 1000)}`;
  }

  // --- DIAGRAMAS ---
  obtenerDiagramas(id_proyecto: number | string): Observable<Diagrama[]> {
    return this.http.get<Diagrama[]>(
      `${this.apiUrl}/diagramas/proyecto/${id_proyecto}`,
      this.getAuthHeaders()
    );
  }

  guardarDiagrama(diagrama: Partial<Diagrama>): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/diagramas`,
      diagrama,
      this.getAuthHeaders()
    );
  }

  // --- PROMPTS ---
  obtenerPrompts(id_proyecto: number | string): Observable<Prompt[]> {
    return this.http.get<Prompt[]>(
      `${this.apiUrl}/prompts/proyecto/${id_proyecto}`,
      this.getAuthHeaders()
    );
  }

  guardarPrompt(prompt: Partial<Prompt>): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/prompts`,
      prompt,
      this.getAuthHeaders()
    );
  }

  generarPromptIA(id_proyecto: number | string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/prompts/generar/${id_proyecto}`,
      {},
      this.getAuthHeaders()
    );
  }
}

import { Injectable } from '@angular/core';

export interface Proyecto {
  id: string;
  nombre: string;
  descripcion: string;
  metodologia: string;
  fechaInicio: string;
  estado: 'activo' | 'pausado' | 'completado';
  creadoEn: string;
}

export interface EntradaTecnica {
  id: string;
  proyectoId: string;
  tipo: string;
  titulo: string;
  datos: Record<string, any>;
  creadoEn: string;
}

export interface Requerimiento {
  id: string;
  proyectoId: string;
  codigo: string;
  tipo: 'funcional' | 'no-funcional' | 'regla-negocio';
  titulo: string;
  descripcion: string;
  prioridad: 'alta' | 'media' | 'baja';
  estado: 'propuesto' | 'aprobado' | 'implementado' | 'descartado';
  actorPrincipal: string;
  moduloRelacionado: string;
  criteriosAceptacion: string;
  dependencias: string;
  creadoEn: string;
}

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private PROYECTOS_KEY = 'pm_proyectos';
  private ENTRADAS_KEY = 'pm_entradas_tecnicas';
  private REQUERIMIENTOS_KEY = 'pm_requerimientos';

  getProyectos(): Proyecto[] {
    const raw = localStorage.getItem(this.PROYECTOS_KEY);
    if (raw) return JSON.parse(raw);
    // Datos de ejemplo precargados
    const ejemplos: Proyecto[] = [
      {
        id: 'p1',
        nombre: 'Sistema de Inventario',
        descripcion: 'Control de stock y movimientos de almacén',
        metodologia: 'Ágil (Scrum)',
        fechaInicio: '2026-01-15',
        estado: 'activo',
        creadoEn: '2026-01-15T08:00:00Z',
      },
      {
        id: 'p2',
        nombre: 'Portal RH',
        descripcion: 'Módulo de gestión de recursos humanos y nómina',
        metodologia: 'Cascada',
        fechaInicio: '2026-02-01',
        estado: 'pausado',
        creadoEn: '2026-02-01T10:00:00Z',
      },
    ];
    localStorage.setItem(this.PROYECTOS_KEY, JSON.stringify(ejemplos));
    return ejemplos;
  }

  getProyecto(id: string): Proyecto | undefined {
    return this.getProyectos().find((p) => p.id === id);
  }

  crearProyecto(datos: Omit<Proyecto, 'id' | 'creadoEn'>): Proyecto {
    const proyectos = this.getProyectos();
    const nuevo: Proyecto = {
      ...datos,
      id: 'p' + Date.now(),
      creadoEn: new Date().toISOString(),
    };
    proyectos.push(nuevo);
    localStorage.setItem(this.PROYECTOS_KEY, JSON.stringify(proyectos));
    return nuevo;
  }

  getEntradas(proyectoId: string, tipo: string): EntradaTecnica[] {
    const raw = localStorage.getItem(this.ENTRADAS_KEY);
    const todas: EntradaTecnica[] = raw ? JSON.parse(raw) : [];
    return todas.filter((e) => e.proyectoId === proyectoId && e.tipo === tipo);
  }

  getTodasLasEntradas(proyectoId: string): EntradaTecnica[] {
    const raw = localStorage.getItem(this.ENTRADAS_KEY);
    const todas: EntradaTecnica[] = raw ? JSON.parse(raw) : [];
    return todas.filter((e) => e.proyectoId === proyectoId);
  }

  contarEntradas(proyectoId: string, tipo: string): number {
    return this.getEntradas(proyectoId, tipo).length;
  }

  crearEntrada(entrada: Omit<EntradaTecnica, 'id' | 'creadoEn'>): EntradaTecnica {
    const raw = localStorage.getItem(this.ENTRADAS_KEY);
    const todas: EntradaTecnica[] = raw ? JSON.parse(raw) : [];
    const nueva: EntradaTecnica = {
      ...entrada,
      id: 'e' + Date.now(),
      creadoEn: new Date().toISOString(),
    };
    todas.push(nueva);
    localStorage.setItem(this.ENTRADAS_KEY, JSON.stringify(todas));
    return nueva;
  }

  eliminarEntrada(id: string): void {
    const raw = localStorage.getItem(this.ENTRADAS_KEY);
    const todas: EntradaTecnica[] = raw ? JSON.parse(raw) : [];
    const filtradas = todas.filter((e) => e.id !== id);
    localStorage.setItem(this.ENTRADAS_KEY, JSON.stringify(filtradas));
  }

  getRequerimientos(proyectoId: string): Requerimiento[] {
    const raw = localStorage.getItem(this.REQUERIMIENTOS_KEY);
    const todos: Requerimiento[] = raw ? JSON.parse(raw) : [];
    return todos.filter((r) => r.proyectoId === proyectoId);
  }

  getRequerimientosPorTipo(proyectoId: string, tipo: string): Requerimiento[] {
    return this.getRequerimientos(proyectoId).filter((r) => r.tipo === tipo);
  }

  crearRequerimiento(req: Omit<Requerimiento, 'id' | 'creadoEn'>): Requerimiento {
    const raw = localStorage.getItem(this.REQUERIMIENTOS_KEY);
    const todos: Requerimiento[] = raw ? JSON.parse(raw) : [];
    const nuevo: Requerimiento = {
      ...req,
      id: 'r' + Date.now(),
      creadoEn: new Date().toISOString(),
    };
    todos.push(nuevo);
    localStorage.setItem(this.REQUERIMIENTOS_KEY, JSON.stringify(todos));
    return nuevo;
  }

  eliminarRequerimiento(id: string): void {
    const raw = localStorage.getItem(this.REQUERIMIENTOS_KEY);
    const todos: Requerimiento[] = raw ? JSON.parse(raw) : [];
    const filtrados = todos.filter((r) => r.id !== id);
    localStorage.setItem(this.REQUERIMIENTOS_KEY, JSON.stringify(filtrados));
  }

  actualizarRequerimiento(req: Requerimiento): void {
    const raw = localStorage.getItem(this.REQUERIMIENTOS_KEY);
    const todos: Requerimiento[] = raw ? JSON.parse(raw) : [];
    const idx = todos.findIndex((r) => r.id === req.id);
    if (idx >= 0) {
      todos[idx] = req;
      localStorage.setItem(this.REQUERIMIENTOS_KEY, JSON.stringify(todos));
    }
  }

  generarCodigoRequerimiento(proyectoId: string, tipo: string): string {
    const prefijos: Record<string, string> = {
      'funcional': 'RF',
      'no-funcional': 'RNF',
      'regla-negocio': 'RN',
    };
    const prefijo = prefijos[tipo] || 'R';
    const existentes = this.getRequerimientosPorTipo(proyectoId, tipo);
    const num = existentes.length + 1;
    return `${prefijo}-${num.toString().padStart(3, '0')}`;
  }
}

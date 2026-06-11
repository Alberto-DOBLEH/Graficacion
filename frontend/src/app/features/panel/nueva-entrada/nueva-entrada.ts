import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ProjectService, Proyecto } from '../../../core/services/project.service';

interface Campo {
  key: string;
  label: string;
  tipo: 'text' | 'textarea' | 'date' | 'time' | 'select';
  placeholder?: string;
  options?: string[];
  requerido?: boolean;
}

interface TecnicaFormConfig {
  nombre: string;
  icono: string;
  color: string;
  campos: Campo[];
}

const CONFIGS: Record<string, TecnicaFormConfig> = {
  entrevistas: {
    nombre: 'Entrevistas',
    icono: 'mic',
    color: '#6366f1',
    campos: [
      { key: 'entrevistado', label: 'Nombre del entrevistado', tipo: 'text', placeholder: 'Ej: Juan Pérez', requerido: true },
      { key: 'rol', label: 'Rol / Cargo', tipo: 'text', placeholder: 'Ej: Jefe de operaciones' },
      { key: 'fecha', label: 'Fecha de entrevista', tipo: 'date', requerido: true },
      { key: 'duracion', label: 'Duración (minutos)', tipo: 'text', placeholder: 'Ej: 45' },
      { key: 'objetivo', label: 'Objetivo de la entrevista', tipo: 'textarea', placeholder: 'Describe qué se buscaba obtener...' },
      { key: 'preguntas', label: 'Preguntas realizadas', tipo: 'textarea', placeholder: 'Lista las preguntas principales...' },
      { key: 'respuestas', label: 'Respuestas / Hallazgos', tipo: 'textarea', placeholder: 'Resumen de las respuestas...', requerido: true },
      { key: 'observaciones', label: 'Observaciones adicionales', tipo: 'textarea', placeholder: 'Notas extra...' },
    ],
  },
  cuestionarios: {
    nombre: 'Cuestionarios',
    icono: 'assignment',
    color: '#f59e0b',
    campos: [
      { key: 'titulo', label: 'Título del cuestionario', tipo: 'text', placeholder: 'Ej: Cuestionario de necesidades del usuario', requerido: true },
      { key: 'poblacion', label: 'Población objetivo', tipo: 'text', placeholder: 'Ej: Usuarios del área de ventas' },
      { key: 'fecha', label: 'Fecha de aplicación', tipo: 'date', requerido: true },
      { key: 'respondentes', label: 'N° de respondentes', tipo: 'text', placeholder: 'Ej: 25' },
      { key: 'preguntas', label: 'Preguntas del cuestionario', tipo: 'textarea', placeholder: 'Lista cada pregunta...', requerido: true },
      { key: 'resultados', label: 'Resultados / Estadísticas', tipo: 'textarea', placeholder: 'Resumen de respuestas y porcentajes...' },
      { key: 'conclusiones', label: 'Conclusiones', tipo: 'textarea', placeholder: 'Qué se concluye de los datos...' },
    ],
  },
  observacion: {
    nombre: 'Observación',
    icono: 'visibility',
    color: '#10b981',
    campos: [
      { key: 'lugar', label: 'Lugar / Área observada', tipo: 'text', placeholder: 'Ej: Almacén central', requerido: true },
      { key: 'observador', label: 'Nombre del observador', tipo: 'text', placeholder: 'Nombre del analista' },
      { key: 'fecha', label: 'Fecha', tipo: 'date', requerido: true },
      { key: 'horaInicio', label: 'Hora de inicio', tipo: 'time' },
      { key: 'horaFin', label: 'Hora de fin', tipo: 'time' },
      { key: 'tipoObservacion', label: 'Tipo de observación', tipo: 'select', options: ['Pasiva (sin intervención)', 'Participativa', 'Estructurada', 'No estructurada'] },
      { key: 'descripcion', label: 'Descripción de lo observado', tipo: 'textarea', placeholder: 'Describe detalladamente lo que se observó...', requerido: true },
      { key: 'problemas', label: 'Problemas / Ineficiencias detectadas', tipo: 'textarea', placeholder: 'Anota los puntos de mejora observados...' },
      { key: 'hallazgos', label: 'Hallazgos relevantes para los requisitos', tipo: 'textarea', placeholder: 'Requisitos implícitos identificados...' },
    ],
  },
  'taller-jad': {
    nombre: 'Taller JAD/RAD',
    icono: 'groups',
    color: '#ec4899',
    campos: [
      { key: 'tema', label: 'Tema del taller', tipo: 'text', placeholder: 'Ej: Definición de módulo de ventas', requerido: true },
      { key: 'facilitador', label: 'Nombre del facilitador', tipo: 'text', placeholder: 'Quien dirigió la sesión' },
      { key: 'fecha', label: 'Fecha', tipo: 'date', requerido: true },
      { key: 'duracion', label: 'Duración (horas)', tipo: 'text', placeholder: 'Ej: 3' },
      { key: 'participantes', label: 'Participantes', tipo: 'textarea', placeholder: 'Lista los nombres y roles de participantes...' },
      { key: 'agenda', label: 'Agenda / Puntos tratados', tipo: 'textarea', placeholder: 'Enumera los temas abordados...' },
      { key: 'acuerdos', label: 'Acuerdos y decisiones', tipo: 'textarea', placeholder: 'Qué se acordó en la sesión...', requerido: true },
      { key: 'requisitos', label: 'Requisitos identificados', tipo: 'textarea', placeholder: 'Lista los requisitos definidos...' },
      { key: 'pendientes', label: 'Tareas pendientes', tipo: 'textarea', placeholder: 'Qué queda por resolver...' },
    ],
  },
  prototipado: {
    nombre: 'Prototipado',
    icono: 'desktop_mac',
    color: '#3b82f6',
    campos: [
      { key: 'nombrePrototipo', label: 'Nombre del prototipo', tipo: 'text', placeholder: 'Ej: Pantalla de login v2', requerido: true },
      { key: 'tipo', label: 'Tipo de prototipo', tipo: 'select', options: ['Boceto en papel', 'Wireframe digital', 'Mockup de alta fidelidad', 'Prototipo funcional', 'Storyboard'] },
      { key: 'herramienta', label: 'Herramienta utilizada', tipo: 'text', placeholder: 'Ej: Figma, Balsamiq, lápiz y papel...' },
      { key: 'fecha', label: 'Fecha de creación', tipo: 'date', requerido: true },
      { key: 'funcionalidad', label: 'Funcionalidad representada', tipo: 'textarea', placeholder: 'Qué flujo o función muestra el prototipo...' },
      { key: 'retroalimentacion', label: 'Retroalimentación del cliente', tipo: 'textarea', placeholder: 'Comentarios recibidos...', requerido: true },
      { key: 'cambiossolicitados', label: 'Cambios solicitados', tipo: 'textarea', placeholder: 'Modificaciones pedidas por el usuario...' },
      { key: 'conclusiones', label: 'Conclusiones', tipo: 'textarea', placeholder: 'Qué se validó o descartó...' },
    ],
  },
  'casos-de-uso': {
    nombre: 'Casos de Uso',
    icono: 'design_services',
    color: '#00e676',
    campos: [
      { key: 'nombre', label: 'Nombre del caso de uso', tipo: 'text', placeholder: 'Ej: CU-01 Iniciar sesión', requerido: true },
      { key: 'codigo', label: 'Código / ID', tipo: 'text', placeholder: 'Ej: CU-001' },
      { key: 'actor', label: 'Actor principal', tipo: 'text', placeholder: 'Ej: Usuario registrado', requerido: true },
      { key: 'actoresSecundarios', label: 'Actores secundarios', tipo: 'text', placeholder: 'Ej: Administrador, Sistema externo' },
      { key: 'precondiciones', label: 'Precondiciones', tipo: 'textarea', placeholder: 'Qué debe ser verdad antes de ejecutar el caso...' },
      { key: 'flujoNormal', label: 'Flujo principal / Normal', tipo: 'textarea', placeholder: 'Pasos del flujo exitoso...', requerido: true },
      { key: 'flujoAlternativo', label: 'Flujos alternativos / Excepciones', tipo: 'textarea', placeholder: 'Qué pasa si algo falla o varía...' },
      { key: 'postcondiciones', label: 'Postcondiciones', tipo: 'textarea', placeholder: 'Estado del sistema tras ejecutarlo...' },
      { key: 'notas', label: 'Notas adicionales', tipo: 'textarea', placeholder: 'Consideraciones técnicas, restricciones...' },
    ],
  },
  'anexos': {
    nombre: 'Anexos',
    icono: 'attach_file',
    color: '#0ea5e9',
    campos: [
      { key: 'descripcion', label: 'Descripción breve del anexo', tipo: 'text', placeholder: 'Ej: Manual de procesos internos', requerido: true },
      { key: 'fecha', label: 'Fecha de adición', tipo: 'date', requerido: true },
      { key: 'origen', label: 'Origen / Fuente', tipo: 'text', placeholder: 'Ej: Departamento de TI, Cliente, Equipo de desarrollo' },
      { key: 'tipoAnexo', label: 'Tipo de anexo', tipo: 'select', options: ['Documento', 'Imagen / Captura', 'Diagrama externo', 'Acta de reunión', 'Correo electrónico', 'Otro'] },
      { key: 'contenido', label: 'Contenido / Texto del anexo', tipo: 'textarea', placeholder: 'Pega aquí el contenido relevante del documento, acta, correo o texto de soporte...', requerido: true },
      { key: 'notas', label: 'Notas adicionales', tipo: 'textarea', placeholder: 'Observaciones, contexto adicional...' },
    ],
  },
};

@Component({
  selector: 'app-nueva-entrada',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatIconModule],
  templateUrl: './nueva-entrada.html',
  styleUrl: './nueva-entrada.css',
})
export class NuevaEntrada implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private projectService = inject(ProjectService);
  private cdr = inject(ChangeDetectorRef);

  proyectoId = '';
  tipo = '';
  proyecto: Proyecto | undefined;
  config: TecnicaFormConfig = CONFIGS['entrevistas'];
  datos: Record<string, string> = {};
  titulo = '';
  guardando = false;
  errorMsg = '';
  
  isDragOver = false;
  analizandoArchivo = false;

  get campos(): Campo[] {
    return this.config.campos;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.procesarArchivo(files[0]);
    }
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.procesarArchivo(files[0]);
    }
  }

  procesarArchivo(file: File) {
    this.analizandoArchivo = true;
    this.errorMsg = '';
    this.cdr.markForCheck();

    if ('fecha' in this.datos) {
      this.datos['fecha'] = new Date().toISOString().split('T')[0];
    }
    const nombreLimpio = file.name.replace(/\.[^/.]+$/, "");
    this.titulo = nombreLimpio;

    this.projectService.analizarArchivo(file).subscribe({
      next: (res: any) => {
        this.analizandoArchivo = false;
        if (res.texto && 'contenido' in this.datos) {
          this.datos['contenido'] = res.texto;
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.analizandoArchivo = false;
        this.errorMsg = err.error?.error || 'Error al procesar el archivo. Intenta con otro formato o texto plano.';
        this.cdr.markForCheck();
      }
    });
  }

  ngOnInit() {
    this.proyectoId = this.route.snapshot.paramMap.get('id') ?? '';
    this.tipo = this.route.snapshot.paramMap.get('tipo') ?? '';
    this.config = CONFIGS[this.tipo] ?? CONFIGS['entrevistas'];
    // Inicializar datos
    this.config.campos.forEach((c) => (this.datos[c.key] = ''));
    this.cdr.markForCheck();
    this.projectService.obtenerProyecto(this.proyectoId).subscribe({
      next: (p) => { 
        this.proyecto = p; 
        this.cdr.markForCheck();
      },
      error: () => {}
    });
  }

  onGuardar() {
    if (!this.titulo.trim()) {
      this.errorMsg = 'El título de la entrada es obligatorio.';
      return;
    }
    const camposRequeridos = this.config.campos.filter((c) => c.requerido);
    const faltante = camposRequeridos.find((c) => !this.datos[c.key]?.trim());
    if (faltante) {
      this.errorMsg = `El campo "${faltante.label}" es obligatorio.`;
      return;
    }
    this.guardando = true;
    this.errorMsg = '';
    this.cdr.markForCheck();
    this.projectService.crearEntrada({
      proyectoId: this.proyectoId,
      tipo: this.tipo,
      titulo: this.titulo.trim(),
      datos: { ...this.datos },
    }).subscribe({
      next: () => {
        this.guardando = false;
        this.cdr.markForCheck();
        this.router.navigate(['/app/proyecto', this.proyectoId, 'tecnicas', this.tipo]);
      },
      error: () => {
        this.guardando = false;
        this.errorMsg = 'Error al guardar la entrada. Intenta de nuevo.';
        this.cdr.markForCheck();
      }
    });
  }
}

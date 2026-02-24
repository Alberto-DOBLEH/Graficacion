import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bienvenida',
  imports: [CommonModule],
  templateUrl: './bienvenida.html',
  styleUrl: './bienvenida.css',
})
export class Bienvenida {
  proyectos: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('http://localhost:3300/proyecto').subscribe({
      next: (data) => {
        this.proyectos = data;
      },
      error: (err) => {
        console.log('Error al cargar proyectos', err);
      }
    });
  }
}
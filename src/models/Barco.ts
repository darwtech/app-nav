// src/models/Barco.ts
export interface Barco {
  numeroMatricula: string;
  nombre: string;
  numeroAmarre: number;
  cuota: number;
  propietarioCedula: string | null; // Relación con Socio
  imagen: string; // URL o base64 de la imagen
}

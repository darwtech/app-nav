// src/models/Socio.ts
export interface Socio {
    cedula: string;
    nombres: string;
    apellidos: string;
    fechaNacimiento: Date;
    sexo: 'M' | 'F';
    estadoCivil: 'soltero' | 'casado' | 'divorciado' | 'viudo';
  }
  
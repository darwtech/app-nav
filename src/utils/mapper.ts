// src/utils/mapper.ts
import { Barco } from "../models/Barco";
import { Salida } from "../models/Salida";

export const mapBarcoToFirestore = (barco: Barco) => {
  return {
    numeroMatricula: barco.numeroMatricula,
    nombre: barco.nombre,
    numeroAmarre: barco.numeroAmarre,
    cuota: barco.cuota,
    propietarioCedula: barco.propietarioCedula,
    imagen: barco.imagen
  };
};

export const mapSalidaToFirestore = (salida: Salida) => {
  return {
    barcoMatricula: salida.barcoMatricula,
    fechaHoraSalida: salida.fechaHoraSalida,
    destino: salida.destino,
    conductorCedula: salida.conductorCedula,
    esPropietario: salida.esPropietario,
    esSocio: salida.esSocio,
    alquiler: salida.alquiler
  };
};

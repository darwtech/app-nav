import { db } from "../../database/conex";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { Socio } from "../models/Socio";

const sociosCollection = collection(db, "socios");

export const listarSocios = async (): Promise<Socio[]> => {
  const snapshot = await getDocs(sociosCollection);
  return snapshot.docs.map(doc => doc.data() as Socio);
};

export const insertarSocio = async (socio: Socio) => {
  await addDoc(sociosCollection, {
    ...socio,
    fechaNacimiento: socio.fechaNacimiento.toISOString(), // Convertir a cadena para Firestore
  });
};

export const eliminarSocio = async (cedula: string) => {
  const snapshot = await getDocs(sociosCollection);
  const socioDoc = snapshot.docs.find(doc => doc.data().cedula === cedula);
  if (socioDoc) {
    await deleteDoc(doc(db, "socios", socioDoc.id));
  }
};

// Función para calcular la edad a partir de la fecha de nacimiento
export const calcularEdad = (fechaNacimiento: Date): number => {
  const hoy = new Date();
  let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  const mes = hoy.getMonth() - fechaNacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
    edad--;
  }
  return edad;
};

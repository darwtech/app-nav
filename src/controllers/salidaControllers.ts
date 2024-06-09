// src/controllers/salidaController.ts
import { db } from "../../database/conex";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { Salida } from "../models/Salida";
import { mapSalidaToFirestore } from "../utils/mapper";

const salidasCollection = collection(db, "salidas");

export const listarSalidas = async (): Promise<Salida[]> => {
  const snapshot = await getDocs(salidasCollection);
  return snapshot.docs.map(doc => doc.data() as Salida);
};

export const insertarSalida = async (salida: Salida) => {
  const salidaData = mapSalidaToFirestore(salida);
  await addDoc(salidasCollection, salidaData);
};

export const modificarSalida = async (id: string, salida: Salida) => {
  const salidaDoc = doc(salidasCollection, id);
  const salidaData = mapSalidaToFirestore(salida);
  await updateDoc(salidaDoc, salidaData);
};

export const eliminarSalida = async (id: string) => {
  const salidaDoc = doc(salidasCollection, id);
  await deleteDoc(salidaDoc);
};

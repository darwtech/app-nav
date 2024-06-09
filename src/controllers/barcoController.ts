// src/controllers/barcoController.ts
import { db } from "../../database/conex";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { Barco } from "../models/Barco";
import { mapBarcoToFirestore } from "../utils/mapper";

const barcosCollection = collection(db, "barcos");

export const listarBarcos = async (): Promise<Barco[]> => {
  const snapshot = await getDocs(barcosCollection);
  return snapshot.docs.map(doc => doc.data() as Barco);
};

export const insertarBarco = async (barco: Barco) => {
  await addDoc(barcosCollection, barco);
};

export const modificarBarco = async (id: string, barco: Barco) => {
  const barcoDoc = doc(db, "barcos", id);
  const barcoData = mapBarcoToFirestore(barco);
  await updateDoc(barcoDoc, barcoData);
};

export const eliminarBarco = async (numeroMatricula: string) => {
  const snapshot = await getDocs(barcosCollection);
  const barcoDoc = snapshot.docs.find(doc => doc.data().numeroMatricula === numeroMatricula);
  if (barcoDoc) {
    await deleteDoc(doc(db, "barcos", barcoDoc.id));
  }
};

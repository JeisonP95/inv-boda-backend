import mongoose from "mongoose";
import dotenv from "dotenv";
import { InvitadoModel } from "../models/Invitado";

dotenv.config();

// Lista de invitados de ejemplo (puedes reemplazar esto con tu lista del Excel)
const invitados = [
  { name: "Valentina", phone: "3001234567", maxGuests: 1 },
  { name: "Yeison", phone: "3007654321", maxGuests: 2 },
  { name: "María García", phone: "3001111111", maxGuests: 2 },
  { name: "Juan Pérez", phone: "3002222222", maxGuests: 1 },
  { name: "Ana López", phone: "3003333333", maxGuests: 2 },
  { name: "Carlos Rodríguez", phone: "3004444444", maxGuests: 1 },
  { name: "Laura Martínez", phone: "3005555555", maxGuests: 2 },
  { name: "Roberto Silva", phone: "3006666666", maxGuests: 1 },
  { name: "Carmen Vega", phone: "3007777777", maxGuests: 2 },
  { name: "Miguel Torres", phone: "3008888888", maxGuests: 1 }
];

async function loadInvitados() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("✅ Conectado a MongoDB");

    // Limpiar invitados existentes
    await InvitadoModel.deleteMany({});
    console.log("🗑️ Invitados existentes eliminados");

    // Insertar nuevos invitados
    const result = await InvitadoModel.insertMany(invitados);
    console.log(`✅ ${result.length} invitados cargados exitosamente`);

    // Mostrar lista de invitados cargados
    console.log("\n📋 Lista de invitados cargados:");
    result.forEach(invitado => {
      console.log(`- ${invitado.name} (${invitado.phone}) - Máx: ${invitado.maxGuests} personas`);
    });

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Desconectado de MongoDB");
  }
}

// Ejecutar el script
loadInvitados();

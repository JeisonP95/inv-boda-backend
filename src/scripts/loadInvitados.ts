import mongoose from "mongoose";
import dotenv from "dotenv";
import { InvitadoModel } from "../models/Invitado";

dotenv.config();

// Lista de invitados de ejemplo
const invitados = [
  { name: "Juan Pérez", phone: "1234567890", maxGuests: 2 },
]

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

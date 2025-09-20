import mongoose from "mongoose";
import dotenv from "dotenv";
import { InvitadoModel } from "../models/Invitado";
import * as fs from "fs";
import * as path from "path";

dotenv.config();

interface CSVInvitado {
  name: string;
  phone: string;
  maxGuests: number;
}

async function loadInvitadosFromCSV(): Promise<void> {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("✅ Conectado a MongoDB");

    const csvPath = path.join(__dirname, "../../invitados.csv");
    const csvContent = fs.readFileSync(csvPath, "utf-8");

    // Procesar archivo CSV
    const invitados: CSVInvitado[] = csvContent
      .split("\n")
      .slice(1) // quitar encabezados
      .map(line => line.split(",").map(field => field.trim()))
      .filter(fields => fields.length === 3)
      .map(([name, phone, maxGuests]) => ({
        name,
        phone,
        maxGuests: Number(maxGuests),
      }))
      .filter(i => i.name && i.phone && !isNaN(i.maxGuests));

    if (!invitados.length) {
      console.log("❌ No se encontraron invitados válidos en el CSV");
      return;
    }

    await InvitadoModel.deleteMany({});
    console.log("🗑️ Invitados existentes eliminados");

    const result = await InvitadoModel.insertMany(invitados);
    console.log(`✅ ${result.length} invitados cargados exitosamente`);

    console.log("\n📋 Lista de invitados cargados:");
    result.forEach(i =>
      console.log(`- ${i.name} (${i.phone}) - Máx: ${i.maxGuests} personas`)
    );
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Desconectado de MongoDB");
  }
}

loadInvitadosFromCSV();

import mongoose from "mongoose";
import dotenv from "dotenv";
import { InvitadoModel } from "../models/Invitado";
import { RSVPModel } from "../models/RSVP";

dotenv.config();

async function testSystem() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("✅ Conectado a MongoDB");

    // 1. Verificar que hay invitados en la base de datos
    const invitados = await InvitadoModel.find();
    console.log(`\n📋 Invitados en la base de datos: ${invitados.length}`);
    
    if (invitados.length === 0) {
      console.log("❌ No hay invitados en la base de datos");
      console.log("💡 Ejecuta primero: npm run load-invitados");
      return;
    }

    // Mostrar algunos invitados
    invitados.slice(0, 5).forEach(invitado => {
      console.log(`- ${invitado.name} (${invitado.phone}) - Máx: ${invitado.maxGuests} personas`);
    });

    // 2. Verificar RSVPs existentes
    const rsvps = await RSVPModel.find();
    console.log(`\n📝 RSVPs en la base de datos: ${rsvps.length}`);

    // 3. Simular búsqueda de invitado
    console.log("\n🔍 Probando búsqueda de invitado...");
    const testInvitado = invitados[0];
    const found = await InvitadoModel.findOne({
      name: { $regex: new RegExp(testInvitado.name, 'i') },
      phone: testInvitado.phone
    });

    if (found) {
      console.log(`✅ Invitado encontrado: ${found.name} - Máx: ${found.maxGuests} personas`);
    } else {
      console.log("❌ Error en la búsqueda");
    }

    // 4. Verificar estructura de datos
    console.log("\n📊 Verificando estructura de datos...");
    
    const invitadoWithMax1 = await InvitadoModel.findOne({ maxGuests: 1 });
    const invitadoWithMax2 = await InvitadoModel.findOne({ maxGuests: 2 });
    
    if (invitadoWithMax1) {
      console.log(`✅ Invitado con maxGuests=1: ${invitadoWithMax1.name}`);
    }
    
    if (invitadoWithMax2) {
      console.log(`✅ Invitado con maxGuests=2: ${invitadoWithMax2.name}`);
    }

    console.log("\n🎉 Sistema funcionando correctamente!");

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Desconectado de MongoDB");
  }
}

// Ejecutar el script
testSystem();

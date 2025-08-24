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

async function loadInvitadosFromCSV() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("✅ Conectado a MongoDB");

    // Ruta al archivo CSV (puedes cambiar esto por la ruta de tu archivo)
    const csvPath = path.join(__dirname, "../../invitados.csv");
    
    if (!fs.existsSync(csvPath)) {
      console.log("📁 Archivo CSV no encontrado. Creando archivo de ejemplo...");
      
      // Crear archivo CSV de ejemplo
      const csvContent = `name,phone,maxGuests
Valentina,3001234567,1
Yeison,3007654321,2
María García,3001111111,2
Juan Pérez,3002222222,1
Ana López,3003333333,2
Carlos Rodríguez,3004444444,1
Laura Martínez,3005555555,2
Roberto Silva,3006666666,1
Carmen Vega,3007777777,2
Miguel Torres,3008888888,1`;
      
      fs.writeFileSync(csvPath, csvContent);
      console.log("📄 Archivo CSV de ejemplo creado en:", csvPath);
      console.log("💡 Edita este archivo con tu lista real de invitados y ejecuta el script nuevamente");
      return;
    }

    // Leer archivo CSV
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    // Saltar la primera línea (encabezados)
    const dataLines = lines.slice(1);
    
    const invitados: CSVInvitado[] = dataLines.map(line => {
      const [name, phone, maxGuests] = line.split(',').map(field => field.trim());
      return {
        name,
        phone,
        maxGuests: parseInt(maxGuests)
      };
    }).filter(invitado => 
      invitado.name && 
      invitado.phone && 
      !isNaN(invitado.maxGuests) && 
      invitado.maxGuests >= 1 && 
      invitado.maxGuests <= 2
    );

    if (invitados.length === 0) {
      console.log("❌ No se encontraron invitados válidos en el CSV");
      return;
    }

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
loadInvitadosFromCSV();

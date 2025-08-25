import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import rsvpRoutes from "./routes/rsvp";
import invitadoRoutes from "./routes/invitados";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
/*app.use(cors({
  origin: ["https://inv-boda.vercel.app", "http://localhost:3000"],
  credentials: true
})); */
app.use(cors());
app.use(express.json());


// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.log("✅ Conectado a MongoDB Atlas");
    console.log(`🌐 Backend URL: https://inv-boda-backend.onrender.com`);
    console.log(`🎨 Frontend URL: https://inv-boda.vercel.app`);
  })
  .catch(err => console.error("❌ Error al conectar a MongoDB:", err));

// Rutas
app.use("/api/rsvp", rsvpRoutes);
app.use("/api/invitados", invitadoRoutes);

// Ruta de salud
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    backendUrl: "https://inv-boda-backend.onrender.com",
    frontendUrl: "https://inv-boda.vercel.app"
  });
});

// Middleware de errores
app.use(errorHandler);

// Servidor
app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en puerto ${PORT}`);
  console.log(`🔗 URL: https://inv-boda-backend.onrender.com`);
});

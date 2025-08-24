// Archivo de configuración de ejemplo para el backend
// Copia este archivo como .env en la raíz del backend y ajusta los valores

export const EXAMPLE_CONFIG = {
  // MongoDB Connection String
  MONGO_URI: "mongodb+srv://username:password@cluster.mongodb.net/database_name",
  
  // Server Port
  PORT: 5000,
  
  // Environment
  NODE_ENV: "production",
  
  // Application URLs
  FRONTEND_URL: "https://inv-boda.vercel.app",
  BACKEND_URL: "https://inv-boda-backend.onrender.com"
};

// Variables de entorno que debes configurar en tu archivo .env:
/*
MONGO_URI=mongodb+srv://tu_usuario:tu_password@tu_cluster.mongodb.net/tu_database
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://inv-boda.vercel.app
BACKEND_URL=https://inv-boda-backend.onrender.com
*/

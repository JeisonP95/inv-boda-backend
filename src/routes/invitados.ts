import { Router } from "express";
import { InvitadoModel } from "../models/Invitado";

const router = Router();

// Función para normalizar nombres (quitar acentos, espacios extra, etc.)
const normalizeName = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ') // Reemplazar múltiples espacios con uno solo
    .normalize('NFD') // Normalizar caracteres Unicode
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z\s]/g, ''); // Solo letras y espacios
};

// Función para crear patrones de búsqueda más flexibles
const createSearchPatterns = (name: string): string[] => {
  const normalized = normalizeName(name);
  const words = normalized.split(' ').filter(word => word.length > 0);
  
  const patterns = [];
  
  // Patrón exacto
  patterns.push(normalized);
  
  // Patrón con palabras en cualquier orden
  if (words.length > 1) {
    patterns.push(words.reverse().join(' '));
  }
  
  // Patrones con palabras individuales (para nombres compuestos)
  words.forEach(word => {
    if (word.length > 2) {
      patterns.push(word);
    }
  });
  
  // NUEVO: Búsqueda por fragmentos más inteligente
  if (words.length > 1) {
    // Combinaciones de 2 palabras consecutivas
    for (let i = 0; i < words.length - 1; i++) {
      const fragment = words.slice(i, i + 2).join(' ');
      if (fragment.length > 3) {
        patterns.push(fragment);
      }
    }
    
    // Combinaciones de 3 palabras consecutivas
    if (words.length > 2) {
      for (let i = 0; i < words.length - 2; i++) {
        const fragment = words.slice(i, i + 3).join(' ');
        if (fragment.length > 4) {
          patterns.push(fragment);
        }
      }
    }
  }
  
  // NUEVO: Búsqueda por inicio de palabras (útil para "Mar" -> "María")
  words.forEach(word => {
    if (word.length > 2) {
      // Buscar nombres que empiecen con esta palabra
      patterns.push(`^${word}`);
      // Buscar nombres que contengan esta palabra al inicio
      patterns.push(`^${word}\\s`);
    }
  });
  
  // NUEVO: Búsqueda por apellidos comunes (útil para "González" -> "María José González")
  if (words.length > 1) {
    // Si hay más de una palabra, la última podría ser un apellido
    const possibleLastName = words[words.length - 1];
    if (possibleLastName.length > 3) {
      patterns.push(possibleLastName);
    }
  }
  
  // Eliminar duplicados y patrones muy cortos
  const uniquePatterns = [...new Set(patterns)].filter(pattern => pattern.length > 2);
  
  console.log("🔍 Patrones de búsqueda generados:", uniquePatterns);
  
  return uniquePatterns;
};

// NUEVA FUNCIÓN: Buscar por palabras no consecutivas
const searchByNonConsecutiveWords = async (searchWords: string[]): Promise<any> => {
  // Buscar nombres que contengan TODAS las palabras de búsqueda (en cualquier orden)
  const searchRegex = searchWords.map(word => `(?=.*${word})`).join('');
  const fullRegex = new RegExp(`^${searchRegex}.*$`, 'i');
  
  console.log("🔍 Buscando con regex de palabras no consecutivas:", fullRegex);
  
  return await InvitadoModel.findOne({
    name: fullRegex
  });
};

// Buscar invitado por nombre y teléfono
router.post("/find", async (req, res, next) => {
  try {
    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: "Nombre y teléfono son requeridos" 
      });
    }

    // Crear patrones de búsqueda flexibles
    const searchPatterns = createSearchPatterns(name);
    
    // Buscar por nombre usando múltiples patrones
    let invitado = null;
    
    for (const pattern of searchPatterns) {
      invitado = await InvitadoModel.findOne({
        name: { $regex: new RegExp(pattern, 'i') },
        phone: phone
      });
      
      if (invitado) break;
    }

    if (!invitado) {
      // Si no se encuentra con el teléfono exacto, intentar con variaciones del teléfono
      const phoneVariations = [
        phone,
        phone.replace(/\D/g, ''), // Solo números
        phone.replace(/\s/g, ''), // Sin espacios
        phone.replace(/[^\d]/g, '') // Solo dígitos
      ];
      
      for (const phoneVar of phoneVariations) {
        for (const pattern of searchPatterns) {
          invitado = await InvitadoModel.findOne({
            name: { $regex: new RegExp(pattern, 'i') },
            phone: { $regex: new RegExp(phoneVar, 'i') }
          });
          
          if (invitado) break;
        }
        if (invitado) break;
      }
    }

    // Si aún no se encuentra, buscar SOLO por teléfono (ignorando el nombre)
    if (!invitado) {
      console.log("🔍 Búsqueda por nombre falló, intentando solo por teléfono...");
      
      const phoneVariations = [
        phone,
        phone.replace(/\D/g, ''), // Solo números
        phone.replace(/\s/g, ''), // Sin espacios
        phone.replace(/[^\d]/g, '') // Solo dígitos
      ];
      
      for (const phoneVar of phoneVariations) {
        invitado = await InvitadoModel.findOne({
          phone: { $regex: new RegExp(phoneVar, 'i') }
        });
        
        if (invitado) {
          console.log("✅ Invitado encontrado solo por teléfono:", invitado.name);
          break;
        }
      }
    }

    // NUEVO: Si aún no se encuentra, intentar búsqueda SOLO por nombre (útil para fragmentos)
    if (!invitado) {
      console.log("🔍 Búsqueda por teléfono falló, intentando solo por nombre...");
      
      for (const pattern of searchPatterns) {
        // Solo buscar por nombre si el patrón es suficientemente largo
        if (pattern.length > 3) {
          invitado = await InvitadoModel.findOne({
            name: { $regex: new RegExp(pattern, 'i') }
          });
          
          if (invitado) {
            console.log("✅ Invitado encontrado solo por nombre con patrón:", invitado.name);
            break;
          }
        }
      }
    }

    // NUEVO: Si aún no se encuentra, intentar búsqueda por palabras no consecutivas
    if (!invitado) {
      console.log("🔍 Búsqueda por patrones falló, intentando por palabras no consecutivas...");
      
      const searchWords = normalizeName(name).split(' ').filter(word => word.length > 2);
      if (searchWords.length > 1) {
        invitado = await searchByNonConsecutiveWords(searchWords);
        
        if (invitado) {
          console.log("✅ Invitado encontrado por palabras no consecutivas:", invitado.name);
        }
      }
    }

    if (!invitado) {
      return res.json({ 
        success: false, 
        message: "Invitado no encontrado. Verifica que el nombre y teléfono coincidan con tu invitación." 
      });
    }

    res.json({
      success: true,
      invitado: {
        name: invitado.name,
        phone: invitado.phone,
        maxGuests: invitado.maxGuests
      }
    });
  } catch (error) {
    next(error);
  }
});

// Crear nuevo invitado (para administración)
router.post("/", async (req, res, next) => {
  try {
    const { name, phone, maxGuests } = req.body;

    if (!name || !phone || !maxGuests) {
      return res.status(400).json({ 
        success: false, 
        message: "Todos los campos son requeridos" 
      });
    }

    if (maxGuests < 1 || maxGuests > 2) {
      return res.status(400).json({ 
        success: false, 
        message: "maxGuests debe ser 1 o 2" 
      });
    }

    const invitado = new InvitadoModel({ name, phone, maxGuests });
    await invitado.save();

    res.status(201).json({ success: true, invitado });
  } catch (error) {
    next(error);
  }
});

// Listar todos los invitados (para administración)
router.get("/", async (req, res, next) => {
  try {
    const invitados = await InvitadoModel.find().select('name phone maxGuests');
    res.json(invitados);
  } catch (error) {
    next(error);
  }
});

export default router;

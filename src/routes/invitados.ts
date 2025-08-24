import { Router } from "express";
import { InvitadoModel } from "../models/Invitado";

const router = Router();

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

    // Buscar por nombre (ignorando mayúsculas/minúsculas) y teléfono
    const invitado = await InvitadoModel.findOne({
      name: { $regex: new RegExp(name, 'i') },
      phone: phone
    });

    if (!invitado) {
      return res.json({ 
        success: false, 
        message: "Invitado no encontrado" 
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
